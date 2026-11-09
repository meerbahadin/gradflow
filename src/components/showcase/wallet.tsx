'use client'

import { useEffect, useRef, useState } from 'react'
import GradFlow from '@/components/grad-flow'
import { HomeBar, Screen, StatusBar, useLoop } from './phone'

/**
 * A wallet. The card face is a GradFlow fold that tilts toward the pointer,
 * and paying lifts it over a dark sheet while a soft glow runs around the
 * screen's edge until the payment clears.
 */

type Pay = 'idle' | 'hold' | 'done'

const ACTIVITY = [
  { name: 'Café Nova', meta: 'Today · 08:12', amount: '−€4.80', tint: '#ffb27a' },
  { name: 'Metro', meta: 'Yesterday', amount: '−€1.65', tint: '#7aa2ff' },
  { name: 'Salary', meta: 'Mon', amount: '+€2,400.00', tint: '#6fd4a8' },
]

function Contactless({ className = 'size-6' }: { className?: string }) {
  return (
    <svg viewBox='0 0 24 24' className={className} fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round'>
      <path d='M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17' />
    </svg>
  )
}

// Two masks that follow the 46px screen corners: a thin bright line right on
// the edge, and a wide soft band that bleeds inward.
const svgMask = (body: string) =>
  `url("data:image/svg+xml,${`<svg xmlns='http://www.w3.org/2000/svg' width='390' height='844'>${body}</svg>`
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E')}")`
const LINE_MASK = svgMask(
  `<filter id='b' x='-5%' y='-5%' width='110%' height='110%'><feGaussianBlur stdDeviation='1.6'/></filter><rect x='2' y='2' width='386' height='840' rx='44' fill='none' stroke='white' stroke-width='4' filter='url(%23b)'/>`,
)
const GLOW_MASK = svgMask(
  `<filter id='g' x='-10%' y='-10%' width='120%' height='120%'><feGaussianBlur stdDeviation='18'/></filter><rect x='0' y='0' width='390' height='844' rx='46' fill='none' stroke='white' stroke-opacity='.7' stroke-width='64' filter='url(%23g)'/>`,
)

const maskStyle = (mask: string) => ({ maskImage: mask, WebkitMaskImage: mask, maskSize: '100% 100%', WebkitMaskSize: '100% 100%' })

/** A slow, uneven wave: a few sines at unrelated rates, so it never repeats. */
const drift = (t: number, seed: number) =>
  (Math.sin(t * 0.73 + seed) + Math.sin(t * 1.31 + seed * 2.1) * 0.6 + Math.sin(t * 0.29 + seed * 3.7) * 0.8) / 2.4

/**
 * A Siri-style glow around the inside edge of the screen. GradFlow's mesh
 * drifts soft blobs of colour along the edge; the wide glow is pushed around
 * by a slowly moving displacement field, so it swells in one place and thins
 * in another, and both layers breathe on an uneven rhythm instead of a pulse.
 * Paying turns it green and lets it flare once.
 */
function EdgeGlow({ pay }: { pay: Pay }) {
  const on = pay !== 'idle'
  const done = pay === 'done'
  const glow = useRef<HTMLDivElement>(null)
  const line = useRef<HTMLDivElement>(null)
  const spinners = useRef<(HTMLDivElement | null)[]>([])
  const shades = useRef<(HTMLDivElement | null)[]>([])
  const turbulence = useRef<SVGFETurbulenceElement>(null)
  const displace = useRef<SVGFEDisplacementMapElement>(null)
  const paid = useRef(done)
  paid.current = done

  useEffect(() => {
    if (!on) return
    let raf = 0
    let last = performance.now()
    let t = 0
    let angle = 0
    let shadeAngle = 140
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      t += dt

      // colour travels around the edge, surging and easing rather than spinning evenly
      angle += dt * (paid.current ? 22 : 70 + 45 * drift(t * 0.7, 3))
      // brighter and dimmer stretches travel the other way at their own pace
      shadeAngle += dt * (paid.current ? -12 : -38 + 28 * drift(t * 0.5, 6))
      for (const el of spinners.current) if (el) el.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`
      for (const el of shades.current) if (el) el.style.transform = `translate(-50%, -50%) rotate(${shadeAngle}deg)`

      if (glow.current) glow.current.style.opacity = String(0.66 + 0.34 * drift(t * 1.9, 1))
      if (line.current) line.current.style.opacity = String(0.75 + 0.25 * drift(t * 2.3, 4))
      turbulence.current?.setAttribute('baseFrequency', `${0.006 + 0.002 * drift(t * 1.6, 2)} ${0.0045 + 0.0018 * drift(t * 1.4, 7)}`)
      displace.current?.setAttribute('scale', String(34 + 22 * drift(t * 2.1, 9)))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [on])

  const config = done
    ? { type: 'mesh' as const, color1: '#16a36c', color2: '#7eeec0', color3: '#2bd391', speed: 0.8, scale: 2.2, noise: 0 }
    : { type: 'mesh' as const, color1: '#3b6bff', color2: '#c65cff', color3: '#ff7f8f', speed: 2.2, scale: 2.2, noise: 0 }

  // a square bigger than the screen, so it can turn without its corners showing
  const square = 'absolute left-1/2 top-1/2 size-[1000px]'
  const shade =
    'conic-gradient(rgba(5,10,28,0) 0deg, rgba(5,10,28,.75) 70deg, rgba(5,10,28,0) 130deg, rgba(5,10,28,0) 200deg, rgba(5,10,28,.6) 250deg, rgba(5,10,28,0) 310deg)'

  const layer = (n: number, cfg: typeof config, shadeOpacity: number) => (
    <>
      <div ref={(el) => {
            spinners.current[n] = el
          }} className={square} style={{ transform: 'translate(-50%, -50%)' }}>
        {on && <GradFlow config={cfg} transition={1000} />}
      </div>
      <div
        ref={(el) => {
            shades.current[n] = el
          }}
        className={square}
        style={{ transform: 'translate(-50%, -50%)', background: shade, opacity: shadeOpacity, filter: 'blur(30px)' }}
      />
    </>
  )

  return (
    <div className='pointer-events-none absolute inset-0 z-50' style={{ opacity: on ? 1 : 0, transition: 'opacity 900ms ease' }}>
      <svg width='0' height='0' className='absolute'>
        <filter id='edge-warp' x='-5%' y='-5%' width='110%' height='110%'>
          <feTurbulence ref={turbulence} type='fractalNoise' baseFrequency='0.006 0.0045' numOctaves='1' seed='4' result='n' />
          <feDisplacementMap ref={displace} in='SourceGraphic' in2='n' scale='34' xChannelSelector='R' yChannelSelector='G' />
        </filter>
      </svg>

      <div className={done ? 'sc-flare absolute inset-0' : 'absolute inset-0'}>
        {/* wide glow, warped so its thickness wanders along the edge */}
        <div ref={glow} className='absolute inset-0' style={{ filter: 'url(#edge-warp)' }}>
          <div className='absolute inset-0 overflow-hidden' style={maskStyle(GLOW_MASK)}>
            {layer(0, config, 1)}
          </div>
        </div>
        {/* the thin bright line stays on the edge */}
        <div ref={line} className='absolute inset-0 overflow-hidden' style={maskStyle(LINE_MASK)}>
          {layer(1, { ...config, color2: done ? '#c9ffe6' : '#f0d8ff' }, 0.5)}
        </div>
      </div>
    </div>
  )
}

function Card({ pay, color, accent }: { pay: Pay; color: string; accent: string }) {
  const el = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  return (
    <div
      ref={el}
      onPointerMove={(e) => {
        const r = el.current!.getBoundingClientRect()
        setTilt({ x: ((e.clientX - r.left) / r.width - 0.5) * 2, y: ((e.clientY - r.top) / r.height - 0.5) * 2 })
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0 })}
      className='relative h-[214px] w-[342px] overflow-hidden rounded-[22px] text-white shadow-[0_24px_50px_-12px_rgba(8,17,58,.55)]'
      style={{
        transform: `perspective(900px) rotateX(${-tilt.y * 7}deg) rotateY(${tilt.x * 9}deg) ${pay === 'idle' ? '' : 'translateY(96px) scale(1.03)'}`,
        transition: 'transform 700ms cubic-bezier(.2,.8,.2,1)',
      }}
    >
      <GradFlow
        config={{ type: 'fold', color1: color, color2: '#08113a', color3: accent, speed: pay === 'hold' ? 1.2 : 0.5, scale: 1, noise: 0.1 }}
        transition={800}
        interactive
      />
      {/* sheen that follows the tilt */}
      <div
        className='pointer-events-none absolute inset-0'
        style={{ background: `radial-gradient(circle at ${50 + tilt.x * 40}% ${30 + tilt.y * 40}%, rgba(255,255,255,.22), transparent 55%)` }}
      />
      <div className='absolute inset-0 flex flex-col justify-between p-5'>
        <div className='flex items-start justify-between'>
          <span className='font-heading text-[22px] font-semibold tracking-[-.02em]'>nova</span>
          <Contactless />
        </div>
        <div className='h-[30px] w-[40px] rounded-[7px] bg-gradient-to-br from-[#f6e1b5] via-[#d9b77a] to-[#b48b4b] opacity-90' />
        <div className='flex items-end justify-between'>
          <div>
            <div className='font-mono text-[15px] tracking-[.18em]'>•••• 4821</div>
            <div className='mt-1 text-[12px] text-white/75'>Sam Rivera</div>
          </div>
          <span className='text-[12px] font-medium uppercase tracking-[.16em] text-white/80'>Debit</span>
        </div>
      </div>
    </div>
  )
}

const PINNED: Record<string, Pay> = { idle: 'idle', paying: 'hold', done: 'done' }

export default function Wallet({
  state = 'auto',
  cardColor = '#2a5cff',
  cardAccent = '#ffb27a',
}: {
  /** pin the pay flow to one moment, or let it loop */
  state?: 'auto' | 'idle' | 'paying' | 'done'
  /** the card's main fold colour */
  cardColor?: string
  /** the light catching the folds */
  cardAccent?: string
}) {
  const [looped, setPay] = useState<Pay>('idle')
  const pay = state === 'auto' ? looped : PINNED[state]

  useLoop(async (wait) => {
    setPay('idle')
    await wait(2800)
    setPay('hold')
    await wait(2600)
    setPay('done')
    await wait(2400)
  })

  const sheet = pay !== 'idle'

  return (
    <Screen background='#f2f2f6'>
      <StatusBar dark={!sheet} />

      <div className='relative z-10 px-6'>
        <div className='mt-2 flex items-center justify-between'>
          <h2 className='font-heading text-[32px] font-semibold tracking-[-.02em] text-[#0b0d1a]'>Wallet</h2>
          <button className='grid size-10 place-items-center rounded-full bg-white text-[22px] leading-none text-[#0b0d1a] shadow-sm'>+</button>
        </div>
      </div>

      {/* the live card rides above the sheet when paying */}
      <div className='relative z-40 mt-5 flex justify-center'>
        <Card pay={pay} color={cardColor} accent={cardAccent} />
      </div>

      {/* the cards behind it */}
      <div className='relative z-0 mt-3 px-6'>
        <div className='mx-auto h-[64px] w-[342px] rounded-t-[22px] bg-gradient-to-br from-[#ff8a5c] to-[#c23c6b] px-5 pt-4 text-[14px] font-semibold text-white shadow-[0_-6px_20px_rgba(0,0,0,.08)]'>
          Travel
        </div>
        <div className='mx-auto -mt-[20px] h-[64px] w-[342px] rounded-t-[22px] bg-gradient-to-br from-[#1f2937] to-[#0b0d1a] px-5 pt-4 text-[14px] font-semibold text-white'>
          Savings
        </div>
      </div>

      <div className='relative z-0 -mt-[18px] rounded-t-[28px] bg-white px-6 pt-5'>
        <div className='flex items-center justify-between'>
          <span className='text-[13px] font-medium uppercase tracking-[.12em] text-[#8a8ca0]'>Activity</span>
          <span className='text-[13px] font-medium text-[#2a5cff]'>See all</span>
        </div>
        {ACTIVITY.map((a) => (
          <div key={a.name} className='flex items-center gap-3 border-b border-black/[.06] py-3.5 last:border-0'>
            <div className='grid size-10 place-items-center rounded-full text-[14px] font-semibold text-white' style={{ background: a.tint }}>
              {a.name[0]}
            </div>
            <div className='flex-1'>
              <div className='text-[15px] font-medium text-[#0b0d1a]'>{a.name}</div>
              <div className='text-[12.5px] text-[#8a8ca0]'>{a.meta}</div>
            </div>
            <div className={`text-[15px] font-medium ${a.amount.startsWith('+') ? 'text-[#1f9d6b]' : 'text-[#0b0d1a]'}`}>{a.amount}</div>
          </div>
        ))}
      </div>

      {/* pay sheet */}
      <div
        className='absolute inset-0 z-20 flex flex-col items-center'
        style={{
          background: 'rgba(5,10,28,.97)',
          backdropFilter: 'blur(14px)',
          opacity: sheet ? 1 : 0,
          pointerEvents: sheet ? 'auto' : 'none',
          transition: 'opacity 500ms ease',
        }}
      >
        <div className='h-[500px]' />
        {/* a low, quiet glow along the bottom edge; it shifts from blue to green once paid */}
        <div
          className='pointer-events-none absolute inset-x-0 bottom-0 h-[300px]'
          style={{
            maskImage: 'linear-gradient(to top, #000 35%, transparent)',
            WebkitMaskImage: 'linear-gradient(to top, #000 35%, transparent)',
            opacity: 0.75,
          }}
        >
          {sheet && (
            <GradFlow
              config={
                pay === 'done'
                  ? { type: 'horizon', color1: '#0f5e44', color2: '#050a1c', color3: '#3fae84', speed: 0.35, scale: 0.7, noise: 0.1 }
                  : { type: 'horizon', color1: '#1d3a8f', color2: '#050a1c', color3: '#5a85e6', speed: 0.5, scale: 0.65, noise: 0.1 }
              }
              transition={900}
            />
          )}
        </div>

        <div className='relative grid size-[88px] place-items-center'>
          {pay === 'done' ? (
            <div className='sc-settle grid size-[72px] place-items-center rounded-full border-[1.5px] border-[#3ccf91]/70 bg-[#3ccf91]/[.08] text-[#5fe0a8]'>
              <svg viewBox='0 0 24 24' className='size-8' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path className='sc-draw' d='M5 12.5l4.5 4.5L19 7.5' />
              </svg>
            </div>
          ) : (
            <div className='grid size-[72px] place-items-center rounded-full border border-white/[.14] bg-white/[.04] text-white/80'>
              <Contactless className='size-7' />
            </div>
          )}
        </div>
        <div key={pay} className='sc-msg-in relative mt-6 text-center'>
          <div className='font-heading text-[17px] font-medium text-white/95'>{pay === 'done' ? 'Done' : 'Hold near reader'}</div>
          <div className='mt-1 text-[13px] text-white/45'>{pay === 'done' ? '€4.80 · Café Nova' : 'Nova Debit •••• 4821'}</div>
        </div>
      </div>

      <EdgeGlow pay={pay} />
      <HomeBar dark={!sheet} />
    </Screen>
  )
}
