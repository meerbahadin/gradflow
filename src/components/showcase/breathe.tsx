'use client'

import { useEffect, useRef, useState } from 'react'
import GradFlow from '@/components/grad-flow'
import { HomeBar, Screen, StatusBar, useLoop } from './phone'

/**
 * A breathing guide. A smoke orb swells as you breathe in, holds, and settles
 * as you breathe out; the gradient's own speed and scale blend over the same
 * seconds, so the smoke quickens on the way in and slows on the way out.
 */

type Phase = 'in' | 'hold' | 'out'

const PHASES: { phase: Phase; label: string; seconds: number }[] = [
  { phase: 'in', label: 'Breathe in', seconds: 4 },
  { phase: 'hold', label: 'Hold', seconds: 2 },
  { phase: 'out', label: 'Breathe out', seconds: 6 },
]
const CYCLES = 5

const SMOKE = {
  in: { speed: 0.9, scale: 1.4 },
  hold: { speed: 0.5, scale: 1.4 },
  out: { speed: 0.35, scale: 1.9 },
}

export default function Breathe({
  inhale = 4,
  hold = 2,
  exhale = 6,
}: {
  /** seconds to breathe in */
  inhale?: number
  /** seconds to hold */
  hold?: number
  /** seconds to breathe out */
  exhale?: number
}) {
  const timing = [inhale, hold, exhale]
  // the loop reads the timing through a ref, so a change lands on the next breath
  const seconds = useRef(timing)
  seconds.current = timing
  const [phase, setPhase] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [left, setLeft] = useState(300)
  const [count, setCount] = useState(4)

  useLoop(async (wait) => {
    for (let c = 0; c < CYCLES; c++) {
      setCycle(c)
      for (let p = 0; p < PHASES.length; p++) {
        setPhase(p)
        if (seconds.current[p] <= 0) continue
        for (let s = seconds.current[p]; s > 0; s--) {
          setCount(s)
          await wait(1000)
        }
      }
    }
  })

  useEffect(() => {
    const id = setInterval(() => setLeft((l) => (l <= 1 ? 300 : l - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  const p = PHASES[phase]
  const big = p.phase !== 'out'
  const ms = Math.max(timing[phase], 0.5) * 1000
  const ease = 'cubic-bezier(.45,0,.35,1)'

  return (
    <Screen background='#041716'>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(47,169,143,.22),transparent_60%)]' />
      <StatusBar />

      <div className='relative z-10 flex h-[calc(100%-54px)] flex-col items-center px-6 text-white'>
        <div className='mt-2 flex w-full items-center justify-between'>
          <button className='grid size-10 place-items-center rounded-full bg-white/10'>
            <svg viewBox='0 0 24 24' className='size-5' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
              <path d='M6 6l12 12M18 6L6 18' />
            </svg>
          </button>
          <div className='text-center'>
            <div className='font-heading text-[16px] font-medium'>Breathe</div>
            <div className='text-[12px] text-white/55'>Calm · 5 min</div>
          </div>
          <div className='size-10' />
        </div>

        <div className='relative mt-16 grid size-[300px] place-items-center'>
          {/* the size it grows to */}
          <div className='absolute inset-0 rounded-full border border-white/10' />
          <div
            className='absolute inset-4 rounded-full blur-2xl'
            style={{
              background: 'radial-gradient(circle, rgba(95,224,192,.55), transparent 70%)',
              transform: `scale(${big ? 1.05 : 0.6})`,
              opacity: big ? 0.9 : 0.45,
              transition: `transform ${ms}ms ${ease}, opacity ${ms}ms ${ease}`,
            }}
          />
          <div
            className='relative size-[268px] overflow-hidden rounded-full'
            style={{ transform: `scale(${big ? 1 : 0.62})`, transition: `transform ${ms}ms ${ease}` }}
          >
            <GradFlow
              config={{ type: 'smoke', color1: '#bff5e6', color2: '#06302c', color3: '#2fa98f', noise: 0.14, ...SMOKE[p.phase] }}
              transition={ms}
            />
            <div className='pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,.35),transparent_45%)]' />
          </div>
        </div>

        <div key={phase + '-' + cycle} className='sc-msg-in mt-12 text-center'>
          <div className='font-heading text-[30px] font-medium tracking-[-.01em]'>{p.label}</div>
        </div>
        <div className='mt-1 font-mono text-[15px] text-white/50'>{count}</div>

        <div className='flex-1' />

        <div className='mb-6 flex gap-2'>
          {Array.from({ length: CYCLES }, (_, n) => (
            <span key={n} className='size-2 rounded-full transition-colors duration-500' style={{ background: n <= cycle ? '#7fe8cf' : 'rgba(255,255,255,.18)' }} />
          ))}
        </div>

        <div className='mb-12 flex w-full items-center justify-between rounded-[24px] border border-white/10 bg-white/[.05] px-5 py-4'>
          <div>
            <div className='text-[12px] uppercase tracking-[.14em] text-white/50'>Remaining</div>
            <div className='font-mono text-[22px]'>
              {String(Math.floor(left / 60)).padStart(2, '0')}:{String(left % 60).padStart(2, '0')}
            </div>
          </div>
          <button className='grid size-12 place-items-center rounded-full bg-[#7fe8cf] text-[#041716]'>
            <svg viewBox='0 0 24 24' className='size-5' fill='currentColor'>
              <rect x='6' y='5' width='4' height='14' rx='1.2' />
              <rect x='14' y='5' width='4' height='14' rx='1.2' />
            </svg>
          </button>
        </div>
      </div>
      <HomeBar />
    </Screen>
  )
}
