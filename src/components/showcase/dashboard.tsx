'use client'

import { useState } from 'react'
import { Flow, type FlowConfig } from './flow/flow'
import { useLoop, useTween } from './phone'
import { Poster } from './desktop'

/**
 * An overview that shows one number at a time, the one that matters now, on a
 * field whose mood is that number: calm teal for revenue, a quicker violet
 * for a busy hour, and a hot, fast field when errors spike.
 */

type View = 'revenue' | 'users' | 'incident' | 'resolved'

const VIEWS: Record<View, { tab: string; label: string; value: number; format: (v: number) => string; note: string; field: FlowConfig }> = {
  revenue: {
    tab: 'Revenue',
    label: 'MRR · this quarter',
    value: 48250,
    format: (v) => `$${Math.round(v).toLocaleString('en-US')}`,
    note: '↑ 12.4%  Best quarter so far',
    field: { type: 'drift', color1: '#25a58d', color2: '#03201b', color3: '#b6ffe4', speed: 0.35, scale: 0.8, noise: 0.06 },
  },
  users: {
    tab: 'Users',
    label: 'Active right now',
    value: 1284,
    format: (v) => Math.round(v).toLocaleString('en-US'),
    note: '↑ 31%  Busiest hour this week',
    field: { type: 'drift', color1: '#5a72ff', color2: '#070a26', color3: '#d6bcff', speed: 0.8, scale: 1, noise: 0.06 },
  },
  incident: {
    tab: 'Errors',
    label: 'Error rate · checkout-api',
    value: 3.8,
    format: (v) => `${v.toFixed(1)}%`,
    note: 'Incident open · 2 min · on-call paged',
    field: { type: 'drift', color1: '#ff4f2a', color2: '#2a0505', color3: '#ffcf86', speed: 1.8, scale: 1.25, noise: 0.08 },
  },
  resolved: {
    tab: 'Errors',
    label: 'Error rate · checkout-api',
    value: 0.4,
    format: (v) => `${v.toFixed(1)}%`,
    note: 'Resolved · 6 min · rollback of 2.14.1',
    field: { type: 'drift', color1: '#c08a3a', color2: '#140c05', color3: '#f3e2b0', speed: 0.5, scale: 0.9, noise: 0.06 },
  },
}

const TABS = ['Revenue', 'Users', 'Errors', 'API']

export default function Dashboard({
  brand = 'Northwind',
  view: pinned = 'auto',
}: {
  brand?: string
  /** pin one view, or let the overview move through them */
  view?: 'auto' | View
}) {
  const [looped, setView] = useState<View>('revenue')
  const view = pinned === 'auto' ? looped : pinned
  useLoop(async (wait) => {
    setView('revenue')
    await wait(4200)
    setView('users')
    await wait(3600)
    setView('incident')
    await wait(4200)
    setView('resolved')
    await wait(3000)
  })

  const v = VIEWS[view]
  // only ease within the same metric (the error rate falling); a new metric just appears
  const shown = useTween(v.value, view === 'resolved' ? 1300 : 1)
  const errors = view === 'incident' ? '3.8%' : '0.4%'

  return (
    <Poster className='bg-[#03201b] text-white'>
      <Flow config={v.field} transition={1600} quality={0.5} />
      <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(120%_90%_at_0%_100%,rgba(0,0,0,.35),transparent_60%)]' />

      <div className='relative flex h-full flex-col p-14'>
        <header className='flex items-center justify-between'>
          <span className='font-heading text-[17px] font-medium tracking-[-.01em]'>{brand}</span>
          <nav className='flex gap-8 text-[14px]'>
            {TABS.map((t) => (
              <span key={t} className='relative pb-1.5 transition-colors duration-500' style={{ color: t === v.tab ? '#fff' : 'rgba(255,255,255,.5)' }}>
                {t}
                <span
                  className='absolute inset-x-0 bottom-0 h-px bg-white transition-transform duration-500'
                  style={{ transform: `scaleX(${t === v.tab ? 1 : 0})` }}
                />
              </span>
            ))}
          </nav>
        </header>

        <div className='flex-1' />

        <div key={`value-${view === 'resolved' ? 'incident' : view}`} className='sc-swap-in'>
          <div className='font-mono text-[12px] uppercase tracking-[.2em] text-white/70'>{v.label}</div>
          <div className='font-heading mt-3 text-[168px] font-medium leading-[.9] tracking-[-.055em] tabular-nums'>{v.format(shown)}</div>
        </div>
        <div key={`note-${view}`} className='sc-swap-in mt-6 text-[17px] text-white/80'>
          {v.note}
        </div>

        <div className='mt-16 flex gap-14 border-t border-white/20 pt-5 text-[14px]'>
          {[
            ['MRR', '$48,250'],
            ['Live', '1,284'],
            ['Errors', errors],
            ['API usage', '72%'],
          ].map(([k, val]) => (
            <div key={k}>
              <div className='font-mono text-[11px] uppercase tracking-[.18em] text-white/55'>{k}</div>
              <div className='mt-1 font-heading text-[20px] tabular-nums'>{val}</div>
            </div>
          ))}
        </div>
      </div>
    </Poster>
  )
}
