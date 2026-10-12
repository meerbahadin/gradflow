'use client'

import { useId } from 'react'
import GradFlow from '@/components/grad-flow'
import type { GradientConfigInput } from '@/types/gradient'

// fluted glass: the ribs give the letters texture, and the palette has no
// dark or white passages, so every letter stays legible on either theme
const WORDMARK: GradientConfigInput = {
  type: 'glass',
  color1: '#ff6a3d',
  color2: '#6a4dff',
  color3: '#ffc27a',
  speed: 0.9,
  scale: 0.75,
  noise: 0,
}

/**
 * The wordmark with a live gradient showing through the letters. The canvas
 * is clipped by an SVG <clipPath> holding the text, sized in bounding-box
 * units so it scales with the element.
 */
export default function GradientWordmark({ text = 'gradflow' }: { text?: string }) {
  const id = useId()

  return (
    <div className='relative aspect-[1000/250] w-full' role='img' aria-label={text}>
      <svg width='0' height='0' className='absolute' aria-hidden='true'>
        <defs>
          <clipPath
            id={id}
            clipPathUnits='objectBoundingBox'
            transform='scale(0.001 0.004)'
          >
            <text
              x='4'
              y='190'
              textLength='992'
              lengthAdjust='spacingAndGlyphs'
              fontSize='240'
              fontWeight='600'
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {text}
            </text>
          </clipPath>
        </defs>
      </svg>

      <div className='absolute inset-0' style={{ clipPath: `url(#${id})` }}>
        <GradFlow config={WORDMARK} interactive />
      </div>
    </div>
  )
}
