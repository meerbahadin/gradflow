import { useEffect, useRef } from 'react'
import { GradientConfig } from '@/types/gradient'
import { normalizeRgb } from '@/lib/color-utils'
import { GRADIENT_TYPE_NUMBER } from '@/constants/gradients'
import { createRenderer, FrameUniforms, Vec3 } from '@/core/renderer'

export interface UseWebGLRendererOptions {
  /** Freeze the animation. A single static frame is still rendered. */
  paused?: boolean
  /** Milliseconds a config change takes to blend in. 0 switches instantly. */
  transition?: number
  /** Bend the pattern under the pointer. */
  interactive?: boolean
  /** Keep the drawing buffer readable for toDataURL/toBlob. */
  preserveDrawingBuffer?: boolean
}

export interface UseWebGLRendererReturn {
  canvasRef: React.RefObject<HTMLCanvasElement | null>
}

/** The values that blend from one config to the next. */
type Blend = {
  color1: Vec3
  color2: Vec3
  color3: Vec3
  speed: number
  scale: number
  noise: number
}

const toBlend = (config: GradientConfig): Blend => ({
  color1: normalizeRgb(config.color1),
  color2: normalizeRgb(config.color2),
  color3: normalizeRgb(config.color3),
  speed: config.speed,
  scale: config.scale,
  noise: config.noise,
})

const typeNumber = (config: GradientConfig) =>
  GRADIENT_TYPE_NUMBER[config.type ?? 'animated'] ?? GRADIENT_TYPE_NUMBER.animated

const same3 = (a: Vec3, b: Vec3) =>
  a[0] === b[0] && a[1] === b[1] && a[2] === b[2]

const sameBlend = (a: Blend, b: Blend) =>
  same3(a.color1, b.color1) &&
  same3(a.color2, b.color2) &&
  same3(a.color3, b.color3) &&
  a.speed === b.speed &&
  a.scale === b.scale &&
  a.noise === b.noise

const lerp = (a: number, b: number, k: number) => a + (b - a) * k
const lerp3 = (a: Vec3, b: Vec3, k: number): Vec3 => [
  lerp(a[0], b[0], k),
  lerp(a[1], b[1], k),
  lerp(a[2], b[2], k),
]

export function useWebGLRenderer(
  config: GradientConfig,
  options: UseWebGLRendererOptions = {}
): UseWebGLRendererReturn {
  const {
    paused = false,
    transition = 700,
    interactive = false,
    preserveDrawingBuffer = false,
  } = options

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const configRef = useRef(config)
  const pausedRef = useRef(paused)
  const transitionRef = useRef(transition)
  const controlsRef = useRef<{
    sync: () => void
    setConfig: (config: GradientConfig) => void
    setPointer: (x: number, y: number, inside: boolean) => void
  } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = createRenderer(canvas, { preserveDrawingBuffer })
    if (!renderer) return

    const size = { width: 1, height: 1, cssWidth: 1, cssHeight: 1 }

    const initial = toBlend(configRef.current)
    let current = initial
    let from = initial
    let to = initial
    // when a blend started; 0 while nothing is in flight
    let blendStart = 0
    let blendDuration = 0

    const uniforms: FrameUniforms = {
      time: 0,
      time2: 0,
      color1: initial.color1,
      color2: initial.color2,
      color3: initial.color3,
      scale: initial.scale,
      noise: initial.noise,
      type: typeNumber(configRef.current),
      prevType: typeNumber(configRef.current),
      mix: 1,
      pointer: [0.5, 0.5, 0],
    }
    const pointerTarget: Vec3 = [0.5, 0.5, 0]

    const renderFrame = () => {
      uniforms.color1 = current.color1
      uniforms.color2 = current.color2
      uniforms.color3 = current.color3
      uniforms.scale = current.scale
      uniforms.noise = current.noise
      renderer.draw(
        uniforms,
        size.width,
        size.height,
        size.cssWidth,
        size.cssHeight
      )
    }

    const handleResize = () => {
      const parent = canvas.parentElement
      if (!parent) return

      const w = parent.clientWidth
      const h = parent.clientHeight
      const dpr = Math.min(window.devicePixelRatio, 2)

      size.cssWidth = Math.max(w, 1)
      size.cssHeight = Math.max(h, 1)
      size.width = Math.max(Math.round(w * dpr), 1)
      size.height = Math.max(Math.round(h * dpr), 1)

      canvas.width = size.width
      canvas.height = size.height
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'

      // resizing clears the canvas, so repaint right away
      renderFrame()
    }

    // animation only runs while unpaused, in view, on a visible tab,
    // and the user hasn't asked for reduced motion — otherwise a single
    // static frame stays on screen
    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )
    const visibility = {
      inView: true,
      pageVisible: !document.hidden,
      reducedMotion: reducedMotionQuery.matches,
    }

    let rafId = 0
    let lastFrameTime: number | null = null

    const finishBlend = () => {
      blendStart = 0
      current = to
      uniforms.mix = 1
      uniforms.prevType = uniforms.type
    }

    const animate = (now: number) => {
      // a long gap (tab switch, breakpoint) shouldn't fast-forward the pattern
      const dt =
        lastFrameTime === null ? 0 : Math.min((now - lastFrameTime) / 1000, 0.1)
      lastFrameTime = now

      if (blendStart) {
        const k = Math.min((now - blendStart) / blendDuration, 1)
        const eased = k * k * (3 - 2 * k)
        current = {
          color1: lerp3(from.color1, to.color1, eased),
          color2: lerp3(from.color2, to.color2, eased),
          color3: lerp3(from.color3, to.color3, eased),
          speed: lerp(from.speed, to.speed, eased),
          scale: lerp(from.scale, to.scale, eased),
          noise: lerp(from.noise, to.noise, eased),
        }
        if (uniforms.prevType !== uniforms.type) uniforms.mix = k
        if (k >= 1) finishBlend()
      }

      uniforms.time += dt * current.speed
      uniforms.time2 += dt * current.speed * current.speed

      // the lens trails the pointer instead of snapping to it
      const follow = 1 - Math.exp(-dt * 6)
      uniforms.pointer = lerp3(uniforms.pointer, pointerTarget, follow)

      renderFrame()
      rafId = requestAnimationFrame(animate)
    }

    const sync = () => {
      const shouldRun =
        !pausedRef.current &&
        !visibility.reducedMotion &&
        visibility.inView &&
        visibility.pageVisible

      if (shouldRun && !rafId) {
        lastFrameTime = null
        rafId = requestAnimationFrame(animate)
      } else if (!shouldRun && rafId) {
        cancelAnimationFrame(rafId)
        rafId = 0
        // nothing will advance a blend while stopped, so land it now
        if (blendStart) {
          finishBlend()
          renderFrame()
        }
      }
    }

    const setConfig = (next: GradientConfig) => {
      const nextType = typeNumber(next)
      const duration = transitionRef.current
      const target = toBlend(next)

      // an inline config object is a new reference on every parent render;
      // restarting the blend for identical values would stall it
      if (nextType === uniforms.type && sameBlend(target, to)) return

      to = target

      if (!rafId || duration <= 0) {
        uniforms.type = nextType
        finishBlend()
        renderFrame()
        return
      }

      from = current
      blendStart = performance.now()
      blendDuration = duration

      if (nextType !== uniforms.type) {
        uniforms.prevType = uniforms.type
        uniforms.type = nextType
        uniforms.mix = 0
      }
    }

    const setPointer = (x: number, y: number, inside: boolean) => {
      pointerTarget[0] = x
      pointerTarget[1] = y
      pointerTarget[2] = inside ? 1 : 0
    }

    controlsRef.current = { sync, setConfig, setPointer }

    const resizeObserver = new ResizeObserver(handleResize)
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement)
    handleResize()

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visibility.inView = entry.isIntersecting
      sync()
    })
    intersectionObserver.observe(canvas)

    const handleVisibilityChange = () => {
      visibility.pageVisible = !document.hidden
      sync()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const handleReducedMotionChange = () => {
      visibility.reducedMotion = reducedMotionQuery.matches
      sync()
    }
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange)

    // a restored context comes back blank; repaint even when not animating
    const handleRestored = () => requestAnimationFrame(renderFrame)
    canvas.addEventListener('webglcontextrestored', handleRestored)

    sync()

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      reducedMotionQuery.removeEventListener(
        'change',
        handleReducedMotionChange
      )
      canvas.removeEventListener('webglcontextrestored', handleRestored)
      controlsRef.current = null
      renderer.dispose()
    }
  }, [preserveDrawingBuffer])

  useEffect(() => {
    pausedRef.current = paused
    controlsRef.current?.sync()
  }, [paused])

  useEffect(() => {
    transitionRef.current = transition
  }, [transition])

  useEffect(() => {
    configRef.current = config
    controlsRef.current?.setConfig(config)
  }, [config])

  useEffect(() => {
    if (!interactive) return

    // the canvas usually sits behind page content and never receives pointer
    // events itself, so track the pointer on the window and hit-test by hand
    const handleMove = (event: PointerEvent) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return

      const x = (event.clientX - rect.left) / rect.width
      const y = 1 - (event.clientY - rect.top) / rect.height
      const inside = x >= 0 && x <= 1 && y >= 0 && y <= 1

      controlsRef.current?.setPointer(x, y, inside)
    }
    const handleLeave = () => controlsRef.current?.setPointer(0.5, 0.5, false)

    window.addEventListener('pointermove', handleMove, { passive: true })
    document.addEventListener('pointerleave', handleLeave)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerleave', handleLeave)
      handleLeave()
    }
  }, [interactive])

  return { canvasRef }
}
