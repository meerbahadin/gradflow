'use client'

import { useState } from 'react'
import { Flow } from './flow/flow'
import { useLoop, useTween } from './phone'
import { Poster } from './desktop'

/**
 * A thermostat on fluted glass (`flute`). The glass is the room: cold blue
 * while it cools, warm orange while it heats, a calm green on eco. A warm light
 * behind the glass follows the cursor and stretches as it moves.
 */

type Mode = 'heat' | 'cool' | 'eco'

const MODES: Record<Mode, { label: string; note: string; target: number; colors: [string, string, string] }> = {
  heat: { label: 'Heating', note: 'Heating to 23° · ready in 12 min', target: 23, colors: ['#ff6a2b', '#2a0b05', '#ffd29a'] },
  cool: { label: 'Cooling', note: 'Cooling to 19.5° · window open in kitchen', target: 19.5, colors: ['#2f6bff', '#05102e', '#a8e6ff'] },
  eco: { label: 'Eco', note: 'Holding 21° while nobody is home', target: 21, colors: ['#1fae7a', '#031a12', '#c8ffd8'] },
}

const ROOMS = ['Living room', 'Bedroom', 'Kitchen', 'Studio']

export default function GlassClimate({
  room = 'Living room',
  mode: pinned = 'auto',
}: {
  /** the room shown first in the tabs */
  room?: string
  /** pin heating, cooling or eco, or let it cycle */
  mode?: 'auto' | Mode
}) {
  const [loopMode, setMode] = useState<Mode>('heat')
  const [loopTemp, setTemp] = useState(18.5)
  const mode = pinned === 'auto' ? loopMode : pinned
  const temp = pinned === 'auto' ? loopTemp : MODES[pinned].target

  useLoop(async (wait) => {
    setMode('heat')
    setTemp(18.5)
    await wait(600)
    setTemp(23)
    await wait(4200)
    setMode('cool')
    setTemp(19.5)
    await wait(4200)
    setMode('eco')
    setTemp(21)
    await wait(4200)
  })

  const m = MODES[mode]
  const shown = useTween(temp, 2600)
  const [c1, c2, c3] = m.colors
  // where the target sits on the 16–26° scale
  const at = (v: number) => ((v - 16) / 10) * 100

  return (
    <Poster className='bg-black text-white'>
      <div className='absolute inset-0'>
        <Flow config={{ type: 'flute', color1: c1, color2: c2, color3: c3, speed: 0.4, scale: 1, noise: 0.05 }} transition={1800} interactive />
      </div>
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent' />

      <div className='relative flex h-full p-14'>
        <div className='flex flex-1 flex-col'>
          <header className='flex items-center gap-8 text-[14px]'>
            <span className='font-heading text-[17px] font-medium'>Home</span>
            {[room, ...ROOMS.filter((r) => r !== room).slice(0, 3)].map((r, i) => (
              <span key={r} className='relative pb-1.5' style={{ color: i === 0 ? '#fff' : 'rgba(255,255,255,.55)' }}>
                {r}
                {i === 0 && <span className='absolute inset-x-0 bottom-0 h-px bg-white' />}
              </span>
            ))}
          </header>

          <div className='flex-1' />

          <div className='font-mono text-[12px] uppercase tracking-[.2em] text-white/75'>
            <span key={mode} className='sc-swap-in inline-block'>
              {m.label}
            </span>
          </div>
          <div className='font-heading mt-3 text-[200px] font-medium leading-[.85] tracking-[-.06em] tabular-nums'>
            {shown.toFixed(1)}
            <span className='align-top text-[90px] tracking-normal'>°</span>
          </div>
          <div key={m.note} className='sc-swap-in mt-6 text-[17px] text-white/85'>
            {m.note}
          </div>

          <div className='mt-14 flex gap-14 border-t border-white/25 pt-5'>
            {[
              ['Humidity', '42%'],
              ['Outside', '9°'],
              ['Today', '1.2 kWh'],
            ].map(([k, v]) => (
              <div key={k}>
                <div className='font-mono text-[11px] uppercase tracking-[.18em] text-white/60'>{k}</div>
                <div className='mt-1 font-heading text-[20px]'>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* the scale: ticks from 16 to 26, a dot at the target */}
        <div className='relative ml-10 w-[60px]'>
          {Array.from({ length: 11 }, (_, i) => (
            <div key={i} className='absolute right-0 flex items-center gap-2' style={{ bottom: `${i * 10}%`, transform: 'translateY(50%)' }}>
              <span className='font-mono text-[10px] text-white/45'>{i % 2 === 0 ? 16 + i : ''}</span>
              <span className='h-px bg-white/45' style={{ width: i % 2 === 0 ? 18 : 10 }} />
            </div>
          ))}
          <div
            className='absolute right-[-5px] size-[11px] rounded-full bg-white shadow-[0_0_16px_rgba(255,255,255,.9)]'
            style={{ bottom: `${at(m.target)}%`, transform: 'translateY(50%)', transition: 'bottom 1400ms cubic-bezier(.2,.8,.2,1)' }}
          />
        </div>
      </div>
    </Poster>
  )
}
