'use client'

import { useRef, useState } from 'react'
import { Flow, type FlowConfig } from './flow/flow'
import { useLoop } from './phone'
import { Poster } from './desktop'

/**
 * Ask, as a full screen. The question is the headline, the answer is the
 * body, and the field behind them is the assistant: nearly still while you
 * type, bright and quick while it thinks, settled once it has answered.
 */

type Phase = 'idle' | 'typing' | 'thinking' | 'answer'

const QUERY = 'Why did signups drop on Tuesday?'
const ANSWER =
  'Signups fell 18% on Tue 4 Nov. Most of the drop came from mobile Safari after release 2.14, where the sign-up button moved below the fold.'
const ACTIONS = ['Open the funnel for 4 Nov', 'Compare 2.13 and 2.14', 'File an issue']

const FIELD: Record<Phase, FlowConfig> = {
  idle: { type: 'aura', color1: '#17152c', color2: '#0a0a12', color3: '#1c2a40', speed: 0.3, scale: 0.8, noise: 0.06 },
  typing: { type: 'aura', color1: '#221d48', color2: '#0b0a16', color3: '#1d3354', speed: 0.45, scale: 0.8, noise: 0.06 },
  thinking: { type: 'aura', color1: '#6d4dff', color2: '#ff5fa8', color3: '#38b4ff', speed: 2.4, scale: 1.1, noise: 0.06 },
  answer: { type: 'aura', color1: '#35297e', color2: '#120d26', color3: '#21507e', speed: 0.6, scale: 0.9, noise: 0.06 },
}

export default function Command({
  brand = 'Northwind',
  question = QUERY,
  state = 'auto',
}: {
  brand?: string
  /** the question that gets typed */
  question?: string
  /** pin the thinking or answered moment, or let it play */
  state?: 'auto' | 'thinking' | 'answered'
}) {
  const questionRef = useRef(question)
  questionRef.current = question
  const [looped, setPhase] = useState<Phase>('idle')
  const phase: Phase = state === 'auto' ? looped : state === 'thinking' ? 'thinking' : 'answer'
  const [typed, setQuery] = useState('')
  const query = state === 'auto' ? typed : question
  const [words, setWords] = useState(0)
  const [active, setActive] = useState(-1)

  useLoop(async (wait) => {
    setPhase('idle')
    setQuery('')
    setWords(0)
    setActive(-1)
    await wait(1400)
    setPhase('typing')
    const q = questionRef.current
    for (let i = 1; i <= q.length; i++) {
      setQuery(q.slice(0, i))
      await wait(38 + Math.random() * 45)
    }
    await wait(450)
    setPhase('thinking')
    await wait(2400)
    setPhase('answer')
    const total = ANSWER.split(' ').length
    for (let n = 1; n <= total; n++) {
      setWords(n)
      await wait(60 + Math.random() * 50)
    }
    await wait(600)
    for (let i = 0; i < ACTIONS.length; i++) {
      setActive(i)
      await wait(700)
    }
    await wait(1600)
  })

  return (
    <Poster className='bg-[#0a0a12] text-white'>
      <Flow config={FIELD[phase]} transition={phase === 'thinking' ? 900 : 1500} quality={0.5} />

      <div className='relative flex h-full flex-col p-14'>
        <header className='flex items-center justify-between text-[14px]'>
          <span className='flex items-center gap-3'>
            <span className='rounded-md border border-white/25 px-2 py-0.5 font-mono text-[12px]'>⌘K</span>
            <span className='text-white/70'>Ask {brand}</span>
          </span>
          <span className='font-mono text-[12px] uppercase tracking-[.2em] text-white/50'>
            {phase === 'thinking' ? <span className='sc-shimmer'>Thinking</span> : phase === 'answer' ? 'Answered in 2.4s' : 'Listening'}
          </span>
        </header>

        <div className='flex-1' />

        <h2 className='font-heading max-w-[900px] text-[64px] font-medium leading-[1.02] tracking-[-.04em]'>
          {query || <span className='text-white/30'>Ask anything about your product…</span>}
          {phase === 'typing' && <span className='sc-caret ml-1 inline-block h-[54px] w-[3px] translate-y-[6px] bg-white' />}
        </h2>

        <p className='mt-7 min-h-[96px] max-w-[760px] text-[21px] leading-[32px] text-white/85'>{phase === 'answer' ? ANSWER.split(' ').slice(0, state === 'answered' ? Infinity : words).join(' ') : ''}</p>

        <div className='mt-8 flex gap-8 border-t border-white/20 pt-5 text-[15px]' style={{ opacity: active >= 0 || state === 'answered' ? 1 : 0, transition: 'opacity 500ms ease' }}>
          {ACTIONS.map((a, i) => (
            <span key={a} className='relative pb-1.5 transition-opacity duration-300' style={{ opacity: i === (state === 'answered' ? 0 : active) ? 1 : 0.55 }}>
              → {a}
              <span className='absolute inset-x-0 bottom-0 h-px bg-white transition-transform duration-500' style={{ transform: `scaleX(${i === (state === 'answered' ? 0 : active) ? 1 : 0})`, transformOrigin: 'left' }} />
            </span>
          ))}
          <span className='ml-auto font-mono text-[12px] text-white/45'>↵ run · esc close</span>
        </div>
      </div>
    </Poster>
  )
}
