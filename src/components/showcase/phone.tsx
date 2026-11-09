'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/** The 390 × 844 screen every mobile component draws into. */
export function Screen({ children, background, className = '' }: { children: ReactNode; background: string; className?: string }) {
  return (
    <div className={`relative h-[844px] w-[390px] overflow-hidden rounded-[46px] font-sans ${className}`} style={{ background }}>
      {children}
    </div>
  )
}

export function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`relative z-30 flex h-[54px] items-center justify-between px-8 pt-1 text-[15px] font-semibold ${dark ? 'text-black' : 'text-white'}`}>
      <span>9:41</span>
      <div className='absolute left-1/2 top-[11px] h-[34px] w-[122px] -translate-x-1/2 rounded-full bg-black' />
      <div className='flex items-center gap-1.5'>
        <svg viewBox='0 0 18 12' className='h-[11px] w-[17px]' fill='currentColor'>
          <rect x='0' y='8' width='3' height='4' rx='1' />
          <rect x='5' y='5.5' width='3' height='6.5' rx='1' />
          <rect x='10' y='3' width='3' height='9' rx='1' />
          <rect x='15' y='0' width='3' height='12' rx='1' />
        </svg>
        <svg viewBox='0 0 27 13' className='h-[12px] w-[26px]' fill='none'>
          <rect x='.5' y='.5' width='23' height='12' rx='3.5' stroke='currentColor' opacity='.4' />
          <rect x='2' y='2' width='18' height='9' rx='2' fill='currentColor' />
          <path d='M25 4.5v4a2 2 0 0 0 0-4z' fill='currentColor' opacity='.4' />
        </svg>
      </div>
    </div>
  )
}

export function HomeBar({ dark = false }: { dark?: boolean }) {
  return (
    <div className='absolute inset-x-0 bottom-0 z-30 flex h-[30px] items-center justify-center'>
      <div className={`h-[5px] w-[134px] rounded-full ${dark ? 'bg-black/80' : 'bg-white/80'}`} />
    </div>
  )
}

/** Runs an async script on a loop until unmount; `wait` rejects once stopped. */
export function useLoop(script: (wait: (ms: number) => Promise<void>) => Promise<void>) {
  const run = useRef(script)
  run.current = script
  useEffect(() => {
    let alive = true
    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) => setTimeout(() => (alive ? resolve() : reject(new Error('stopped'))), ms))
    ;(async () => {
      for (;;) await run.current(wait)
    })().catch(() => {})
    return () => {
      alive = false
    }
  }, [])
}

/** A number that eases to its new value instead of jumping. */
export function useTween(value: number, ms = 1200) {
  const [shown, setShown] = useState(value)
  const from = useRef(value)
  useEffect(() => {
    const start = performance.now()
    const a = from.current
    let raf = 0
    const tick = (now: number) => {
      const k = Math.min((now - start) / ms, 1)
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
      const v = a + (value - a) * e
      from.current = v
      setShown(v)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, ms])
  return shown
}
