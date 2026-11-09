'use client'

import { useState } from 'react'
import { Flow, type FlowConfig } from './flow/flow'
import { useLoop } from './phone'
import { Poster } from './desktop'

/**
 * A deploy as one word on a river of light. The `current` streams blue while
 * it builds, slows and turns red when a test fails, and settles green once
 * the release is live. The current step is the headline; the log is a
 * single line under it.
 */

type Mood = 'build' | 'fail' | 'live'

const STEPS = ['Clone', 'Install', 'Build', 'Test', 'Deploy']

const FIELD: Record<Mood, FlowConfig> = {
  build: { type: 'current', color1: '#2f5bff', color2: '#040a26', color3: '#c2e1ff', speed: 1.2, scale: 0.45, noise: 0.06 },
  fail: { type: 'current', color1: '#ff3554', color2: '#22030b', color3: '#ffb7c2', speed: 0.22, scale: 0.45, noise: 0.06 },
  live: { type: 'current', color1: '#16b273', color2: '#03170f', color3: '#c6ffe4', speed: 0.45, scale: 0.45, noise: 0.06 },
}

// headline, log line, steps done, mood, how long to hold
const SCRIPT: [string, string, number, Mood, number][] = [
  ['Cloning', 'git clone northwind/app --branch main', 0, 'build', 1500],
  ['Installing', 'pnpm install · 1,284 packages', 1, 'build', 1700],
  ['Building', 'next build · 214 modules · /checkout 38.1 kB', 2, 'build', 2000],
  ['Testing', 'vitest run · 23 of 34 passed', 3, 'build', 1600],
  ['Failed', '✕ checkout.spec.ts · expected 19.99, got 19.990000002', 3, 'fail', 2600],
  ['Retrying', 'clean cache · vitest run · 34 of 34 passed', 3, 'build', 1900],
  ['Deploying', 'promoting a3f9c21 to production', 4, 'build', 1700],
  ['Live.', 'northwind.app · 0 errors · 1m 37s', 5, 'live', 4000],
]

// where each pinned state sits in the script
const PINNED = { building: 2, failed: 4, live: 7 } as const

export default function Deploy({
  branch = 'main',
  state = 'auto',
}: {
  branch?: string
  /** pin one moment of the release, or let it run */
  state?: 'auto' | keyof typeof PINNED
}) {
  const [looped, setAt] = useState(0)
  const at = state === 'auto' ? looped : PINNED[state]
  useLoop(async (wait) => {
    for (let i = 0; i < SCRIPT.length; i++) {
      setAt(i)
      await wait(SCRIPT[i][4])
    }
  })

  const [word, line, done, mood] = SCRIPT[at]
  const progress = mood === 'live' ? 1 : (done + 0.5) / STEPS.length

  return (
    <Poster className='bg-[#040a26] text-white'>
      <Flow config={FIELD[mood]} transition={1200} quality={0.5} />
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25' />

      <div className='relative flex h-full flex-col p-14'>
        <header className='flex items-center justify-between font-mono text-[13px]'>
          <span>
            Deploy #482 <span className='text-white/50'>· {branch} · a3f9c21</span>
          </span>
          <span className='flex gap-6'>
            {STEPS.map((s, i) => {
              const failed = mood === 'fail' && i === done
              const state = i < done ? 'done' : i === done && mood !== 'live' ? 'now' : mood === 'live' ? 'done' : 'next'
              return (
                <span key={s} className='transition-opacity duration-500' style={{ opacity: state === 'next' ? 0.4 : 1 }}>
                  <span className={failed ? 'text-[#ffb7c2]' : state === 'now' ? 'animate-pulse' : ''}>{failed ? '✕' : state === 'done' ? '✓' : state === 'now' ? '●' : '○'}</span> {s}
                </span>
              )
            })}
          </span>
        </header>

        <div className='flex-1' />

        <div key={`word-${word}`} className='sc-swap-in font-heading text-[176px] font-medium leading-[.9] tracking-[-.06em]'>
          {word}
        </div>
        <div key={`line-${line}`} className='sc-swap-in mt-6 font-mono text-[15px] text-white/80'>
          {line}
        </div>

        <div className='mt-14 flex items-center gap-6'>
          <div className='relative h-px flex-1 bg-white/25'>
            <div className='absolute inset-y-0 left-0 bg-white' style={{ width: `${progress * 100}%`, transition: 'width 1100ms cubic-bezier(.2,.8,.2,1)' }} />
            <div
              className='absolute top-1/2 size-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,.9)]'
              style={{ left: `calc(${progress * 100}% - 4px)`, transition: 'left 1100ms cubic-bezier(.2,.8,.2,1)' }}
            />
          </div>
          <span className='font-mono text-[13px] tabular-nums text-white/70'>{Math.round(progress * 100)}%</span>
        </div>
      </div>
    </Poster>
  )
}
