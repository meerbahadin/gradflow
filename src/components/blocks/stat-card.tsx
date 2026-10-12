'use client'

import { ArrowUpRight } from 'lucide-react'

import GradFlow from '@/components/grad-flow'
import { AnimatedCounter } from '@/components/arc/animated-counter/animated-counter'
import { Badge } from '@/components/arc/badge/badge'

const POINTS = [18, 24, 21, 30, 28, 36, 33, 44, 41, 52, 58, 66]

// the sparkline as an SVG path across a 240 x 64 box
const PATH = POINTS.map((value, i) => {
  const x = (i / (POINTS.length - 1)) * 240
  const y = 64 - (value / 70) * 64
  return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
}).join(' ')

/** A metric card whose header is a strip of live gradient. */
export default function StatCard() {
  return (
    <div className='flex h-full min-h-[360px] flex-col overflow-hidden bg-surface'>
      <div className='on-gradient relative isolate h-36 shrink-0 overflow-hidden bg-black p-5'>
        <div className='pointer-events-none absolute inset-0 -z-10'>
          <GradFlow preset='maelstrom' />
        </div>
        <p className='font-mono text-[11px] uppercase tracking-[0.14em]'>
          Revenue · last 12 weeks
        </p>
        <svg
          viewBox='0 0 240 64'
          preserveAspectRatio='none'
          aria-hidden='true'
          className='absolute inset-x-5 bottom-5 h-14 w-[calc(100%-2.5rem)] overflow-visible'
        >
          <path
            d={PATH}
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            vectorEffect='non-scaling-stroke'
          />
        </svg>
      </div>

      <div className='flex flex-1 flex-col justify-between gap-6 p-5'>
        <div className='flex items-end justify-between gap-3'>
          <AnimatedCounter value={48250} prefix='$' animateOnView />
          <Badge tone='success' icon={<ArrowUpRight className='size-3' />}>
            12.4%
          </Badge>
        </div>
        <p className='text-sm leading-relaxed text-subtle'>
          Up from $42,930 over the previous period, with most of the gain in
          the last three weeks.
        </p>
      </div>
    </div>
  )
}
