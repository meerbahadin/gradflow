'use client'

import { useEffect, useState } from 'react'
import { useLoop } from './phone'
import { Flow } from './flow/flow'
import { Bars, COMPACT, EASE, Island, REST, Reveal, SPRING, Stage, type IslandShape } from './island'

/**
 * Now playing in the Dynamic Island. The album art is a live `ember` canvas
 * (one of the new types) that grows from the compact slot into the open player, and its glow
 * pulses on the beat until the track is paused.
 */

type Phase = 'rest' | 'compact' | 'open'

const OPEN: IslandShape = { w: 370, h: 178, r: 44 }
const LENGTH = 214
const BEAT = 0.652 // seconds, 92 bpm

function Icon({ d, fill = false, className = 'size-[26px]' }: { d: string; fill?: boolean; className?: string }) {
  return (
    <svg viewBox='0 0 24 24' className={className} fill={fill ? 'currentColor' : 'none'} stroke={fill ? 'none' : 'currentColor'} strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <path d={d} />
    </svg>
  )
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export default function IslandMusic({
  title = 'Slow Burn',
  artist = 'Low Tide Radio',
  state = 'auto',
}: {
  title?: string
  artist?: string
  /** pin the island to compact or open, or let it loop */
  state?: 'auto' | 'compact' | 'open'
}) {
  const [looped, setPhase] = useState<Phase>('rest')
  const phase = state === 'auto' ? looped : state
  const [loopPlaying, setPlaying] = useState(true)
  const playing = state === 'auto' ? loopPlaying : true
  const [pressed, setPressed] = useState(false)
  const [position, setPosition] = useState(72)

  useLoop(async (wait) => {
    setPhase('rest')
    setPlaying(true)
    await wait(1400)
    setPhase('compact')
    await wait(2800)
    setPhase('open')
    await wait(3400)
    setPressed(true)
    await wait(180)
    setPressed(false)
    setPlaying(false)
    await wait(1800)
    setPressed(true)
    await wait(180)
    setPressed(false)
    setPlaying(true)
    await wait(2200)
    setPhase('compact')
    await wait(2200)
  })

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => setPosition((p) => (p >= LENGTH ? 0 : p + 0.25)), 250)
    return () => clearInterval(id)
  }, [playing])

  const open = phase === 'open'
  const shape = phase === 'rest' ? REST : open ? OPEN : COMPACT
  const art = open ? { x: 18, y: 18, s: 58, r: 14 } : { x: 7.5, y: 7.5, s: 22, r: 6 }
  const move = `left 620ms ${SPRING}, top 620ms ${SPRING}, width 620ms ${SPRING}, height 620ms ${SPRING}, border-radius 520ms ${EASE}`

  return (
    <Stage wallpaper='radial-gradient(120% 90% at 50% 0%, #5a2a1c 0%, #2a1320 55%, #0d0810 100%)' expanded={open}>
      <Island shape={shape}>
        {phase !== 'rest' && (
          <>
            {/* the art's own colours, blurred, beating behind it */}
            <div
              className={playing ? 'sc-beat absolute' : 'absolute'}
              style={{
                left: art.x - 6,
                top: art.y - 6,
                width: art.s + 12,
                height: art.s + 12,
                borderRadius: art.r + 6,
                background: 'radial-gradient(circle, rgba(255,150,80,.75), rgba(255,120,60,0) 70%)',
                filter: 'blur(12px)',
                opacity: playing ? 1 : 0.35,
                animationDuration: `${BEAT}s`,
                transition: `${move}, opacity 400ms ease`,
              }}
            />
            <div
              className='absolute overflow-hidden'
              style={{ left: art.x, top: art.y, width: art.s, height: art.s, borderRadius: art.r, transition: move }}
            >
              <Flow
                config={{ type: 'ember', color1: '#ff7a3d', color2: '#2a0f22', color3: '#ffd9a0', speed: playing ? 0.7 : 0, scale: 1, noise: 0.08 }}
                transition={500}
              />
            </div>
          </>
        )}

        {/* compact, trailing side */}
        <Reveal show={phase === 'compact'} delay={260} className='absolute right-[13px] top-[10.5px]'>
          <Bars level={playing && phase === 'compact' ? 1 : 0} color='linear-gradient(#ffd9b0, #ff8a4a)' height={16} count={4} />
        </Reveal>

        {/* open player */}
        <Reveal show={open} delay={240} className='absolute inset-x-[18px] top-[18px]'>
          <div className='flex h-[58px] items-center gap-3 pl-[70px]'>
            <div className='flex-1 leading-tight'>
              <div className='font-heading text-[16px] font-medium text-white'>{title}</div>
              <div className='text-[13px] text-white/55'>{artist}</div>
            </div>
            <Bars level={open && playing ? 0.9 : 0} color='linear-gradient(#ffd9b0, #ff8a4a)' height={20} count={4} />
          </div>

          <div className='mt-4 flex items-center gap-2.5 text-[11px] font-medium tabular-nums text-white/50'>
            <span className='w-7'>{fmt(position)}</span>
            <div className='relative h-[5px] flex-1 overflow-hidden rounded-full bg-white/15'>
              <div className='absolute inset-y-0 left-0 rounded-full bg-white/85' style={{ width: `${(position / LENGTH) * 100}%`, transition: 'width 250ms linear' }} />
            </div>
            <span className='w-7 text-right'>−{fmt(LENGTH - position)}</span>
          </div>

          <div className='mt-3 flex items-center justify-center gap-10 text-white'>
            <Icon fill d='M18 6v12l-8.5-6L18 6zM8 6v12H6V6h2z' />
            <span className='grid size-[34px] place-items-center' style={{ transform: pressed ? 'scale(.85)' : undefined, transition: `transform 160ms ${EASE}` }}>
              {playing ? <Icon fill className='size-[30px]' d='M7 5h3.5v14H7zM13.5 5H17v14h-3.5z' /> : <Icon fill className='size-[30px]' d='M8 5.5v13l10.5-6.5L8 5.5z' />}
            </span>
            <Icon fill d='M6 6v12l8.5-6L6 6zm10 0v12h2V6h-2z' />
          </div>
        </Reveal>
      </Island>
    </Stage>
  )
}
