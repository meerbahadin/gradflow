import { DEFAULT_CONFIG, PRESETS } from '@/constants/gradients'
import { normalizeColor } from '@/lib/color-conversion'
import type {
  GradientConfig,
  GradientConfigInput,
  PresetName,
} from '@/types/gradient'

/** Defaults, then the preset, then any explicit config values on top. */
export function resolveConfig(
  config?: GradientConfigInput,
  preset?: PresetName
): GradientConfig {
  const resolved: GradientConfig = {
    ...DEFAULT_CONFIG,
    ...(preset ? PRESETS[preset] : undefined),
  }

  if (config) {
    if (config.color1) resolved.color1 = normalizeColor(config.color1)
    if (config.color2) resolved.color2 = normalizeColor(config.color2)
    if (config.color3) resolved.color3 = normalizeColor(config.color3)
    if (config.speed !== undefined) resolved.speed = config.speed
    if (config.scale !== undefined) resolved.scale = config.scale
    if (config.type) resolved.type = config.type
    if (config.noise !== undefined) resolved.noise = config.noise
  }

  return resolved
}
