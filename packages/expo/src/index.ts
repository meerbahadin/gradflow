// Main component export
export { GradFlow, default } from './grad-flow'
export type { GradFlowProps } from './grad-flow'

// Shared with the web package
export type {
  RGB,
  GradientType,
  GradientConfig,
  GradientConfigInput,
  PresetName,
} from '@/types/gradient'

export { DEFAULT_CONFIG, PRESETS, GRADIENT_TYPES } from '@/constants/gradients'
export { hexToRgb, rgbToHex, normalizeColor } from '@/lib/color-conversion'
export { randomRGB, generateRandomColors } from '@/lib/random-colors'
