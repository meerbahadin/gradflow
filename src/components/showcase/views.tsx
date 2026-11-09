'use client'

import { useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'

import AIChat from './ai-chat'
import Weather from './weather'
import Wallet from './wallet'
import Onboarding from './onboarding'
import Breathe from './breathe'
import IslandAI from './island-ai'
import IslandMusic from './island-music'
import Dashboard from './dashboard'
import Pricing from './pricing'
import Command from './command'
import Deploy from './deploy'
import GlassClimate from './glass-climate'
import GlassPlayer from './glass-player'
import GlassLanding from './glass-landing'
import { Flow, type FlowConfig } from './flow/flow'
import { WIN_H, WIN_W } from './desktop'
import type { Kind } from './catalog'
import './showcase.css'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VIEWS: Record<string, ComponentType<any>> = {
  'ai-chat': AIChat,
  weather: Weather,
  wallet: Wallet,
  onboarding: Onboarding,
  breathe: Breathe,
  'island-assistant': IslandAI,
  'island-now-playing': IslandMusic,
  overview: Dashboard,
  pricing: Pricing,
  ask: Command,
  deploy: Deploy,
  climate: GlassClimate,
  listening: GlassPlayer,
  landing: GlassLanding,
}

/** Scales a fixed-size component to fit its box. */
function Fit({ w, h, pad = 0, children }: { w: number; h: number; pad?: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [s, setS] = useState(0)
  useLayoutEffect(() => {
    const el = ref.current!
    const measure = () => setS(Math.min((el.clientWidth - pad * 2) / w, (el.clientHeight - pad * 2) / h))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [w, h, pad])
  return (
    <div ref={ref} className='absolute inset-0 grid place-items-center overflow-hidden'>
      <div style={{ width: w * s, height: h * s }}>
        <div style={{ width: w, height: h, transform: `scale(${s})`, transformOrigin: 'top left' }}>{s > 0 && children}</div>
      </div>
    </div>
  )
}

/** The live piece, framed for its kind: a phone, the top of a phone, a screen, or a bare shader. */
export function Preview({ slug, kind, shader, props }: { slug: string; kind: Kind; shader?: FlowConfig; props?: Record<string, unknown> }) {
  if (kind === 'shader' && shader) return <Flow config={shader} transition={400} quality={0.75} interactive={shader.type === 'flute'} />
  const View = VIEWS[slug]
  if (!View) return null
  if (kind === 'poster')
    return (
      <Fit w={WIN_W} h={WIN_H} pad={28}>
        <View {...props} />
      </Fit>
    )
  if (kind === 'island')
    return (
      <Fit w={414} h={272} pad={40}>
        <div
          className='rounded-t-[58px] bg-[#151419] px-3 pt-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]'
          style={{ width: 414, height: 272, maskImage: 'linear-gradient(to bottom, #000 70%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, #000 70%, transparent)' }}
        >
          <View {...props} />
        </div>
      </Fit>
    )
  return (
    <Fit w={414} h={868} pad={28}>
      <div className='rounded-[58px] bg-[#151419] p-3 shadow-[0_30px_80px_rgba(0,0,0,.55),inset_0_0_0_1px_rgba(255,255,255,.08)]'>
        <View {...props} />
      </div>
    </Fit>
  )
}
