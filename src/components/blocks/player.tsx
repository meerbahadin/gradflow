'use client'

import { useState } from 'react'
import { SkipBack, SkipForward } from 'lucide-react'

import GradFlow from '@/components/grad-flow'
import { PlayPauseIcon } from '@/components/arc/icon-morph/icon-morph'
import { Slider } from '@/components/arc/slider/slider'

const LENGTH = 214

const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(Math.round(seconds % 60)).padStart(2, '0')}`

const control =
  'flex size-10 items-center justify-center rounded-full text-subtle transition-colors hover:bg-muted hover:text-foreground'

/** A player whose cover art is a gradient; pausing the track pauses the art. */
export default function Player() {
  const [playing, setPlaying] = useState(true)
  const [position, setPosition] = useState(72)

  return (
    <div className='flex h-full min-h-[360px] flex-col gap-6 bg-surface p-5 sm:flex-row sm:items-center'>
      <div className='relative isolate aspect-square w-full shrink-0 overflow-hidden rounded-(--radius-panel) bg-black sm:w-56'>
        <GradFlow preset='sahara' paused={!playing} />
      </div>

      <div className='flex min-w-0 flex-1 flex-col gap-5'>
        <div>
          <p className='font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>
            {playing ? 'Now playing' : 'Paused'}
          </p>
          <h3 className='mt-2 truncate text-2xl font-medium leading-tight'>
            Slow Burn
          </h3>
          <p className='mt-1 truncate text-sm text-subtle'>Low Tide Radio</p>
        </div>

        <Slider
          label='Position'
          value={position}
          onValueChange={setPosition}
          min={0}
          max={LENGTH}
          step={1}
          format={clock}
          showValue
        />

        <div className='flex items-center gap-1'>
          <button type='button' className={control} aria-label='Previous track'>
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
          <button type='button' className={control} aria-label='Next track'>
            <SkipForward className='size-4' />
          </button>
        </div>
      </div>
    </div>
  )
}
