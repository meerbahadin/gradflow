'use client'

import React, { forwardRef, useCallback, useMemo } from 'react'
import { GradFlowProps, GradientConfig } from '@/types/gradient'
import { useWebGLRenderer } from '@/hooks/useWebGLRenderer'
import { resolveConfig } from '@/lib/resolve-config'

const GradFlow = forwardRef<HTMLCanvasElement, GradFlowProps>(function GradFlow(
  {
    config: initialConfig,
    preset,
    paused = false,
    transition,
    interactive = false,
    preserveDrawingBuffer = false,
    className = '',
  },
  ref
) {
  const config = useMemo<GradientConfig>(
    () => resolveConfig(initialConfig, preset),
    [initialConfig, preset]
  )

  const { canvasRef } = useWebGLRenderer(config, {
    paused,
    transition,
    interactive,
    preserveDrawingBuffer,
  })

  const setRefs = useCallback(
    (node: HTMLCanvasElement | null) => {
      canvasRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    },
    [canvasRef, ref]
  )

  return (
    <canvas
      ref={setRefs}
      // a plain join keeps class-merging libraries out of the published bundle;
      // the canvas is sized inline from its parent, so nothing here conflicts
      className={`w-full h-full block select-none touch-none ${className}`.trim()}
      aria-label='gradflow animated gradient background'
    />
  )
})

export default GradFlow
