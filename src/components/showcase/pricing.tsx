'use client'

import { useState } from 'react'
import { Flow, type FlowConfig } from './flow/flow'
import { useLoop, useTween } from './phone'
import { Poster } from './desktop'

/**
 * Pricing as a mood. The whole page is the selected plan's field: a pale,
 * almost still drift for Starter, living ink for Pro, a lit core for Scale.
 * Plans are a list of words; the price is the headline.
 */

type Plan = { name: string; line: string; monthly: number; yearly: number; features: string[]; cta: string; light?: boolean; field: FlowConfig }

const PLANS: Plan[] = [
  {
    name: 'Starter',
    line: 'For side projects',
    monthly: 0,
    yearly: 0,
    features: ['3 projects', '10k events a month', 'Community support'],
    cta: 'Start free',
    light: true,
    field: { type: 'drift', color1: '#d7dbe4', color2: '#f5f3ef', color3: '#ffffff', speed: 0.3, scale: 0.8, noise: 0.05 },
  },
  {
    name: 'Pro',
    line: 'For teams shipping weekly',
    monthly: 24,
    yearly: 19,
    features: ['Unlimited projects', '2M events a month', 'Live dashboards', 'Priority support'],
    cta: 'Start 14-day trial',
    field: { type: 'veil', color1: '#6b4dff', color2: '#0b0822', color3: '#ff9db6', speed: 0.5, scale: 1, noise: 0.06 },
  },
  {
    name: 'Scale',
    line: 'For products with real traffic',
    monthly: 79,
    yearly: 63,
    features: ['Everything in Pro', '25M events a month', 'SSO and audit log', '99.99% uptime SLA'],
    cta: 'Talk to sales',
    field: { type: 'core', color1: '#ff7438', color2: '#1a0a12', color3: '#ffd6a6', speed: 0.45, scale: 0.9, noise: 0.06 },
  },
]

const PLAN_IDS = ['starter', 'pro', 'scale'] as const

export default function Pricing({
  brand = 'Northwind',
  plan: pinnedPlan = 'auto',
  billing = 'auto',
}: {
  brand?: string
  /** pin one plan, or let the page move between them */
  plan?: 'auto' | (typeof PLAN_IDS)[number]
  /** pin the billing period, or let it toggle */
  billing?: 'auto' | 'monthly' | 'yearly'
}) {
  const [loopSel, setSel] = useState(1)
  const [loopYearly, setYearly] = useState(false)
  const sel = pinnedPlan === 'auto' ? loopSel : PLAN_IDS.indexOf(pinnedPlan)
  const yearly = billing === 'auto' ? loopYearly : billing === 'yearly'

  useLoop(async (wait) => {
    setSel(1)
    setYearly(false)
    await wait(3200)
    setYearly(true)
    await wait(2800)
    setSel(2)
    await wait(3600)
    setSel(0)
    await wait(3000)
  })

  const plan = PLANS[sel]
  const price = Math.round(useTween(yearly ? plan.yearly : plan.monthly, 700))
  const ink = plan.light ? '#0d0c10' : '#ffffff'

  return (
    <Poster className='bg-[#0f0a2a]'>
      {/* one field per plan, cross-fading, so changing plan changes the whole page */}
      {PLANS.map((p, i) => (
        <div
          key={p.name}
          className='absolute inset-0'
          style={{ opacity: i === sel ? 1 : 0, transition: 'opacity 1100ms ease', background: p.field.type === 'core' ? '#070308' : undefined }}
        >
          {p.field.type === 'core' ? (
            // the core is an object, so it sits in the gap between the plan list and the details
            <div
              className='absolute left-[318px] top-[60px] size-[480px]'
              style={{ maskImage: 'radial-gradient(closest-side, #000 75%, transparent 100%)', WebkitMaskImage: 'radial-gradient(closest-side, #000 75%, transparent 100%)' }}
            >
              <Flow config={p.field} quality={0.75} />
            </div>
          ) : (
            <Flow config={p.field} quality={0.5} />
          )}
        </div>
      ))}

      <div className='relative flex h-full flex-col p-14 transition-colors duration-700' style={{ color: ink }}>
        <header className='flex items-center justify-between'>
          <span className='font-heading text-[17px] font-medium'>{brand}</span>
          <div className='flex items-center gap-5 text-[14px]'>
            {['Monthly', 'Yearly'].map((l) => {
              const on = (l === 'Yearly') === yearly
              return (
                <span key={l} className='relative pb-1.5 transition-opacity duration-500' style={{ opacity: on ? 1 : 0.5 }}>
                  {l}
                  {l === 'Yearly' && <span className='ml-1.5 font-mono text-[11px]'>−20%</span>}
                  <span className='absolute inset-x-0 bottom-0 h-px transition-transform duration-500' style={{ background: ink, transform: `scaleX(${on ? 1 : 0})` }} />
                </span>
              )
            })}
          </div>
        </header>

        <div className='mt-auto flex items-end justify-between gap-10'>
          {/* the plans, as words */}
          <div>
            <div className='font-mono text-[12px] uppercase tracking-[.2em] opacity-60'>Pricing</div>
            <div className='mt-4 grid gap-1'>
              {PLANS.map((p, i) => (
                <div
                  key={p.name}
                  className='font-heading text-[64px] font-medium leading-[1.05] tracking-[-.04em] transition-opacity duration-500'
                  style={{ opacity: i === sel ? 1 : 0.28 }}
                >
                  {p.name}
                </div>
              ))}
            </div>
          </div>

          {/* the chosen plan */}
          <div key={plan.name} className='sc-swap-in w-[330px] pb-2'>
            <div className='flex items-baseline gap-2'>
              <span className='font-heading text-[120px] font-medium leading-none tracking-[-.06em] tabular-nums'>${price}</span>
              <span className='text-[14px] opacity-60'>/ seat / mo</span>
            </div>
            <div className='mt-3 text-[15px] opacity-75'>{plan.line}</div>
            <div className='mt-5 grid gap-1.5 text-[14.5px]'>
              {plan.features.map((f) => (
                <div key={f} className='flex items-center gap-3'>
                  <span className='h-px w-3' style={{ background: ink, opacity: 0.6 }} />
                  {f}
                </div>
              ))}
            </div>
            <div
              className='mt-7 inline-flex h-[46px] items-center rounded-full px-6 text-[14px] font-medium'
              style={{ background: ink, color: plan.light ? '#fff' : '#0d0c10' }}
            >
              {plan.cta} →
            </div>
          </div>
        </div>
      </div>
    </Poster>
  )
}
