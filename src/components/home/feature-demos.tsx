'use client'

import { useEffect, useState } from 'react'

import GradFlow from '@/components/grad-flow'
import { PRESETS } from '@/constants/gradients'
import type { GradientConfigInput, GradientType, PresetName } from '@/types/gradient'
import { TextMorph } from '@/components/arc/text-morph/text-morph'
import GradientTile from '@/components/site/gradient-tile'

const MORPH_SCENES: PresetName[] = ['spectrum', 'lagoon', 'magma', 'reeded']

/** A gradient that keeps changing preset, to show the blend between them. */
export function MorphDemo() {
  const [index, setIndex] = useState(0)
  const preset = MORPH_SCENES[index]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const timer = setInterval(
      () => setIndex((i) => (i + 1) % MORPH_SCENES.length),
      3600
    )
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <div className='absolute inset-0 -z-10'>
        <GradFlow preset={preset} transition={2000} />
        <div className='absolute inset-0 bg-linear-to-t from-black/60 via-black/5 to-transparent' />
      </div>
      <code className='absolute right-5 top-5 rounded-full border border-border bg-black/30 px-3 py-1.5 font-mono text-xs backdrop-blur-xl'>
        preset=&quot;<TextMorph>{preset}</TextMorph>&quot;
      </code>
    </>
  )
}

/** A gradient that bends under the pointer. */
export function PointerDemo() {
  return (
    <div className='absolute inset-0 -z-10'>
      <GradFlow preset='atlas' interactive config={{ scale: 1.3 }} />
      <div className='absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent' />
    </div>
  )
}

const PALETTE: Omit<GradientConfigInput, 'type'> = {
  color1: PRESETS.spectrum.color1,
  color2: PRESETS.spectrum.color2,
  color3: PRESETS.spectrum.color3,
  speed: 0.5,
  scale: 1,
  noise: 0.08,
}

const SAME_PALETTE: GradientType[] = ['mesh', 'prism', 'glass', 'horizon', 'silk']

/** One palette run through several shaders. */
export function PaletteStrip() {
  return (
    <div className='grid grid-cols-5 gap-1.5'>
      {SAME_PALETTE.map((type) => (
        <div
          key={type}
          className='relative aspect-[3/4] overflow-hidden rounded-xl bg-muted'
        >
          <GradientTile config={{ ...PALETTE, type }} />
        </div>
      ))}
    </div>
  )
}
