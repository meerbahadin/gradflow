'use client'

import { Flow } from './flow/flow'
import { Poster } from './desktop'

/**
 * A landing page hero on fluted glass (`flute`). Wide flutes, a nav bar, one
 * headline and two calls to action. The glass stays still; the light behind
 * it follows the cursor and smears in the direction it moves.
 */

const NAV = ['Product', 'Pricing', 'Customers', 'Docs', 'Changelog']

export default function GlassLanding({
  brand = 'Northwind',
  headline = 'Ship the product, not the dashboard.',
  glass = '#6a4dff',
  light = '#ff8f6b',
}: {
  brand?: string
  headline?: string
  /** the colour of the glass itself */
  glass?: string
  /** the light your cursor drags behind it */
  light?: string
}) {
  return (
    <Poster className='bg-black text-white'>
      <div className='absolute inset-0'>
        <Flow config={{ type: 'flute', color1: glass, color2: '#0a0820', color3: light, speed: 0.45, scale: 0.8, noise: 0.05 }} interactive />
      </div>
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(90%_80%_at_20%_100%,rgba(0,0,0,.45),transparent_60%)]' />

      <div className='relative flex h-full flex-col p-12'>
        <nav className='flex items-center justify-between rounded-full bg-black/25 py-2 pl-6 pr-2 backdrop-blur-xl'>
          <span className='font-heading text-[17px] font-semibold tracking-[-.01em]'>{brand}</span>
          <div className='flex gap-8 text-[14px] text-white/75'>
            {NAV.map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
          <div className='flex items-center gap-2 text-[14px]'>
            <span className='px-3 text-white/80'>Sign in</span>
            <span className='rounded-full bg-white px-4 py-2 font-medium text-black'>Start free</span>
          </div>
        </nav>

        <div className='flex-1' />

        <div className='sc-swap-in'>
          <span className='rounded-full border border-white/30 px-3 py-1 font-mono text-[11px] uppercase tracking-[.16em] text-white/80'>New · Live dashboards</span>
          <h1 className='font-heading mt-6 max-w-[880px] text-[96px] font-medium leading-[.95] tracking-[-.05em]'>{headline}</h1>
          <p className='mt-6 max-w-[520px] text-[18px] leading-[28px] text-white/80'>
            {brand} turns your events into a live picture of the business, so the team can stop building internal tools.
          </p>
          <div className='mt-9 flex items-center gap-3 text-[15px]'>
            <span className='rounded-full bg-white px-6 py-3 font-medium text-black'>Start free →</span>
            <span className='rounded-full bg-white/15 px-6 py-3 backdrop-blur-md'>Book a demo</span>
            <span className='ml-4 font-mono text-[12px] text-white/55'>Drag your cursor across the glass</span>
          </div>
        </div>
      </div>
    </Poster>
  )
}
