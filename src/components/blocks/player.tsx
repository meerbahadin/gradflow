'use client'

import { useEffect, useState } from 'react'
import { SkipBack, SkipForward } from 'lucide-react'

import GradFlow from '@/components/grad-flow'
import type { GradientType } from '@/types/gradient'
import { PlayPauseIcon } from '@/components/arc/icon-morph/icon-morph'
import { Slider } from '@/components/arc/slider/slider'
import '@/components/showcase/showcase.css'

/**
 * A player whose cover art is a gradient. Each track is its own gradient
 * type, so skipping lets GradFlow dissolve one cover into the next; the card
 * glows in the track's colours, and pausing the track pauses the art.
 */

const TRACKS: { title: string; artist: string; length: number; type: GradientType; colors: [string, string, string] }[] = [
  { title: 'Slow Burn', artist: 'Low Tide Radio', length: 214, type: 'dunes', colors: ['#ff9a52', '#3a1530', '#ffe0b8'] },
  { title: 'Blue Hour', artist: 'Mira Vale', length: 241, type: 'silk', colors: ['#4632dc', '#a096ff', '#06061c'] },
  { title: 'Fern', artist: 'Okto', length: 187, type: 'caustics', colors: ['#1496be', '#042850', '#beffe5'] },
]

const clock = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}`

const control =
  'flex size-10 items-center justify-center rounded-full text-subtle transition-colors hover:bg-white/10 hover:text-foreground'

export default function Player() {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [position, setPosition] = useState(72)
  const track = TRACKS[index]
  const [color1, color2, color3] = track.colors

  // the track plays on: the position moves, and the end of a track starts the next
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setPosition((p) => p + 1), 1000)
    return () => clearInterval(id)
  }, [playing])
  useEffect(() => {
    if (position < track.length) return
    setIndex((i) => (i + 1) % TRACKS.length)
    setPosition(0)
  }, [position, track.length])

  const skip = (step: number) => {
    setIndex((i) => (i + step + TRACKS.length) % TRACKS.length)
    setPosition(0)
  }

  return (
    <div className='on-gradient relative isolate flex h-full min-h-[360px] flex-col gap-6 overflow-hidden bg-[#0b0a10] p-5 sm:flex-row sm:items-center'>
      {/* the card picks up the cover's colours */}
      <div
        className='pointer-events-none absolute -left-20 -top-24 -z-10 size-[360px] rounded-full opacity-60 blur-[90px] transition-colors duration-1000'
        style={{ backgroundColor: color1 }}
      />
      <div
        className='pointer-events-none absolute -bottom-32 right-0 -z-10 size-[320px] rounded-full opacity-40 blur-[100px] transition-colors duration-1000'
        style={{ backgroundColor: color3 }}
      />

      <div className='relative isolate aspect-square w-full shrink-0 overflow-hidden rounded-(--radius-panel) bg-black shadow-[0_30px_60px_rgba(0,0,0,.5)] sm:w-56'>
        <GradFlow config={{ type: track.type, color1, color2, color3, speed: 0.6, scale: 1, noise: 0.08 }} transition={1200} paused={!playing} />
      </div>

      <div className='flex min-w-0 flex-1 flex-col gap-5'>
        <div key={track.title} className='sc-swap-in'>
          <p className='font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>
            {playing ? 'Now playing' : 'Paused'} · {index + 1} of {TRACKS.length}
          </p>
          <h3 className='mt-2 truncate text-3xl font-medium leading-tight'>{track.title}</h3>
          <p className='mt-1 truncate text-sm text-subtle'>{track.artist}</p>
        </div>

        <Slider label='Position' value={position} onValueChange={setPosition} min={0} max={track.length} step={1} format={clock} showValue />

        <div className='flex items-center gap-1'>
          <button type='button' className={control} aria-label='Previous track' onClick={() => skip(-1)}>
            <SkipBack className='size-4' />
          </button>
          <button
            type='button'
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? 'Pause' : 'Play'}
            className='flex size-12 items-center justify-center rounded-full bg-foreground text-background'
          >
            <PlayPauseIcon state={playing} className='size-5' />
          </button>
          <button type='button' className={control} aria-label='Next track' onClick={() => skip(1)}>
            <SkipForward className='size-4' />
          </button>
          <span className='ml-auto font-mono text-[11px] text-muted-foreground'>{track.type}</span>
        </div>
      </div>
    </div>
  )
}
