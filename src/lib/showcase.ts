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
    type: 'eclipse',
    blurb: 'A ring of light around a dark disc.',
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
    type: 'horizon',
    blurb: 'A soft glow rising from the bottom edge.',
    config: from('twilight'),
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
    type: 'fold',
    blurb: 'Sheets of light, creased and overlapping.',
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
    config: {
      type: 'wave',
      color1: '#ffffff',
      color2: '#2c2cd9',
      color3: '#fac7ff',
      speed: 0.9,
      scale: 0.5,
      noise: 0.2,
    },
  },
  {
    type: 'stripe',
    blurb: 'Warped diagonal bands.',
    config: {
      type: 'stripe',
      color1: '#ff6428',
      color2: '#1428a0',
      color3: '#ffd296',
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
      color1: '#080614',
      color2: '#ff7814',
      color3: '#786eff',
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
      color1: '#0a0a1e',
      color2: '#ff823c',
      color3: '#5a78aa',
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
