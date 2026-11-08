import { GRADIENT_TYPE_NUMBER } from '@/constants/gradients'
import { normalizeRgb } from '@/lib/color-utils'
import type { GradientConfig } from '@/types/gradient'
import type { FrameUniforms, Vec3 } from './renderer'

/**
 * The platform-free part of a GradFlow: it owns the clock, the blend between
 * configs and the pointer lens, and hands back the uniforms for each frame.
 * It never touches a canvas, a window or a GL context, so the Expo package
 * runs the same motion as the web build.
 */
export type Animator = {
  uniforms: FrameUniforms
  /** Advances by `dt` seconds. `now` is a millisecond timestamp. */
  step: (dt: number, now: number) => void
  /**
   * Moves toward a new config over `duration` ms. When `running` is false or
   * the duration is 0 it lands immediately.
   */
  setConfig: (config: GradientConfig, duration: number, running: boolean, now: number) => void
  /** Lands any blend in flight, e.g. when the loop stops. */
  settle: () => void
  setPointer: (x: number, y: number, inside: boolean) => void
}

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

const same3 = (a: Vec3, b: Vec3) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2]

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

export function createAnimator(config: GradientConfig): Animator {
  const initial = toBlend(config)
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
    type: typeNumber(config),
    prevType: typeNumber(config),
    mix: 1,
    pointer: [0.5, 0.5, 0],
  }
  const pointerTarget: Vec3 = [0.5, 0.5, 0]

  const apply = () => {
    uniforms.color1 = current.color1
    uniforms.color2 = current.color2
    uniforms.color3 = current.color3
    uniforms.scale = current.scale
    uniforms.noise = current.noise
  }

  const settle = () => {
    blendStart = 0
    current = to
    uniforms.mix = 1
    uniforms.prevType = uniforms.type
    apply()
  }

  return {
    uniforms,

    step(dt, now) {
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
        if (k >= 1) settle()
      }

      uniforms.time += dt * current.speed
      uniforms.time2 += dt * current.speed * current.speed

      // the lens trails the pointer instead of snapping to it
      const follow = 1 - Math.exp(-dt * 6)
      uniforms.pointer = lerp3(uniforms.pointer, pointerTarget, follow)

      apply()
    },

    setConfig(next, duration, running, now) {
      const nextType = typeNumber(next)
      const target = toBlend(next)

      // an inline config object is a new reference on every render;
      // restarting the blend for identical values would stall it
      if (nextType === uniforms.type && sameBlend(target, to)) return

      to = target

      if (!running || duration <= 0) {
        uniforms.type = nextType
        settle()
        return
      }

      from = current
      blendStart = now
      blendDuration = duration

      if (nextType !== uniforms.type) {
        uniforms.prevType = uniforms.type
        uniforms.type = nextType
        uniforms.mix = 0
      }
    },

    settle() {
      if (blendStart) settle()
    },

    setPointer(x, y, inside) {
      pointerTarget[0] = x
      pointerTarget[1] = y
      pointerTarget[2] = inside ? 1 : 0
    },
  }
}
