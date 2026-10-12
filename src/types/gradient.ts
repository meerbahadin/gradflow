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
  | 'lava'
  | 'caustics'
  | 'nebula'
  | 'rays'
  | 'topo'
  | 'glass'
  | 'vortex'
  | 'halftone'
  | 'prism'
  | 'cells'
  | 'dunes'

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

export type PresetName =
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
  | 'magma'
  | 'lagoon'
  | 'andromeda'
  | 'cathedral'
  | 'atlas'
  | 'reeded'
  | 'maelstrom'
  | 'newsprint'
  | 'spectrum'
  | 'coral'
  | 'sahara'
  | 'mono'

export type GradFlowProps = {
  config?: GradientConfigInput
  preset?: PresetName
  /** Freeze the animation. A single static frame is still rendered. */
  paused?: boolean
  /**
   * How long, in milliseconds, a change of type, colors, speed, scale or
   * noise takes to blend in. 0 switches instantly. Defaults to 700.
   */
  transition?: number
  /** Let the pattern swell under the pointer as it moves across the canvas. */
  interactive?: boolean
  /**
   * Keep the drawing buffer readable so the canvas can be exported with
   * toDataURL or toBlob at any time. Costs a copy per frame; leave it off
   * unless you capture stills.
   */
  preserveDrawingBuffer?: boolean
  className?: string
}
