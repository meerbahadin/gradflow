import { RGB, GradientConfig, GradientType } from '@/types/gradient'
import { GRADIENT_TYPES } from '@/constants/gradients'

export function randomRGB(): RGB {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  }
}

export function randomGradientType(): GradientType {
  return GRADIENT_TYPES[Math.floor(Math.random() * GRADIENT_TYPES.length)]
}

export function generateRandomColors(): Partial<GradientConfig> {
  return {
    color1: randomRGB(),
    color2: randomRGB(),
    color3: randomRGB(),
  }
}
