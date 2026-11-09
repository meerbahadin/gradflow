'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/**
 * Shared pieces for the Dynamic Island close-ups: the top of a phone, its
 * lock-screen wallpaper and status bar, and the black pill that springs
 * between its rest, compact and expanded shapes.
 */

export type IslandShape = { w: number; h: number; r: number }

export const REST: IslandShape = { w: 126, h: 37, r: 18.5 }
export const COMPACT: IslandShape = { w: 220, h: 37, r: 18.5 }

// a spring with a little overshoot, close to how the island settles on iOS
export const SPRING = 'cubic-bezier(.32,1.3,.42,1)'
export const EASE = 'cubic-bezier(.2,.8,.2,1)'

/** The top 390 × 260 of a phone, shown as a close-up. */
export function Stage({ wallpaper, expanded, children }: { wallpaper: string; expanded: boolean; children: ReactNode }) {
  return (
    <div className='relative h-[260px] w-[390px] overflow-hidden rounded-t-[46px] font-sans' style={{ background: wallpaper }}>
      {/* the status bar steps aside while the island is open */}
      <div
        className='absolute inset-x-0 top-0 z-10 flex h-[54px] items-center justify-between px-8 pt-1 text-[15px] font-semibold text-white'
        style={{ opacity: expanded ? 0 : 1, transition: 'opacity 250ms ease' }}
      >
        <span>9:41</span>
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

      {/* a glimpse of the lock screen below */}
      <div className='absolute inset-x-0 top-[120px] text-center text-white'>
        <div className='text-[17px] font-medium text-white/80'>Sunday 8 November</div>
        <div className='font-heading text-[96px] font-semibold leading-none tracking-[-.03em] text-white/90'>9:41</div>
      </div>

      {children}
    </div>
  )
}

/** The pill itself; children are laid out against its top-left corner. */
export function Island({ shape, children }: { shape: IslandShape; children?: ReactNode }) {
  return (
    <div
      className='absolute left-1/2 top-[11px] z-20 -translate-x-1/2 overflow-hidden bg-black shadow-[0_10px_40px_rgba(0,0,0,.35)]'
      style={{
        width: shape.w,
        height: shape.h,
        borderRadius: shape.r,
        transition: `width 620ms ${SPRING}, height 620ms ${SPRING}, border-radius 520ms ${EASE}`,
      }}
    >
      {children}
    </div>
  )
}

/** Fades a block in and out with a short delay, so it never shows mid-morph. */
export function Reveal({ show, delay = 160, className = '', children }: { show: boolean; delay?: number; className?: string; children: ReactNode }) {
  return (
    <div
      className={className}
      style={{
        opacity: show ? 1 : 0,
        filter: show ? 'none' : 'blur(4px)',
        transform: show ? 'none' : 'scale(.96)',
        transition: `opacity 260ms ease ${show ? delay : 0}ms, filter 260ms ease ${show ? delay : 0}ms, transform 420ms ${EASE} ${show ? delay : 0}ms`,
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      {children}
    </div>
  )
}

/**
 * Audio-style bars whose heights wander like a real level meter. `level`
 * scales them; 0 lays them flat.
 */
export function Bars({ level, color, count = 5, height = 16, className = '' }: { level: number; color: string; count?: number; height?: number; className?: string }) {
  const bars = useRef<(HTMLSpanElement | null)[]>([])
  const amp = useRef(level)
  amp.current = level

  useEffect(() => {
    let raf = 0
    const targets = Array.from({ length: count }, () => 0.3)
    const values = Array.from({ length: count }, () => 0.2)
    let last = performance.now()
    let next = 0
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      next -= dt
      if (next <= 0) {
        for (let i = 0; i < count; i++) targets[i] = 0.15 + Math.random() * 0.85
        next = 0.09 + Math.random() * 0.08
      }
      for (let i = 0; i < count; i++) {
        values[i] += (targets[i] * amp.current - values[i]) * (1 - Math.exp(-dt * 14))
        const el = bars.current[i]
        if (el) el.style.height = `${Math.max(3, values[i] * height)}px`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [count, height])

  return (
    <div className={`flex items-center gap-[3px] ${className}`} style={{ height }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} ref={(el) => {
            bars.current[i] = el
          }} className='w-[3px] rounded-full' style={{ background: color, height: 3 }} />
      ))}
    </div>
  )
}
