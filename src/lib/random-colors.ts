import { RGB, GradientConfig, GradientType } from '@/types/gradient'

export function randomRGB(): RGB {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  }
}

const gradientTypes: GradientType[] = [
  'linear',
  'animated',
  'conic',
  'wave',
  'silk',
  'smoke',
  'stripe',
  'mesh',
  'aurora',
]

export function randomGradientType(): GradientType {
  return gradientTypes[Math.floor(Math.random() * gradientTypes.length)]
}

export function generateRandomColors(): Partial<GradientConfig> {
  return {
    color1: randomRGB(),
    color2: randomRGB(),
    color3: randomRGB(),
  }
}
