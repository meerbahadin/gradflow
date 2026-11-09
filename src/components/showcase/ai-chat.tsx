'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import GradFlow from '@/components/grad-flow'

/**
 * A mobile AI chat on GradFlow. An aurora hangs from the top of the screen, a
 * living mesh orb is the assistant's face, a horizon glow sits behind the
 * composer and brightens while the assistant works, and voice mode is a
 * full-screen eclipse whose ring breathes with the voice. The conversation
 * plays itself on a loop.
 */

// ---------------------------------------------------------------------------
// palette

const INK = '#07060f'
const VIOLET = '#7c5cff'
const BLUE = '#4fb3ff'
const LILAC = '#efe9ff'

/** name and colours, set once on <AIChat> and read by every piece inside it */
const Theme = createContext({ name: 'Atlas', accent: VIOLET, highlight: BLUE })

// ---------------------------------------------------------------------------
// script

type Segment = { title?: string; text: string }
type Message =
  | { id: number; role: 'user'; text: string; voice?: boolean }
  | { id: number; role: 'ai'; segments: Segment[]; shown: number }

type VoiceState = 'closed' | 'listening' | 'thinking' | 'speaking'

const GREETING: Segment[] = [{ text: "Hey, I'm Atlas. What are we working on today?" }]
const CHIPS = ['Plan a trip', 'Summarize a PDF', 'Name my startup']
const PROMPT = 'Plan a 3-day trip to Lisbon on a budget'
const REPLY: Segment[] = [
  { text: "Here's a relaxed plan that keeps costs low:" },
  { title: 'Day 1 · Alfama', text: 'Tram 28 up the hill, the castle at golden hour, dinner at a tasca.' },
  { title: 'Day 2 · Belém', text: 'Pastéis de nata, the monastery, then a riverside walk to LX Factory.' },
  { title: 'Day 3 · Sintra', text: 'Early train from Rossio, Pena Palace before the crowds, back by sunset.' },
  { text: 'Want cheap places to stay near Baixa?' },
]
const VOICE_ASK = 'Can you make day two a bit more relaxed?'
const VOICE_REPLY =
  "Of course. I'll swap the monastery for a long lunch by the river, then a slow sunset walk up to Graça."

const length = (segments: Segment[]) =>
  segments.reduce((n, s) => n + (s.title?.length ?? 0) + s.text.length, 0)

function useChatScript() {
  const [messages, setMessages] = useState<Message[]>([])
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState<'idle' | 'thinking' | 'streaming'>('idle')
  const [chips, setChips] = useState(true)
  const [voice, setVoice] = useState<VoiceState>('closed')
  const [voiceUser, setVoiceUser] = useState('')
  const [voiceAi, setVoiceAi] = useState('')
  const [level, setLevel] = useState(0)
  const [pressed, setPressed] = useState<'send' | 'voice' | null>(null)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    let alive = true
    let meter: ReturnType<typeof setInterval> | undefined
    const wait = (ms: number) =>
      new Promise<void>((resolve, reject) =>
        setTimeout(() => (alive ? resolve() : reject(new Error('stopped'))), ms),
      )
    // how loud the current speaker is; the blob turns this into syllables
    const speak = (loudness: number) => setLevel(loudness)
    const quiet = () => setLevel(0)
    const words = async (text: string, set: (s: string) => void, ms: number) => {
      const parts = text.split(' ')
      for (let i = 1; i <= parts.length; i++) {
        set(parts.slice(0, i).join(' '))
        await wait(ms + Math.random() * 60)
      }
    }
    const stream = async (id: number, total: number) => {
      for (let shown = 0; shown < total; ) {
        shown = Math.min(total, shown + 2 + Math.floor(Math.random() * 4))
        setMessages((list) =>
          list.map((m) => (m.id === id && m.role === 'ai' ? { ...m, shown } : m)),
        )
        await wait(24)
      }
    }

    const run = async () => {
      for (;;) {
        // a fresh conversation
        setMessages([{ id: 1, role: 'ai', segments: GREETING, shown: length(GREETING) }])
        setDraft('')
        setChips(true)
        setVoiceUser('')
        setVoiceAi('')
        setFading(false)
        await wait(1600)

        // the visitor types
        setChips(false)
        for (let i = 1; i <= PROMPT.length; i++) {
          setDraft(PROMPT.slice(0, i))
          await wait(34 + Math.random() * 40)
        }
        await wait(380)
        setPressed('send')
        await wait(160)
        setPressed(null)
        setDraft('')
        setMessages((list) => [...list, { id: 2, role: 'user', text: PROMPT }])

        // the assistant thinks, then streams
        setBusy('thinking')
        await wait(1700)
        setBusy('streaming')
        setMessages((list) => [...list, { id: 3, role: 'ai', segments: REPLY, shown: 0 }])
        await stream(3, length(REPLY))
        setBusy('idle')
        await wait(2000)

        // voice mode
        setPressed('voice')
        await wait(220)
        setPressed(null)
        setVoice('listening')
        await wait(900)
        speak(0.45)
        await words(VOICE_ASK, setVoiceUser, 190)
        quiet()
        await wait(500)
        setVoice('thinking')
        await wait(1400)
        setVoice('speaking')
        speak(1)
        await words(VOICE_REPLY, setVoiceAi, 170)
        quiet()
        await wait(1100)

        // back to the thread, with the voice turn written into it
        setVoice('closed')
        setMessages((list) => [
          ...list,
          { id: 4, role: 'user', text: VOICE_ASK, voice: true },
          { id: 5, role: 'ai', segments: [{ text: VOICE_REPLY }], shown: length([{ text: VOICE_REPLY }]) },
        ])
        await wait(4200)
        setFading(true)
        await wait(600)
      }
    }

    run().catch(() => {})
    return () => {
      alive = false
      clearInterval(meter)
    }
  }, [])

  return { messages, draft, busy, chips, voice, voiceUser, voiceAi, level, pressed, fading }
}

// ---------------------------------------------------------------------------
// pieces

function Orb({ size, active }: { size: number; active: boolean }) {
  const { accent, highlight } = useContext(Theme)
  return (
    <div
      className='relative shrink-0 overflow-hidden rounded-full'
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 ${active ? 22 : 12}px ${active ? 'rgba(124,92,255,.75)' : 'rgba(124,92,255,.4)'}`,
        animation: active ? 'sc-orb-pulse 1.1s ease-in-out infinite' : undefined,
        transition: 'box-shadow 600ms ease',
      }}
    >
      <GradFlow
        config={{
          type: 'mesh',
          color1: accent,
          color2: highlight,
          color3: '#f0a8ff',
          speed: active ? 1.8 : 0.6,
          scale: 0.6,
          noise: 0,
        }}
        transition={600}
      />
      {/* a soft highlight so it reads as a sphere, not a disc */}
      <div
        className='pointer-events-none absolute inset-0 rounded-full'
        style={{
          background:
            'radial-gradient(circle at 32% 28%, rgba(255,255,255,.55), rgba(255,255,255,0) 45%), radial-gradient(circle at 70% 85%, rgba(7,6,15,.35), rgba(7,6,15,0) 60%)',
        }}
      />
    </div>
  )
}

/** The still avatar beside past replies; a live canvas per message would be wasteful. */
function Avatar() {
  const { accent, highlight } = useContext(Theme)
  return (
    <div
      className='mt-0.5 size-[22px] shrink-0 rounded-full'
      style={{
        background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,.6), transparent 45%), linear-gradient(135deg, #f0a8ff, ${accent} 45%, ${highlight})`,
        boxShadow: '0 0 10px rgba(124,92,255,.45)',
      }}
    />
  )
}

function Reply({ segments: raw, shown }: { segments: Segment[]; shown: number }) {
  const { name } = useContext(Theme)
  // the script says Atlas; show whatever the assistant is called
  const segments = raw.map((s) => ({ ...s, text: s.text.replace('Atlas', name) }))
  let left = shown
  const take = (s: string) => {
    const out = s.slice(0, Math.max(left, 0))
    left -= s.length
    return out
  }
  const streaming = shown < length(segments)

  return (
    <div className='flex gap-2.5'>
      <Avatar />
      <div className='min-w-0 flex-1 text-[15px] leading-[22px] text-[#dcd8f0]'>
        {segments.map((s, i) => {
          const title = s.title ? take(s.title) : ''
          const text = take(s.text)
          if (!title && !text) return null
          return s.title ? (
            <div key={i} className='mt-2.5 rounded-2xl border border-white/[.07] bg-white/[.035] px-3.5 py-2.5'>
              <div className='text-[13px] font-medium text-white'>{title}</div>
              {text && <div className='mt-0.5 text-[13.5px] leading-[20px] text-[#b9b4d4]'>{text}</div>}
            </div>
          ) : (
            <p key={i} className={i > 0 ? 'mt-2.5' : ''}>
              {text}
            </p>
          )
        })}
        {streaming && <span className='sc-caret ml-0.5 inline-block h-[15px] w-[7px] translate-y-[2px] rounded-[2px] bg-[#c9bfff]' />}
      </div>
    </div>
  )
}

function Thinking() {
  return (
    <div className='flex items-center gap-2.5'>
      <Orb size={22} active />
      <span className='sc-shimmer text-[14px] font-medium'>Thinking</span>
    </div>
  )
}

const Icon = {
  menu: (
    <svg viewBox='0 0 24 24' className='size-[18px]' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
      <path d='M4 8h16M4 16h10' />
    </svg>
  ),
  wave: (
    <svg viewBox='0 0 24 24' className='size-[18px]' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round'>
      <path d='M4 10v4M8 6v12M12 9v6M16 4v16M20 10v4' />
    </svg>
  ),
  mic: (
    <svg viewBox='0 0 24 24' className='size-[18px]' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
      <rect x='9' y='3' width='6' height='11' rx='3' />
      <path d='M5 11a7 7 0 0 0 14 0M12 18v3' />
    </svg>
  ),
  up: (
    <svg viewBox='0 0 24 24' className='size-[18px]' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M12 19V5M6 11l6-6 6 6' />
    </svg>
  ),
  x: (
    <svg viewBox='0 0 24 24' className='size-[22px]' fill='none' stroke='currentColor' strokeWidth='2.2' strokeLinecap='round'>
      <path d='M6 6l12 12M18 6L6 18' />
    </svg>
  ),
  keyboard: (
    <svg viewBox='0 0 24 24' className='size-[20px]' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
      <rect x='3' y='6' width='18' height='12' rx='2.5' />
      <path d='M7 10h.01M11 10h.01M15 10h.01M7 14h10' />
    </svg>
  ),
}

function StatusBar() {
  return (
    <div className='relative z-30 flex h-[54px] items-center justify-between px-8 pt-1 text-[15px] font-semibold text-white'>
      <span>9:41</span>
      <div className='absolute left-1/2 top-[11px] h-[34px] w-[122px] -translate-x-1/2 rounded-full bg-black' />
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
  )
}

// ---------------------------------------------------------------------------
// voice mode

/**
 * A fake voice: syllable-sized peaks with fast attack and slower decay, plus
 * the odd gap between words, read out as three bands that move differently.
 *  low  - slow body of the voice, opens the ring
 *  mid  - the syllables themselves, warp the rim and squash the disc
 *  high - the edges of each syllable, flash the glow
 */
function useVoiceSignal(loudness: number, onFrame: (s: { t: number; low: number; mid: number; high: number }) => void) {
  const loud = useRef(loudness)
  loud.current = loudness
  const frame = useRef(onFrame)
  frame.current = onFrame

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let t = 0
    let target = 0
    let next = 0
    let env = 0
    let low = 0
    let high = 0

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      t += dt

      const l = loud.current
      if (t >= next) {
        const gap = Math.random() < 0.16
        target = l > 0 && !gap ? l * (0.35 + Math.random() * 0.65) : l > 0 ? 0.06 : 0
        next = t + (gap ? 0.22 : 0.16) + Math.random() * 0.18
      }

      const prev = env
      env += (target - env) * (1 - Math.exp(-dt * (target > env ? 7 : 3)))
      low += (env - low) * (1 - Math.exp(-dt * 1.8))
      high += (Math.min(Math.abs(env - prev) / Math.max(dt, 1e-3) / 4, 1) - high) * (1 - Math.exp(-dt * 4))

      frame.current({ t, low, mid: env, high })
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
}

/**
 * The eclipse, untouched, inside a layer that the voice pushes around: its
 * scale and speed come from the low and mid bands, the rim is run through a
 * moving displacement filter, the disc squashes and tilts on each syllable,
 * and a halo flashes on their edges. Thinking spins the bright arc around.
 */
function VoiceBlob({ state, loudness }: { state: VoiceState; loudness: number }) {
  const layer = useRef<HTMLDivElement>(null)
  const halo = useRef<HTMLDivElement>(null)
  const turbulence = useRef<SVGFETurbulenceElement>(null)
  const displace = useRef<SVGFEDisplacementMapElement>(null)
  const spin = useRef(0)
  const lastPush = useRef(0)
  const [shader, setShader] = useState({ scale: 4, speed: 0.6 })
  const thinking = state === 'thinking'
  const speaking = state === 'speaking'

  useVoiceSignal(loudness, ({ t, low, mid, high }) => {
    // the layer is a square larger than the screen, so its corners never show
    spin.current += (thinking ? 0.6 : 0.04 + mid * 0.25) * (1 / 60)
    const tilt = Math.sin(t * 0.4) * 3 + spin.current * 57.3
    const squash = Math.sin(t * 2.2) * mid * 0.025
    if (layer.current) {
      layer.current.style.transform = `translate(-50%, -50%) rotate(${tilt}deg) scale(${1 + squash + low * 0.025}, ${1 - squash + low * 0.025})`
    }
    // a low frequency and a single octave: a few broad, round bulges, no fine ripple
    turbulence.current?.setAttribute(
      'baseFrequency',
      `${0.0045 + 0.0012 * Math.sin(t * 0.5)} ${0.0055 + 0.0012 * Math.cos(t * 0.42)}`,
    )
    displace.current?.setAttribute('scale', String(6 + mid * 18 + (thinking ? 5 + 3 * Math.sin(t * 1.2) : 0)))
    if (halo.current) {
      halo.current.style.opacity = String(0.1 + high * 0.3 + low * 0.25)
      halo.current.style.transform = `translate(-50%, -50%) scale(${0.92 + low * 0.18 + high * 0.05})`
    }

    // the shader only needs ~30 updates a second; GradFlow blends between them
    if (t - lastPush.current > 1 / 30) {
      lastPush.current = t
      setShader({
        // radius is 0.58 / sqrt(scale): lower scale, wider ring
        scale: (thinking ? 4.6 : 4.2) - low * 1.0 - mid * 0.3,
        speed: thinking ? 1.2 : 0.45 + mid * 0.8,
      })
    }
  })

  const { accent } = useContext(Theme)
  const tint = speaking ? accent : thinking ? '#a26bff' : '#4f7dff'

  return (
    <>
      <svg width='0' height='0' className='absolute'>
        <filter id='voice-warp' x='-10%' y='-10%' width='120%' height='120%'>
          <feTurbulence ref={turbulence} type='fractalNoise' baseFrequency='0.005' numOctaves='1' seed='7' result='noise' />
          <feDisplacementMap ref={displace} in='SourceGraphic' in2='noise' scale='4' xChannelSelector='R' yChannelSelector='G' />
        </filter>
      </svg>

      <div
        ref={layer}
        className='absolute left-1/2 top-1/2 size-[940px]'
        style={{ transform: 'translate(-50%, -50%)', filter: 'url(#voice-warp)', willChange: 'transform' }}
      >
        <GradFlow
          config={{ type: 'eclipse', color1: tint, color2: '#0b0820', color3: LILAC, speed: shader.speed, scale: shader.scale, noise: 0.12 }}
          transition={220}
        />
      </div>

      <div
        ref={halo}
        className='pointer-events-none absolute left-1/2 top-1/2 size-[360px] rounded-full mix-blend-screen'
        style={{
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, transparent 34%, ${tint}55 48%, transparent 70%)`,
          filter: 'blur(28px)',
          transition: 'background 600ms ease',
        }}
      />
    </>
  )
}

function VoiceMode({
  state,
  user,
  ai,
  level,
}: {
  state: VoiceState
  user: string
  ai: string
  level: number
}) {
  const { name } = useContext(Theme)
  const open = state !== 'closed'
  const speaking = state === 'speaking'

  return (
    <div
      className='absolute inset-0 z-40 flex flex-col'
      style={{
        opacity: open ? 1 : 0,
        transform: open ? 'scale(1)' : 'scale(1.06)',
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 520ms cubic-bezier(.2,.8,.2,1), transform 700ms cubic-bezier(.2,.8,.2,1)',
        background: INK,
      }}
    >
      <div className='absolute inset-0 overflow-hidden'>{open && <VoiceBlob state={state} loudness={level} />}</div>

      <StatusBar />
      <div className='relative z-10 flex items-center justify-between px-5 pt-1'>
        <span className='rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-medium text-white/80'>Voice</span>
        <span className='text-[12px] font-medium uppercase tracking-[.14em] text-white/50'>
          {state === 'listening' ? 'Listening' : state === 'thinking' ? 'Thinking' : speaking ? name : ''}
        </span>
      </div>

      <div className='flex-1' />

      <div className='relative z-10 min-h-[132px] px-8 pb-8 text-center'>
        {user && !ai && state !== 'thinking' && (
          <p className='font-heading text-[21px] leading-[28px] text-white/90'>{user}</p>
        )}
        {state === 'thinking' && <p className='sc-shimmer font-heading text-[22px]'>One sec…</p>}
        {ai && <p className='font-heading text-[21px] leading-[28px] text-white'>{ai}</p>}
        {!user && state === 'listening' && <p className='font-heading text-[22px] text-white/45'>Go ahead, I'm listening</p>}
      </div>

      <div className='relative z-10 flex items-center justify-center gap-6 pb-11'>
        <button className='grid size-14 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md'>{Icon.keyboard}</button>
        <button className='grid size-[72px] place-items-center rounded-full bg-white text-[#0b0820]'>{Icon.mic}</button>
        <button className='grid size-14 place-items-center rounded-full bg-[#ff4d5e] text-white'>{Icon.x}</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// screen

export default function AIChat({
  name = 'Atlas',
  accent = VIOLET,
  highlight = BLUE,
}: {
  /** what the assistant is called */
  name?: string
  /** the main colour: aurora, orb, glow and the voice ring */
  accent?: string
  /** the second colour of the orb and avatar */
  highlight?: string
}) {
  const { messages, draft, busy, chips, voice, voiceUser, voiceAi, level, pressed, fading } =
    useChatScript()
  const working = busy !== 'idle'
  const thread = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = thread.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, busy])

  return (
    <Theme.Provider value={{ name, accent, highlight }}>
    <div className='relative h-[844px] w-[390px] overflow-hidden rounded-[46px] font-sans' style={{ background: INK }}>
      {/* aurora canopy */}
      <div
        className='pointer-events-none absolute inset-x-0 top-0 h-[400px]'
        style={{ maskImage: 'linear-gradient(to bottom, #000 30%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, #000 30%, transparent 100%)' }}
      >
        <GradFlow
          config={{ type: 'aurora', color1: accent, color2: '#0c0824', color3: '#d08cff', speed: working ? 0.75 : 0.4, scale: 0.9, noise: 0.14 }}
          transition={900}
        />
      </div>

      {/* horizon glow behind the composer */}
      <div
        className='pointer-events-none absolute inset-x-0 bottom-0 h-[300px]'
        style={{
          maskImage: 'linear-gradient(to top, #000 40%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, #000 40%, transparent 100%)',
          opacity: working ? 1 : 0.6,
          transition: 'opacity 900ms ease',
        }}
      >
        <GradFlow
          config={{ type: 'horizon', color1: accent, color2: INK, color3: LILAC, speed: working ? 1.1 : 0.5, scale: working ? 0.95 : 0.55, noise: 0.12 }}
          transition={900}
        />
      </div>

      <div className='relative z-10 flex h-full flex-col'>
        <StatusBar />

        {/* header */}
        <header className='flex items-center justify-between px-4 pb-3 pt-1'>
          <button className='grid size-10 place-items-center rounded-full bg-white/[.08] text-white backdrop-blur-md'>{Icon.menu}</button>
          <div className='flex items-center gap-2.5'>
            <Orb size={30} active={working} />
            <div className='leading-tight'>
              <div className='font-heading text-[16px] font-medium text-white'>{name}</div>
              <div className='text-[12px] text-white/55'>
                {busy === 'thinking' ? 'Thinking…' : busy === 'streaming' ? 'Writing…' : 'Online'}
              </div>
            </div>
          </div>
          <button
            className='grid size-10 place-items-center rounded-full bg-white/[.08] text-white backdrop-blur-md transition-transform duration-200'
            style={{ transform: pressed === 'voice' ? 'scale(.86)' : undefined, background: pressed === 'voice' ? 'rgba(124,92,255,.6)' : undefined }}
          >
            {Icon.wave}
          </button>
        </header>

        {/* thread */}
        <div
          ref={thread}
          className='sc-no-scrollbar flex flex-1 flex-col gap-5 overflow-y-auto scroll-smooth px-5 pb-4 pt-24'
          style={{
            opacity: fading ? 0 : 1,
            transition: 'opacity 500ms ease',
            maskImage: 'linear-gradient(to bottom, transparent 0, #000 72px)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, #000 72px)',
          }}
        >
          <div className='flex-1' />
          {messages.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className='sc-msg-in flex justify-end'>
                <div className='max-w-[78%] rounded-[22px] rounded-br-md border border-white/[.08] bg-white/[.09] px-4 py-2.5 text-[15px] leading-[21px] text-white'>
                  {m.voice && (
                    <span className='mb-1 flex items-center gap-1 text-[11px] font-medium uppercase tracking-[.12em] text-white/50'>
                      <span className='scale-75'>{Icon.wave}</span>Voice
                    </span>
                  )}
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className='sc-msg-in'>
                <Reply segments={m.segments} shown={m.shown} />
              </div>
            ),
          )}
          {busy === 'thinking' && (
            <div className='sc-msg-in'>
              <Thinking />
            </div>
          )}
        </div>

        {/* chips + composer */}
        <div className='px-4 pb-2'>
          <div
            className='sc-no-scrollbar mb-3 flex gap-2 overflow-x-auto'
            style={{
              opacity: chips ? 1 : 0,
              transform: chips ? 'none' : 'translateY(8px)',
              transition: 'opacity 300ms ease, transform 400ms cubic-bezier(.2,.8,.2,1)',
            }}
          >
            {CHIPS.map((c) => (
              <span key={c} className='shrink-0 rounded-full border border-white/10 bg-white/[.06] px-3.5 py-2 text-[13px] text-white/80 backdrop-blur-md'>
                {c}
              </span>
            ))}
          </div>

          <div className='flex items-center gap-2 rounded-[28px] border border-white/[.12] bg-[#0f0d1c]/80 py-1.5 pl-5 pr-1.5 shadow-[0_8px_40px_rgba(91,61,245,.25)] backdrop-blur-xl'>
            <div className='flex min-w-0 flex-1 justify-end overflow-hidden whitespace-nowrap text-[15px]'>
              {draft ? (
                <span className='shrink-0 text-white'>
                  {draft}
                  <span className='sc-caret ml-px inline-block h-[17px] w-[2px] translate-y-[3px] bg-[#b8a8ff]' />
                </span>
              ) : (
                <span className='mr-auto text-[#7b7696]'>Ask {name} anything</span>
              )}
            </div>
            <button className='grid size-10 place-items-center rounded-full text-white/70'>{Icon.mic}</button>
            <button
              className='grid size-10 place-items-center rounded-full transition-all duration-200'
              style={{
                background: draft ? '#fff' : 'rgba(255,255,255,.12)',
                color: draft ? INK : 'rgba(255,255,255,.5)',
                transform: pressed === 'send' ? 'scale(.86)' : undefined,
              }}
            >
              {Icon.up}
            </button>
          </div>
        </div>

        <div className='flex h-[30px] items-center justify-center'>
          <div className='h-[5px] w-[134px] rounded-full bg-white/80' />
        </div>
      </div>

      <VoiceMode state={voice} user={voiceUser} ai={voiceAi} level={level} />
    </div>
    </Theme.Provider>
  )
}
