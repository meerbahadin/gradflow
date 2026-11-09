'use client'

import type { ReactNode } from 'react'
import { Flow, type FlowConfig } from './flow/flow'

/** A 1120 × 700 borderless canvas: the product is the field, nothing frames it. */
export function Poster({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] font-sans shadow-[0_40px_120px_rgba(0,0,0,.5)] ${className}`} style={{ width: WIN_W, height: WIN_H }}>
      {children}
    </div>
  )
}

/** A 1120 × 700 desktop browser window to show product UI in. */
export const WIN_W = 1120
export const WIN_H = 700

export function Window({ url, dark = false, children }: { url: string; dark?: boolean; children: ReactNode }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[14px] font-sans shadow-[0_40px_120px_rgba(0,0,0,.55)] ${dark ? 'bg-[#0b0b0f] text-white ring-1 ring-white/10' : 'bg-white text-[#0b0d12] ring-1 ring-black/10'}`}
      style={{ width: WIN_W, height: WIN_H }}
    >
      <div className={`flex h-[40px] items-center gap-2 px-4 ${dark ? 'border-b border-white/[.07] bg-[#121218]' : 'border-b border-black/[.06] bg-[#f4f4f6]'}`}>
        <span className='size-3 rounded-full bg-[#ff5f57]' />
        <span className='size-3 rounded-full bg-[#febc2e]' />
        <span className='size-3 rounded-full bg-[#28c840]' />
        <div
          className={`mx-auto flex h-[26px] w-[380px] items-center justify-center rounded-md text-[12px] ${dark ? 'bg-white/[.06] text-white/50' : 'bg-black/[.05] text-black/45'}`}
        >
          {url}
        </div>
        <div className='w-[52px]' />
      </div>
      <div className='relative' style={{ height: WIN_H - 40 }}>
        {children}
      </div>
    </div>
  )
}

// a band `thickness` wide around the inside of the element's border box
const ring = (thickness: number) => ({
  padding: thickness,
  maskImage: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
  WebkitMaskImage: 'linear-gradient(#000 0 0), linear-gradient(#000 0 0)',
  maskClip: 'content-box, border-box',
  WebkitMaskClip: 'content-box, border-box',
  maskComposite: 'exclude',
  WebkitMaskComposite: 'xor',
})

/**
 * A living border for any rounded box: a crisp gradient hairline plus a soft
 * glow that bleeds outward, both drawn by the `aura` shader so the colour
 * wanders around the edge. Put it inside a `relative` box.
 */
export function GlowBorder({
  active,
  radius,
  colors,
  strength = 1,
  line = 1.5,
}: {
  active: boolean
  radius: number
  colors: [string, string, string]
  strength?: number
  line?: number
}) {
  const config: FlowConfig = { type: 'aura', color1: colors[0], color2: colors[1], color3: colors[2], speed: 1.1, scale: 1.2, noise: 0 }
  return (
    <div className='pointer-events-none absolute inset-0' style={{ opacity: active ? 1 : 0, transition: 'opacity 700ms ease' }}>
      <div className='absolute -inset-[16px]' style={{ filter: 'blur(16px)', opacity: 0.75 * strength, transition: 'opacity 900ms ease' }}>
        <div className='absolute inset-0 overflow-hidden' style={{ borderRadius: radius + 16, ...ring(22) }}>
          {active && <Flow config={config} transition={900} seed={7} />}
        </div>
      </div>
      <div className='absolute -inset-px overflow-hidden' style={{ borderRadius: radius + 1, ...ring(line) }}>
        {active && <Flow config={config} transition={900} seed={7} />}
      </div>
    </div>
  )
}
