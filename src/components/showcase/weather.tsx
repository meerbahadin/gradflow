'use client'

import { useState } from 'react'
import GradFlow from '@/components/grad-flow'
import { HomeBar, Screen, StatusBar, useLoop, useTween } from './phone'

/**
 * A weather screen whose sky runs through a day on a loop. One GradFlow canvas
 * changes type four times (horizon at dawn, rays at noon, dunes at sunset,
 * nebula at night) and each change dissolves along a noise front.
 */

type Icon = 'sun' | 'cloud' | 'moon' | 'rise'

const PHASES = [
  {
    time: '06:40', minutes: 400, temp: 14, cond: 'Sunrise', hi: 24, lo: 12, icon: 'rise' as Icon, now: 0,
    config: { type: 'horizon', color1: '#ff8a5c', color2: '#1c1d4f', color3: '#ffe0b0', speed: 0.5, scale: 1.15, noise: 0.1 },
  },
  {
    time: '12:30', minutes: 750, temp: 24, cond: 'Sunny', hi: 26, lo: 13, icon: 'sun' as Icon, now: 2,
    config: { type: 'rays', color1: '#fff0c2', color2: '#2f7fe0', color3: '#ffffff', speed: 0.5, scale: 1, noise: 0.08 },
  },
  {
    time: '19:10', minutes: 1150, temp: 21, cond: 'Golden hour', hi: 26, lo: 13, icon: 'sun' as Icon, now: 4,
    config: { type: 'dunes', color1: '#ff7a45', color2: '#3a1540', color3: '#ffd2a1', speed: 0.5, scale: 1, noise: 0.1 },
  },
  {
    time: '23:20', minutes: 1400, temp: 16, cond: 'Clear night', hi: 26, lo: 13, icon: 'moon' as Icon, now: 6,
    config: { type: 'nebula', color1: '#5a4bff', color2: '#05061a', color3: '#ffb08a', speed: 0.4, scale: 1, noise: 0.1 },
  },
] as const

const HOURS: { label: string; icon: Icon; temp: number }[] = [
  { label: '06', icon: 'rise', temp: 14 },
  { label: '09', icon: 'sun', temp: 19 },
  { label: '12', icon: 'sun', temp: 24 },
  { label: '15', icon: 'cloud', temp: 26 },
  { label: '19', icon: 'sun', temp: 21 },
  { label: '21', icon: 'moon', temp: 18 },
  { label: '23', icon: 'moon', temp: 16 },
]

function Glyph({ icon, className = 'size-5' }: { icon: Icon; className?: string }) {
  const common = { className, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, viewBox: '0 0 24 24' }
  if (icon === 'moon') return <svg {...common}><path d='M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z' /></svg>
  if (icon === 'cloud')
    return (
      <svg {...common}>
        <path d='M8 5.5V4M3.5 9H2M4.8 5.8l-1-1M12.5 8.2a4 4 0 0 0-7.4 2' />
        <path d='M17.5 19a3.5 3.5 0 0 0 0-7 5 5 0 0 0-9.6 1.6A3 3 0 0 0 8 19z' />
      </svg>
    )
  if (icon === 'rise')
    return (
      <svg {...common}>
        <path d='M7 17a5 5 0 0 1 10 0M3 17h18M12 3v5M9.5 5.5 12 3l2.5 2.5M5 11l1.4 1.4M19 11l-1.4 1.4' />
      </svg>
    )
  return (
    <svg {...common}>
      <circle cx='12' cy='12' r='4' />
      <path d='M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4' />
    </svg>
  )
}

/** Where the sun (or moon) sits on the day arc, minutes 360..1440 left to right. */
function arcPoint(minutes: number) {
  const k = Math.min(Math.max((minutes - 360) / (1440 - 360), 0), 1)
  const a = Math.PI * (1 - k)
  return { x: 150 + Math.cos(a) * 130, y: 70 - Math.sin(a) * 58 }
}

const TIMES = ['dawn', 'noon', 'sunset', 'night'] as const

export default function Weather({
  city = 'Lisbon',
  time = 'auto',
}: {
  city?: string
  /** pin the sky to one time of day, or let it run through the day */
  time?: 'auto' | (typeof TIMES)[number]
}) {
  const [looped, setI] = useState(0)
  const i = time === 'auto' ? looped : TIMES.indexOf(time)
  useLoop(async (wait) => {
    for (let n = 0; n < PHASES.length; n++) {
      setI(n)
      await wait(4200)
    }
  })

  const p = PHASES[i]
  const temp = Math.round(useTween(p.temp, 1400))
  const minutes = useTween(p.minutes, 1800)
  const dot = arcPoint(minutes)
  const h = Math.floor(minutes / 60) % 24
  const m = Math.floor(minutes % 60)

  return (
    <Screen background='#0b0c22'>
      <div className='absolute inset-0'>
        <GradFlow config={p.config} transition={1800} />
      </div>
      {/* keep the type readable on the bright noon sky */}
      <div className='pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-gradient-to-b from-black/30 to-transparent' />

      <StatusBar />
      <div className='relative z-10 flex h-[calc(100%-54px)] flex-col px-6 text-white'>
        <div className='mt-4 flex items-center justify-between'>
          <div>
            <div className='font-heading text-[22px] font-medium'>{city}</div>
            <div className='text-[13px] text-white/70'>
              {String(h).padStart(2, '0')}:{String(m).padStart(2, '0')} · Today
            </div>
          </div>
          <div className='grid size-10 place-items-center rounded-full bg-white/15 backdrop-blur-md'>
            <Glyph icon={p.icon} />
          </div>
        </div>

        <div className='mt-10 font-heading text-[112px] font-light leading-none tracking-[-.04em] [text-shadow:0_2px_30px_rgba(0,0,0,.15)]'>
          {temp}°
        </div>
        <div key={p.cond} className='sc-msg-in mt-2 text-[17px] font-medium'>
          {p.cond}
        </div>
        <div className='text-[14px] text-white/70'>
          H {p.hi}° · L {p.lo}°
        </div>

        <div className='flex-1' />

        {/* day arc */}
        <div className='mb-3 rounded-[26px] border border-white/15 bg-black/20 px-5 pb-3 pt-4 backdrop-blur-xl'>
          <div className='flex items-center justify-between text-[12px] font-medium uppercase tracking-[.12em] text-white/60'>
            <span>Sun</span>
            <span>
              Sunset 19:42
            </span>
          </div>
          <svg viewBox='0 0 300 80' className='mt-1 w-full'>
            <path d='M20 70 A130 58 0 0 1 280 70' fill='none' stroke='rgba(255,255,255,.25)' strokeWidth='1.5' strokeDasharray='3 5' />
            <line x1='8' y1='70' x2='292' y2='70' stroke='rgba(255,255,255,.18)' />
            <circle cx={dot.x} cy={dot.y} r='14' fill='rgba(255,236,200,.25)' />
            <circle cx={dot.x} cy={dot.y} r='6.5' fill='#fff6e6' />
          </svg>
        </div>

        {/* hourly */}
        <div className='mb-10 rounded-[26px] border border-white/15 bg-black/20 px-3 py-4 backdrop-blur-xl'>
          <div className='flex justify-between'>
            {HOURS.map((hour, n) => (
              <div
                key={hour.label}
                className='flex w-[44px] flex-col items-center gap-2 rounded-2xl py-2 transition-colors duration-700'
                style={{ background: n === p.now ? 'rgba(255,255,255,.2)' : 'transparent' }}
              >
                <span className='text-[12px] text-white/70'>{n === p.now ? 'Now' : hour.label}</span>
                <Glyph icon={hour.icon} className='size-[18px]' />
                <span className='text-[14px] font-medium'>{hour.temp}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <HomeBar />
    </Screen>
  )
}
