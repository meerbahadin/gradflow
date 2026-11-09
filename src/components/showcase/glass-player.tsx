'use client'

import { useEffect, useState } from 'react'
import { Flow } from './flow/flow'
import { useLoop } from './phone'
import { Poster } from './desktop'

/**
 * A media player on fluted glass (`flute`). Each track owns a palette and the
 * glass blends from one album's colours to the next; the light behind the
 * flutes follows the cursor.
 */

const TRACKS = [
  { title: 'Slow Burn', artist: 'Low Tide Radio', album: 'Coastlines', length: 214, colors: ['#ff7a3d', '#2a0c08', '#ffd8a8'] as const },
  { title: 'Blue Hour', artist: 'Mira Vale', album: 'Afterglow', length: 241, colors: ['#4d6bff', '#080a2c', '#e2b8ff'] as const },
  { title: 'Fern', artist: 'Okto', album: 'Understory', length: 187, colors: ['#2bb37a', '#04170f', '#e4ffb8'] as const },
]

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export default function GlassPlayer({
  track = 'auto',
}: {
  /** pin one track, or let the player move through them */
  track?: 'auto' | 'slow-burn' | 'blue-hour' | 'fern'
}) {
  const [looped, setI] = useState(0)
  const i = track === 'auto' ? looped : ['slow-burn', 'blue-hour', 'fern'].indexOf(track)
  const [pos, setPos] = useState(48)

  useLoop(async (wait) => {
    for (let n = 0; n < TRACKS.length; n++) {
      setI(n)
      setPos(40 + n * 25)
      await wait(5200)
    }
  })

  useEffect(() => {
    const id = setInterval(() => setPos((p) => p + 0.25), 250)
    return () => clearInterval(id)
  }, [])

  const t = TRACKS[i]
  const next = TRACKS[(i + 1) % TRACKS.length]
  const [c1, c2, c3] = t.colors

  return (
    <Poster className='bg-black text-white'>
      <div className='absolute inset-0'>
        <Flow config={{ type: 'flute', color1: c1, color2: c2, color3: c3, speed: 0.5, scale: 1.2, noise: 0.05 }} transition={1600} interactive />
      </div>
      <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20' />

      <div className='relative flex h-full flex-col p-14'>
        <header className='flex items-center justify-between text-[14px]'>
          <span className='flex items-center gap-2.5 text-white/80'>
            <span className='size-2 rounded-full bg-white' />
            Playing on Studio speakers
          </span>
          <span className='font-mono text-[12px] text-white/55'>
            {i + 1} / {TRACKS.length}
          </span>
        </header>

        <div className='flex-1' />

        <div key={t.title} className='sc-swap-in'>
          <div className='font-mono text-[12px] uppercase tracking-[.2em] text-white/70'>{t.album}</div>
          <div className='font-heading mt-3 text-[150px] font-medium leading-[.9] tracking-[-.055em]'>{t.title}</div>
          <div className='mt-4 text-[22px] text-white/80'>{t.artist}</div>
        </div>

        <div className='mt-12 flex items-center gap-5 font-mono text-[12px] tabular-nums text-white/70'>
          <span>{fmt(pos)}</span>
          <div className='relative h-px flex-1 bg-white/30'>
            <div className='absolute inset-y-0 left-0 bg-white' style={{ width: `${Math.min(pos / t.length, 1) * 100}%`, transition: 'width 250ms linear' }} />
          </div>
          <span>−{fmt(Math.max(t.length - pos, 0))}</span>
        </div>

        <div className='mt-7 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            {['M18 6v12l-8.5-6L18 6zM8 6v12H6V6h2z', 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z', 'M6 6v12l8.5-6L6 6zm10 0v12h2V6h-2z'].map((d, n) => (
              <span key={n} className={`grid place-items-center rounded-full ${n === 1 ? 'size-14 bg-white text-black' : 'size-11 bg-white/15 text-white backdrop-blur-md'}`}>
                <svg viewBox='0 0 24 24' className={n === 1 ? 'size-6' : 'size-5'} fill='currentColor'>
                  <path d={d} />
                </svg>
              </span>
            ))}
          </div>
          <div className='text-right text-[14px]'>
            <div className='font-mono text-[11px] uppercase tracking-[.18em] text-white/55'>Up next</div>
            <div className='mt-1 text-white/90'>
              {next.title} <span className='text-white/50'>· {next.artist}</span>
            </div>
          </div>
        </div>
      </div>
    </Poster>
  )
}
