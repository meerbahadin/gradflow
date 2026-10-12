'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

import { PRESETS } from '@/constants/gradients'
import {
  PRESET_COUNT,
  PRESET_NAMES,
  TYPE_COUNT,
  TYPES,
} from '@/lib/showcase'
import SegmentedControl from '@/components/arc/segmented-control/segmented-control'
import GradientTile from '@/components/site/gradient-tile'
import SectionHeading from '@/components/site/section-heading'

type View = 'shaders' | 'presets'

function Tile({
  href,
  name,
  caption,
  isNew,
  children,
}: {
  href: string
  name: string
  caption: string
  isNew?: boolean
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className='group relative isolate block aspect-[4/3] overflow-hidden rounded-(--radius-panel) bg-muted'
    >
      {children}
      <div className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent' />

      {isNew && (
        <span className='absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-black'>
          New
        </span>
      )}

      <span className='absolute right-3 top-3 flex size-7 -translate-y-1 items-center justify-center rounded-full bg-white text-black opacity-0 transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100'>
        <ArrowUpRight className='size-3.5' />
      </span>

      <div className='pointer-events-none absolute inset-x-0 bottom-0 p-3.5 text-white'>
        <p className='font-mono text-sm'>{name}</p>
        <p className='mt-0.5 truncate text-xs text-white/70'>{caption}</p>
      </div>
    </Link>
  )
}

export default function Collection() {
  const [view, setView] = useState<View>('shaders')

  return (
    <section id='collection' className='container py-24 sm:py-32'>
      <div className='flex flex-col justify-between gap-8 md:flex-row md:items-end'>
        <SectionHeading
          eyebrow='The collection'
          title={`${TYPE_COUNT} shaders, ${PRESET_COUNT} presets.`}
        >
          Each one is a hand-written fragment shader driven by the same three
          colors. Every tile below is live, and all of them share a single
          WebGL context.
        </SectionHeading>

        <SegmentedControl
          label='Show shaders or presets'
          value={view}
          onValueChange={(value) => setView(value as View)}
          options={[
            { value: 'shaders', label: 'Shaders' },
            { value: 'presets', label: 'Presets' },
          ]}
        />
      </div>

      <div className='mt-12 grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {view === 'shaders'
          ? TYPES.map(({ type, blurb, config, isNew }) => (
              <Tile
                key={type}
                href={`/playground?type=${type}`}
                name={type}
                caption={blurb}
                isNew={isNew}
              >
                <GradientTile config={config} />
              </Tile>
            ))
          : PRESET_NAMES.map((preset) => (
              <Tile
                key={preset}
                href={`/playground?preset=${preset}`}
                name={preset}
                caption={`${PRESETS[preset].type} shader`}
              >
                <GradientTile preset={preset} />
              </Tile>
            ))}
      </div>
    </section>
  )
}
