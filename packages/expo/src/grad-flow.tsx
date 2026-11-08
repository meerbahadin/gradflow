import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  AccessibilityInfo,
  AppState,
  StyleSheet,
  View,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native'
import { GLView, type ExpoWebGLRenderingContext } from 'expo-gl'

import { createAnimator, type Animator } from '@/core/animator'
import { createContextRenderer, type ContextRenderer } from '@/core/renderer'
import { resolveConfig } from '@/lib/resolve-config'
import type { GradientConfig, GradientConfigInput, PresetName } from '@/types/gradient'

export type GradFlowProps = {
  config?: GradientConfigInput
  preset?: PresetName
  /** Freeze the animation. A single static frame is still drawn. */
  paused?: boolean
  /**
   * How long, in milliseconds, a change of type, colors, speed, scale or
   * noise takes to blend in. 0 switches instantly. Defaults to 700.
   */
  transition?: number
  /** Let the pattern swell under the finger while it touches the gradient. */
  interactive?: boolean
  /**
   * The gradient fills this view. Size it like any other view; for a
   * background, use `StyleSheet.absoluteFill`.
   */
  style?: StyleProp<ViewStyle>
  /** Content drawn on top of the gradient. */
  children?: React.ReactNode
}

type Size = { cssWidth: number; cssHeight: number }

/**
 * Animated WebGL gradients for Expo and React Native.
 *
 * Draws through expo-gl, so it runs in Expo Go, development builds and on
 * the web. The loop stops while the app is in the background, while paused,
 * or when the user has asked the system to reduce motion.
 */
export function GradFlow({
  config: configInput,
  preset,
  paused = false,
  transition = 700,
  interactive = false,
  style,
  children,
}: GradFlowProps) {
  const config = useMemo<GradientConfig>(
    () => resolveConfig(configInput, preset),
    // an inline config object is new every render; compare by value
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(configInput), preset]
  )

  const configRef = useRef(config)
  const transitionRef = useRef(transition)
  const animatorRef = useRef<Animator | null>(null)
  const rendererRef = useRef<ContextRenderer | null>(null)
  const glRef = useRef<ExpoWebGLRenderingContext | null>(null)
  const sizeRef = useRef<Size>({ cssWidth: 1, cssHeight: 1 })
  const rafRef = useRef(0)
  const lastFrameRef = useRef<number | null>(null)
  const state = useRef({ paused, appActive: true, reducedMotion: false })
  const rootRef = useRef<React.ComponentRef<typeof View>>(null)
  // the view's top-left in window coordinates, for mapping touches
  const originRef = useRef({ x: 0, y: 0 })
  const measureOrigin = useCallback(() => {
    rootRef.current?.measureInWindow((x: number, y: number) => {
      originRef.current = { x, y }
    })
  }, [])

  const draw = useCallback(() => {
    const gl = glRef.current
    const renderer = rendererRef.current
    const animator = animatorRef.current
    if (!gl || !renderer || !animator) return

    const { cssWidth, cssHeight } = sizeRef.current
    renderer.draw(
      animator.uniforms,
      gl.drawingBufferWidth,
      gl.drawingBufferHeight,
      cssWidth,
      cssHeight
    )
    // expo-gl only presents what was drawn once the frame is ended
    gl.endFrameEXP()
  }, [])

  const isRunning = () =>
    !state.current.paused && state.current.appActive && !state.current.reducedMotion

  const loop = useCallback(
    (now: number) => {
      const animator = animatorRef.current
      if (!animator) return

      // a long gap (backgrounded app, debugger) shouldn't fast-forward the pattern
      const last = lastFrameRef.current
      const dt = last === null ? 0 : Math.min((now - last) / 1000, 0.1)
      lastFrameRef.current = now

      animator.step(dt, now)
      draw()
      rafRef.current = requestAnimationFrame(loop)
    },
    [draw]
  )

  const sync = useCallback(() => {
    const shouldRun = isRunning() && !!animatorRef.current

    if (shouldRun && !rafRef.current) {
      lastFrameRef.current = null
      rafRef.current = requestAnimationFrame(loop)
    } else if (!shouldRun && rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      // nothing will advance a blend while stopped, so land it now
      animatorRef.current?.settle()
      draw()
    }
  }, [draw, loop])

  const onContextCreate = useCallback(
    (gl: ExpoWebGLRenderingContext) => {
      glRef.current = gl
      // expo-gl speaks the WebGL 1 API the shared renderer is written against
      rendererRef.current = createContextRenderer(gl as unknown as WebGLRenderingContext)
      animatorRef.current = createAnimator(configRef.current)
      draw()
      sync()
    },
    [draw, sync]
  )

  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout
      sizeRef.current = { cssWidth: Math.max(width, 1), cssHeight: Math.max(height, 1) }
      measureOrigin()
      if (!rafRef.current) draw()
    },
    [draw, measureOrigin]
  )

  // paused prop
  useEffect(() => {
    state.current.paused = paused
    sync()
  }, [paused, sync])

  useEffect(() => {
    transitionRef.current = transition
  }, [transition])

  // config changes blend in
  useEffect(() => {
    configRef.current = config
    const animator = animatorRef.current
    if (!animator) return
    animator.setConfig(config, transitionRef.current, !!rafRef.current, performance.now())
    if (!rafRef.current) draw()
  }, [config, draw])

  // background / foreground and the system reduce-motion setting
  useEffect(() => {
    const appSub = AppState.addEventListener('change', (status) => {
      state.current.appActive = status === 'active'
      sync()
    })

    let alive = true
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (!alive) return
        state.current.reducedMotion = enabled
        sync()
      })
      .catch(() => {})
    const motionSub = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      state.current.reducedMotion = enabled
      sync()
    })

    return () => {
      alive = false
      appSub.remove()
      motionSub.remove()
    }
  }, [sync])

  // tear down the loop and GPU objects with the view
  useEffect(
    () => () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      rendererRef.current?.dispose()
      rendererRef.current = null
      animatorRef.current = null
      glRef.current = null
    },
    []
  )

  // touches can land on children drawn on top, whose locationX/Y are relative
  // to themselves, so map from window coordinates instead
  const handleTouch = useCallback((event: GestureResponderEvent) => {
    const { cssWidth, cssHeight } = sizeRef.current
    const { pageX, pageY } = event.nativeEvent
    const x = (pageX - originRef.current.x) / cssWidth
    const y = 1 - (pageY - originRef.current.y) / cssHeight
    animatorRef.current?.setPointer(x, y, true)
  }, [])
  const startTouch = useCallback(
    (event: GestureResponderEvent) => {
      // the view may have scrolled since it was laid out
      measureOrigin()
      handleTouch(event)
    },
    [handleTouch, measureOrigin]
  )
  const releaseTouch = useCallback(() => {
    animatorRef.current?.setPointer(0.5, 0.5, false)
  }, [])

  const touchProps = interactive
    ? {
        onTouchStart: startTouch,
        onTouchMove: handleTouch,
        onTouchEnd: releaseTouch,
        onTouchCancel: releaseTouch,
      }
    : null

  return (
    <View ref={rootRef} style={[styles.root, style]} onLayout={onLayout} {...touchProps}>
      <GLView
        style={StyleSheet.absoluteFill}
        onContextCreate={onContextCreate}
        pointerEvents='none'
        accessibilityElementsHidden
        importantForAccessibility='no-hide-descendants'
      />
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
    backgroundColor: '#000',
  },
})

export default GradFlow
