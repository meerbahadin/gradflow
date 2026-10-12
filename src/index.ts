// Main component export
export { default as GradFlow, default } from './components/grad-flow'

// Types
export type {
  RGB,
  GradientType,
  GradientConfig,
  GradientConfigInput,
  GradFlowProps,
  PresetName,
} from './types/gradient'

// Constants and presets
export {
  DEFAULT_CONFIG,
  PRESETS,
  GRADIENT_TYPES,
  GRADIENT_TYPE_NUMBER,
} from './constants/gradients'

// Utility functions
export { hexToRgb, rgbToHex, normalizeColor } from './lib/color-conversion'
export { randomRGB, generateRandomColors } from './lib/random-colors'
