export type RGB = {
  r: number
  g: number
  b: number
}

export type GradientType =
  | 'linear'
  | 'animated'
  | 'conic'
  | 'wave'
  | 'silk'
  | 'smoke'
  | 'stripe'
  | 'mesh'
  | 'aurora'

export type GradientConfig = {
  color1: RGB
  color2: RGB
  color3: RGB
  speed: number
  scale: number
  type: GradientType
  noise: number
}

export type GradientConfigInput = {
  color1?: string | RGB
  color2?: string | RGB
  color3?: string | RGB
  speed?: number
  scale?: number
  type?: GradientType
  noise?: number
}

export type GradFlowProps = {
  config?: GradientConfigInput
  preset?:
    | 'cosmic'
    | 'matrix'
    | 'electric'
    | 'inferno'
    | 'mystic'
    | 'cyber'
    | 'neon'
    | 'plasma'
    | 'dream'
    | 'borealis'
  /** Freeze the animation. A single static frame is still rendered. */
  paused?: boolean
  className?: string
}
