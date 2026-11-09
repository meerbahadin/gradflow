'use client'

import { useRef, useState } from 'react'
import GradFlow from '@/components/grad-flow'
import { useLoop } from './phone'
import { Flow } from './flow/flow'
import { Bars, COMPACT, EASE, Island, REST, Reveal, SPRING, Stage, type IslandShape } from './island'

/**
 * The assistant living in the Dynamic Island. Compact, it is a `core` orb and a
 * voice meter; opened, an aurora lights the top of the pill while the reply
 * streams in, and acting on it folds the island back to a confirmation.
 */

type Phase = 'rest' | 'listen' | 'speak' | 'booked'

const OPEN: IslandShape = { w: 370, h: 192, r: 44 }
const REPLY = 'Your 3pm with Lina moved to 4. Want me to book a ride for 3:40?'

const PINNED: Record<string, Phase> = { listening: 'listen', speaking: 'speak', booked: 'booked' }

export default function IslandAI({
  name = 'Atlas',
  reply = REPLY,
  state = 'auto',
}: {
  /** the assistant's name in the open island */
  name?: string
  /** what it says when opened */
  reply?: string
  /** pin the island to one moment, or let it loop */
  state?: 'auto' | 'listening' | 'speaking' | 'booked'
}) {
  const replyRef = useRef(reply)
  replyRef.current = reply
  const [looped, setPhase] = useState<Phase>('rest')
  const phase = state === 'auto' ? looped : PINNED[state]
  const [words, setWords] = useState(0)
  const [pressed, setPressed] = useState(false)

  useLoop(async (wait) => {
    setPhase('rest')
    setWords(0)
    await wait(1400)
    setPhase('listen')
    await wait(2600)
    setPhase('speak')
    await wait(520)
    const total = replyRef.current.split(' ').length
    for (let n = 1; n <= total; n++) {
      setWords(n)
      await wait(130 + Math.random() * 90)
    }
    await wait(1500)
    setPressed(true)
    await wait(200)
    setPressed(false)
    setPhase('booked')
    await wait(2600)
  })

  const open = phase === 'speak'
  const shape = phase === 'rest' ? REST : open ? OPEN : COMPACT
  // a little larger than the slot: the core draws its own halo around the sphere
  const orb = open ? { x: 13, y: 13, s: 50 } : { x: 3.5, y: 3.5, s: 30 }

  return (
    <Stage wallpaper='radial-gradient(120% 90% at 50% 0%, #2a1d5c 0%, #120d2a 55%, #07060f 100%)' expanded={open}>
      <Island shape={shape}>
        {/* aurora across the top of the open island */}
        <div
          className='pointer-events-none absolute inset-x-0 top-0 h-[120px]'
          style={{
            opacity: open ? 0.9 : 0,
            transition: `opacity 500ms ease ${open ? 200 : 0}ms`,
            maskImage: 'linear-gradient(to bottom, #000, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent)',
          }}
        >
          {open && <GradFlow config={{ type: 'aurora', color1: '#6a4dff', color2: '#000000', color3: '#d08cff', speed: 0.6, scale: 0.9, noise: 0.1 }} />}
        </div>

        {/* the orb is one element that grows from the compact slot to the open one */}
        {phase !== 'rest' && (
          <div
            className='absolute rounded-full'
            style={{
              // the halo fades into the black of the island instead of ending in a square
              maskImage: 'radial-gradient(closest-side, #000 62%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(closest-side, #000 62%, transparent 100%)',
              left: orb.x,
              top: orb.y,
              width: orb.s,
              height: orb.s,
              transition: `left 620ms ${SPRING}, top 620ms ${SPRING}, width 620ms ${SPRING}, height 620ms ${SPRING}`,
            }}
          >
            <Flow
              config={{ type: 'core', color1: '#6a4dff', color2: '#1b1450', color3: '#f0b8ff', speed: phase === 'listen' ? 1.6 : 0.8, scale: 1, noise: 0 }}
              transition={500}
            />
          </div>
        )}

        {/* compact, trailing side */}
        <Reveal show={phase === 'listen'} delay={260} className='absolute right-[12px] top-[10.5px]'>
          <Bars level={phase === 'listen' ? 1 : 0} color='linear-gradient(#c9b8ff, #7c5cff)' height={16} />
        </Reveal>
        <Reveal show={phase === 'booked'} delay={260} className='absolute right-[12px] top-0 flex h-[37px] items-center gap-1.5 text-[14px] font-semibold text-[#5fe0a8]'>
          <svg viewBox='0 0 24 24' className='size-[16px]' fill='none' stroke='currentColor' strokeWidth='2.6' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M5 12.5l4.5 4.5L19 7.5' />
          </svg>
          3:40
        </Reveal>

        {/* open */}
        <Reveal show={open} delay={240} className='absolute inset-x-[18px] top-[18px]'>
          <div className='flex h-[40px] items-center gap-3 pl-[52px]'>
            <div className='flex-1 leading-tight'>
              <div className='font-heading text-[15px] font-medium text-white'>{name}</div>
              <div className='text-[12px] text-white/55'>Speaking</div>
            </div>
            <Bars level={open ? 0.8 : 0} color='linear-gradient(#e2d8ff, #8a6bff)' height={18} count={6} />
          </div>
          <p className='mt-3 min-h-[44px] text-[15px] leading-[22px] text-white/90'>
            {reply.split(' ').slice(0, state === 'speaking' ? Infinity : words).join(' ')}
          </p>
          <div className='mt-3 flex gap-2'>
            <span className='grid h-[36px] flex-1 place-items-center rounded-full bg-white/[.12] text-[14px] font-medium text-white'>Not now</span>
            <span
              className='grid h-[36px] flex-1 place-items-center rounded-full bg-white text-[14px] font-semibold text-black'
              style={{
                opacity: state === 'speaking' || words >= reply.split(' ').length ? 1 : 0.35,
                transform: pressed ? 'scale(.95)' : undefined,
                transition: `opacity 300ms ease, transform 160ms ${EASE}`,
              }}
            >
              Book ride
            </span>
          </div>
        </Reveal>
      </Island>
    </Stage>
  )
}
