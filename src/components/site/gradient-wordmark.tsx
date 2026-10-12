'use client'

import { useId } from 'react'
import GradFlow from '@/components/grad-flow'

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
        <GradFlow preset='sahara' interactive />
      </div>
    </div>
  )
}
