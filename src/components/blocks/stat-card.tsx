'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

import { Flow } from '@/components/showcase/flow/flow'
import { AnimatedCounter } from '@/components/arc/animated-counter/animated-counter'
import { Badge } from '@/components/arc/badge/badge'
import SegmentedControl from '@/components/arc/segmented-control/segmented-control'

/**
 * A metric over a rising horizon of light (the `horizon` shader), which keeps
 * the middle of the card dark so the line reads cleanly. Switching the range
 * re-tints the light, lifts the horizon with the growth, counts the number to
 * its new value and redraws the line.
 */

type Range = '7d' | '30d' | '12w'

const RANGES: Record<Range, { label: string; value: number; delta: string; note: string; points: number[]; colors: [string, string, string]; rise: number }> = {
  '7d': {
    label: 'Revenue · last 7 days',
    value: 11840,
    delta: '4.1%',
    note: 'A steady week, with Thursday’s launch carrying most of it.',
    points: [30, 34, 31, 38, 36, 52, 49, 55, 51, 58, 54, 60],
    colors: ['#2f6bff', '#05102e', '#a8e6ff'],
    rise: 0.8,
  },
  '30d': {
    label: 'Revenue · last 30 days',
    value: 48250,
    delta: '12.4%',
    note: 'Up from $42,930, with most of the gain in the last ten days.',
    points: [18, 24, 21, 30, 28, 36, 33, 44, 41, 52, 58, 66],
    colors: ['#6a4dff', '#0a0820', '#ff8f6b'],
    rise: 1,
  },
  '12w': {
    label: 'Revenue · last 12 weeks',
    value: 132600,
    delta: '31.8%',
    note: 'The best quarter so far: twelve weeks, nine of them up.',
    points: [12, 15, 19, 18, 24, 29, 27, 35, 41, 46, 55, 64],
    colors: ['#1fae7a', '#031a12', '#c8ffd8'],
    rise: 1.25,
  },
}

// the line as an SVG path across a 240 x 64 box; every range has 12 points so the path can morph
const path = (points: number[]) =>
  points
    .map((value, i) => {
      const x = (i / (points.length - 1)) * 240
      const y = 64 - (value / 70) * 64
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

export default function StatCard() {
  const [range, setRange] = useState<Range>('30d')
  const r = RANGES[range]
  const [color1, color2, color3] = r.colors

  return (
    <div className='on-gradient relative isolate flex h-full min-h-[360px] flex-col justify-between gap-6 overflow-hidden bg-black p-5'>
      <div className='absolute inset-0 -z-10'>
        {/* the horizon climbs higher for a bigger gain */}
        <Flow config={{ type: 'horizon', color1, color2, color3, speed: 0.5, scale: r.rise, noise: 0.05 }} transition={900} quality={0.75} />
        <div className='pointer-events-none absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent' />
      </div>

      <div className='flex flex-wrap items-center justify-between gap-3'>
        <p className='font-mono text-[11px] uppercase tracking-[0.14em]'>{r.label}</p>
        <SegmentedControl
          label='Range'
          value={range}
          onValueChange={(value) => setRange(value as Range)}
          options={[
            { value: '7d', label: '7d' },
            { value: '30d', label: '30d' },
            { value: '12w', label: '12w' },
          ]}
        />
      </div>

      <svg viewBox='0 0 240 64' preserveAspectRatio='none' aria-hidden='true' className='h-16 w-full overflow-visible'>
        <path
          d={path(r.points)}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          vectorEffect='non-scaling-stroke'
          style={{ transition: 'd 700ms cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>

      <div>
        <div className='flex items-end justify-between gap-3'>
          <AnimatedCounter value={r.value} prefix='$' animateOnView />
          <Badge tone='success' icon={<ArrowUpRight className='size-3' />}>
            {r.delta}
          </Badge>
        </div>
        <p className='mt-3 text-sm leading-relaxed text-subtle'>{r.note}</p>
      </div>
    </div>
  )
}
