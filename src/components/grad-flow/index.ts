// Main component
export { default as GradFlow } from '../grad-flow'

// Presets and defaults
export { PRESETS, DEFAULT_CONFIG, GRADIENT_TYPES } from '@/constants/gradients'

// Types
export type {
  GradientConfig,
  GradientConfigInput,
  GradientType,
  RGB,
  GradFlowProps,
  PresetName,
} from '@/types/gradient'

// Utilities
export { hexToRgb, rgbToHex, normalizeColor } from '@/lib/color-conversion'

// Helper function for better DX
export const createGradientConfig = (
  config: import('@/types/gradient').GradientConfigInput
) => config
