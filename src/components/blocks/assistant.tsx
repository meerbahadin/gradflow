'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp, Mic, Sparkles, Square } from 'lucide-react'

import GradFlow from '@/components/grad-flow'
import { TextShimmer } from '@/components/arc/text-shimmer/text-shimmer'
import type { PresetName } from '@/types/gradient'

type Phase = 'idle' | 'listening' | 'thinking' | 'answering'

// the gradient is the status light: a glow along the bottom while idle,
// light running around the edges while the assistant listens or thinks
const PHASE_PRESET: Record<Phase, PresetName> = {
  idle: 'gemini',
  listening: 'halo',
  thinking: 'halo',
  answering: 'gemini',
}

const SUGGESTIONS = [
  'Explain how a shader draws a gradient',
  'Name my new coffee shop',
  'Plan a slow weekend',
]

const REPLIES: Record<string, string> = {
  [SUGGESTIONS[0]]:
    'A fragment shader runs once for every pixel. GradFlow hands it the position, the time and three colors, and a little math mixes them, so every frame comes out slightly different.',
  [SUGGESTIONS[1]]:
    'Slow Pour, Second Cup, Ember & Oat, Corner Light or Half Past. Tell me about the street it is on and I will tune them.',
  [SUGGESTIONS[2]]:
    'Leave Friday after lunch. Saturday is an early walk, a long lunch and a sunset somewhere high. Sunday is a late breakfast and home before dark.',
}

const fallback = (prompt: string) =>
  `No model behind this one. Asking "${prompt}" lights the edges while it thinks, then the glow settles back to the bottom as the answer streams in.`

const iconButton =
  'flex size-9 shrink-0 items-center justify-center rounded-full transition-[background-color,transform] active:scale-95'

/** A voice-assistant style prompt whose gradient shows what the assistant is doing. */
export default function Assistant() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [draft, setDraft] = useState('')
  const [question, setQuestion] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms))
  }

  const busy = phase === 'thinking' || phase === 'answering'

  const ask = (text: string) => {
    const prompt = text.trim()
    if (!prompt || busy) return

    timers.current.forEach(clearTimeout)
    timers.current = []
    setDraft('')
    setQuestion(prompt)
    setAnswer('')
    setPhase('thinking')

    later(() => {
      const words = (REPLIES[prompt] ?? fallback(prompt)).split(/(\s+)/)
      setPhase('answering')
      words.forEach((_, i) =>
        later(() => {
          setAnswer(words.slice(0, i + 1).join(''))
          if (i === words.length - 1) setPhase('idle')
        }, i * 30)
      )
    }, 1600)
  }

  const reset = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setQuestion(null)
    setAnswer('')
    setPhase('idle')
  }

  return (
    <div className='on-gradient relative isolate flex min-h-[520px] flex-col overflow-hidden bg-black'>
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <GradFlow preset={PHASE_PRESET[phase]} transition={900} interactive />
      </div>

      <div className='flex flex-1 flex-col justify-center px-6 pb-4 pt-10 sm:px-10'>
        {question === null ? (
          <div>
            <h3 className='bg-[linear-gradient(90deg,#4f8ff7,#9b72cb_45%,#d96570)] bg-clip-text text-4xl font-medium leading-[1.05] tracking-tight text-transparent sm:text-5xl'>
              Hello there
            </h3>
            <p className='mt-2 text-3xl font-medium leading-[1.1] tracking-tight text-muted-foreground sm:text-4xl'>
              How can I help today?
            </p>
            <div className='mt-8 flex flex-wrap gap-2'>
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type='button'
                  onClick={() => ask(suggestion)}
                  className='rounded-full border border-border bg-white/5 px-4 py-2 text-sm text-subtle backdrop-blur-xl transition-colors hover:bg-white/10 hover:text-foreground'
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className='flex flex-col gap-6' aria-live='polite'>
            <p className='max-w-[85%] self-end rounded-3xl rounded-br-md bg-white/12 px-4 py-2.5 text-[15px] backdrop-blur-xl'>
              {question}
            </p>
            <div className='flex gap-3'>
              <Sparkles className='mt-1 size-4 shrink-0 text-[#8ab4f8]' aria-hidden='true' />
              {phase === 'thinking' ? (
                <TextShimmer className='text-[15px]'>Thinking</TextShimmer>
              ) : (
                <p className='text-pretty text-[15px] leading-relaxed text-subtle'>{answer}</p>
              )}
            </div>
            {phase === 'idle' && (
              <button
                type='button'
                onClick={reset}
                className='self-start font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground'
              >
                Start over
              </button>
            )}
          </div>
        )}
      </div>

      <div className='px-4 pb-4 sm:px-6 sm:pb-6'>
        <p
          className={`mb-3 text-center text-sm text-subtle transition-opacity ${phase === 'listening' ? 'opacity-100' : 'opacity-0'}`}
          aria-live='polite'
        >
          {phase === 'listening' ? 'Listening…' : ''}
        </p>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            ask(draft)
          }}
          className='flex items-center gap-2 rounded-full border border-border bg-black/55 p-1.5 pl-5 backdrop-blur-2xl'
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            disabled={busy}
            placeholder='Ask anything'
            aria-label='Ask anything'
            className='min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground disabled:opacity-60'
          />
          {draft.trim() ? (
            <button type='submit' aria-label='Send' className={`${iconButton} bg-white text-black`}>
              <ArrowUp className='size-4' />
            </button>
          ) : (
            <button
              type='button'
              disabled={busy}
              onClick={() => setPhase((p) => (p === 'listening' ? 'idle' : 'listening'))}
              aria-label={phase === 'listening' ? 'Stop listening' : 'Talk'}
              aria-pressed={phase === 'listening'}
              className={`${iconButton} ${phase === 'listening' ? 'bg-[#4285f4]' : 'bg-white/10 hover:bg-white/15'} disabled:opacity-50`}
            >
              {phase === 'listening' ? <Square className='size-3.5 fill-current' /> : <Mic className='size-4' />}
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
