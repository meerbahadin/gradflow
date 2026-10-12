import { PRESETS } from '@/constants/gradients'
import type {
  GradientConfigInput,
  GradientType,
  PresetName,
} from '@/types/gradient'

export const PRESET_NAMES = Object.keys(PRESETS) as PresetName[]

export type TypeInfo = {
  type: GradientType
  /** one line on what the shader draws */
  blurb: string
  /** the palette the site shows this type in */
  config: GradientConfigInput
  isNew?: boolean
}

const from = (preset: PresetName): GradientConfigInput => ({ ...PRESETS[preset] })

/** Every gradient type with a palette that shows it at its best. */
export const TYPES: TypeInfo[] = [
  {
    type: 'aurora',
    blurb: 'Curtains of light over a dark sky.',
    config: from('borealis'),
  },
  {
    type: 'lava',
    blurb: 'Metaballs that merge and split.',
    config: from('magma'),
    isNew: true,
  },
  {
    type: 'prism',
    blurb: 'One band field, split three ways.',
    config: from('spectrum'),
    isNew: true,
  },
  {
    type: 'caustics',
    blurb: 'Light through moving water.',
    config: from('lagoon'),
    isNew: true,
  },
  {
    type: 'glass',
    blurb: 'A soft field behind fluted glass.',
    config: from('reeded'),
    isNew: true,
  },
  {
    type: 'nebula',
    blurb: 'Warped dust clouds and a star field.',
    config: from('andromeda'),
    isNew: true,
  },
  {
    type: 'dunes',
    blurb: 'Ridgelines drifting at their own pace.',
    config: from('sahara'),
    isNew: true,
  },
  {
    type: 'silk',
    blurb: 'Folded, iterated sine cloth.',
    config: from('cosmic'),
  },
  {
    type: 'vortex',
    blurb: 'A three-armed logarithmic spiral.',
    config: from('maelstrom'),
    isNew: true,
  },
  {
    type: 'rays',
    blurb: 'Shafts of light from above.',
    config: from('cathedral'),
    isNew: true,
  },
  {
    type: 'topo',
    blurb: 'A contour map that keeps redrawing.',
    config: from('atlas'),
    isNew: true,
  },
  {
    type: 'mesh',
    blurb: 'Three blobs of color, always blending.',
    config: from('dream'),
  },
  {
    type: 'cells',
    blurb: 'Voronoi cells with drifting sites.',
    config: from('coral'),
    isNew: true,
  },
  {
    type: 'halftone',
    blurb: 'A rotated dot screen, print style.',
    config: from('newsprint'),
    isNew: true,
  },
  {
    type: 'smoke',
    blurb: 'Turbulent, slow-rolling plumes.',
    config: from('mystic'),
  },
  {
    type: 'animated',
    blurb: 'A rotating two-layer blend.',
    config: from('electric'),
  },
  {
    type: 'wave',
    blurb: 'Stacked sine waves across the frame.',
    config: from('inferno'),
  },
  {
    type: 'stripe',
    blurb: 'Warped diagonal bands.',
    config: {
      type: 'stripe',
      color1: '#ff5f6d',
      color2: '#2b1055',
      color3: '#ffc371',
      speed: 0.5,
      scale: 1.2,
      noise: 0.1,
    },
  },
  {
    type: 'conic',
    blurb: 'A sweep around the center.',
    config: {
      type: 'conic',
      color1: '#0f172a',
      color2: '#6366f1',
      color3: '#f0abfc',
      speed: 0.5,
      scale: 1,
      noise: 0.1,
    },
  },
  {
    type: 'linear',
    blurb: 'A vertical ramp with a gentle sway.',
    config: {
      type: 'linear',
      color1: '#0b1026',
      color2: '#7c3aed',
      color3: '#fda4af',
      speed: 0.6,
      scale: 1,
      noise: 0.1,
    },
  },
]

export const TYPE_COUNT = TYPES.length
export const NEW_TYPE_COUNT = TYPES.filter((t) => t.isNew).length
export const PRESET_COUNT = PRESET_NAMES.length

export const INSTALL_COMMAND = 'npm install gradflow'
export const GITHUB_URL = 'https://github.com/meerbahadin/gradflow'
export const NPM_URL = 'https://www.npmjs.com/package/gradflow'
