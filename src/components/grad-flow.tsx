'use client'

import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'
import { GradFlowProps, GradientConfig } from '@/types/gradient'
import { DEFAULT_CONFIG, PRESETS } from '@/constants/gradients'
import { useWebGLRenderer } from '@/hooks/useWebGLRenderer'
import { normalizeColor } from '@/lib/color-conversion'

export default function GradFlow({
  config: initialConfig,
  preset,
  paused = false,
  className = '',
}: GradFlowProps) {
  const config = useMemo<GradientConfig>(() => {
    const normalized: GradientConfig = {
      ...DEFAULT_CONFIG,
      ...(preset ? PRESETS[preset] : undefined),
    }

    if (initialConfig) {
      if (initialConfig.color1) normalized.color1 = normalizeColor(initialConfig.color1)
      if (initialConfig.color2) normalized.color2 = normalizeColor(initialConfig.color2)
      if (initialConfig.color3) normalized.color3 = normalizeColor(initialConfig.color3)
      if (initialConfig.speed !== undefined) normalized.speed = initialConfig.speed
      if (initialConfig.scale !== undefined) normalized.scale = initialConfig.scale
      if (initialConfig.type) normalized.type = initialConfig.type
      if (initialConfig.noise !== undefined) normalized.noise = initialConfig.noise
    }

    return normalized
  }, [initialConfig, preset])

  const { canvasRef } = useWebGLRenderer(config, { paused })

  return (
    <canvas
      ref={canvasRef}
      className={cn('w-full h-full block select-none touch-none', className)}
      aria-label='gradflow animated gradient background'
    />
  )
}
