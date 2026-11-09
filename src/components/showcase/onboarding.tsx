'use client'

import { useState } from 'react'
import GradFlow from '@/components/grad-flow'
import { HomeBar, Screen, StatusBar, useLoop } from './phone'

/**
 * Onboarding into a paywall. A single hero canvas carries every step: each
 * slide changes the gradient type and it dissolves into the next one, and on
 * the paywall it shrinks and becomes an eclipse.
 */

const SLIDES = [
  {
    title: 'Think out loud',
    body: 'Talk or type. Atlas turns loose thoughts into clear next steps.',
    config: { type: 'prism', color1: '#ff5a1e', color2: '#285aff', color3: '#78d2ff', speed: 0.5, scale: 1, noise: 0.1 },
  },
  {
    title: 'Every draft in one place',
    body: 'Notes, chats and files stay together and turn up in a second.',
    config: { type: 'glass', color1: '#1e50eb', color2: '#060e38', color3: '#ff7832', speed: 0.6, scale: 1, noise: 0.1 },
  },
  {
    title: 'Ready when you are',
    body: 'Start free, and upgrade only when it earns its place.',
    config: { type: 'mesh', color1: '#6ea5ff', color2: '#ffc8a0', color3: '#f0eeff', speed: 0.5, scale: 1, noise: 0.06 },
  },
] as const

const PRO = { type: 'eclipse', color1: '#ff5a14', color2: '#0b0a1c', color3: '#ffe1aa', speed: 0.6, scale: 1.6, noise: 0.12 } as const

const PLANS = [
  { id: 'year', name: 'Yearly', price: '€59.99 / year', note: '€5 a month', badge: 'Save 40%' },
  { id: 'month', name: 'Monthly', price: '€8.49 / month', note: 'Cancel anytime', badge: '' },
]

function Check() {
  return (
    <svg viewBox='0 0 24 24' className='size-[18px] shrink-0 text-[#ff5a14]' fill='none' stroke='currentColor' strokeWidth='2.4' strokeLinecap='round' strokeLinejoin='round'>
      <path d='M5 12.5l4.5 4.5L19 7.5' />
    </svg>
  )
}

const STEPS = ['1', '2', '3', 'paywall'] as const

export default function Onboarding({
  appName = 'Atlas',
  step: pinned = 'auto',
}: {
  /** the product name on the slides and the paywall */
  appName?: string
  /** pin one slide or the paywall, or let it play through */
  step?: 'auto' | (typeof STEPS)[number]
}) {
  const [looped, setStep] = useState(0)
  const step = pinned === 'auto' ? looped : STEPS.indexOf(pinned)
  const [plan, setPlan] = useState('year')
  const [pressed, setPressed] = useState(false)

  useLoop(async (wait) => {
    setPlan('year')
    for (let n = 0; n < SLIDES.length; n++) {
      setStep(n)
      await wait(3000)
      setPressed(true)
      await wait(180)
      setPressed(false)
    }
    setStep(3)
    await wait(2200)
    setPlan('month')
    await wait(1400)
    setPlan('year')
    await wait(1400)
    setPressed(true)
    await wait(180)
    setPressed(false)
    await wait(1600)
  })

  const paywall = step === 3
  const slide = SLIDES[Math.min(step, 2)]

  return (
    <Screen background='#f6f4f0'>
      {/* hero */}
      <div
        className='absolute inset-x-0 top-0 overflow-hidden rounded-b-[40px]'
        style={{ height: paywall ? 300 : 500, transition: 'height 900ms cubic-bezier(.2,.8,.2,1)' }}
      >
        <GradFlow config={paywall ? PRO : slide.config} transition={1400} />
        <div
          className='absolute inset-x-0 bottom-6 text-center text-white'
          style={{ opacity: paywall ? 1 : 0, transform: paywall ? 'none' : 'translateY(12px)', transition: 'opacity 600ms ease 300ms, transform 800ms cubic-bezier(.2,.8,.2,1) 300ms' }}
        >
          <div className='font-mono text-[11px] uppercase tracking-[.2em] text-white/70'>{appName}</div>
          <div className='font-heading text-[34px] font-semibold tracking-[-.02em]'>Pro</div>
        </div>
      </div>

      <div className='relative z-10'>
        <StatusBar />
        <div className='flex justify-end px-5'>
          <span className='rounded-full bg-black/25 px-3.5 py-1.5 text-[13px] font-medium text-white backdrop-blur-md'>{paywall ? 'Restore' : 'Skip'}</span>
        </div>
      </div>

      <div className='absolute inset-x-0 bottom-0 z-10 px-6 pb-12' style={{ top: paywall ? 300 : 500, transition: 'top 900ms cubic-bezier(.2,.8,.2,1)' }}>
        {!paywall ? (
          <div className='flex h-full flex-col pt-8'>
            <div key={step} className='sc-msg-in'>
              <h2 className='font-heading text-[30px] font-medium leading-[36px] tracking-[-.02em] text-[#14121a]'>{slide.title}</h2>
              <p className='mt-2.5 text-[16px] leading-[24px] text-[#6b6775]'>{slide.body.replace('Atlas', appName)}</p>
            </div>
            <div className='flex-1' />
            <div className='mb-5 flex gap-1.5'>
              {SLIDES.map((_, n) => (
                <span key={n} className='h-[6px] rounded-full bg-[#14121a] transition-all duration-500' style={{ width: n === step ? 22 : 6, opacity: n === step ? 1 : 0.2 }} />
              ))}
            </div>
            <button
              className='h-[56px] w-full rounded-full bg-[#14121a] text-[16px] font-medium text-white transition-transform duration-150'
              style={{ transform: pressed ? 'scale(.97)' : undefined }}
            >
              {step === 2 ? 'Get started' : 'Continue'}
            </button>
          </div>
        ) : (
          <div className='sc-msg-in flex h-full flex-col pt-6'>
            <h2 className='font-heading text-[26px] font-medium tracking-[-.02em] text-[#14121a]'>Do more with Pro</h2>
            <div className='mt-3 grid gap-2 text-[15px] text-[#3a3742]'>
              {['Unlimited voice conversations', 'Longer memory across chats', 'Priority speed at busy hours'].map((f) => (
                <div key={f} className='flex items-center gap-2.5'>
                  <Check />
                  {f}
                </div>
              ))}
            </div>
            <div className='mt-5 grid gap-2.5'>
              {PLANS.map((p) => {
                const on = plan === p.id
                return (
                  <div
                    key={p.id}
                    className='flex items-center gap-3 rounded-[20px] border-2 bg-white px-4 py-3 transition-colors duration-300'
                    style={{ borderColor: on ? '#ff5a14' : 'rgba(20,18,26,.08)' }}
                  >
                    <span className='grid size-[22px] place-items-center rounded-full border-2 transition-colors duration-300' style={{ borderColor: on ? '#ff5a14' : 'rgba(20,18,26,.2)' }}>
                      <span className='size-[10px] rounded-full bg-[#ff5a14] transition-transform duration-300' style={{ transform: on ? 'scale(1)' : 'scale(0)' }} />
                    </span>
                    <div className='flex-1'>
                      <div className='text-[15px] font-medium text-[#14121a]'>{p.name}</div>
                      <div className='text-[13px] text-[#6b6775]'>
                        {p.price} · {p.note}
                      </div>
                    </div>
                    {p.badge && <span className='rounded-full bg-[#ff5a14]/10 px-2.5 py-1 text-[12px] font-medium text-[#d9480f]'>{p.badge}</span>}
                  </div>
                )
              })}
            </div>
            <div className='flex-1' />
            <button
              className='h-[56px] w-full rounded-full bg-[#14121a] text-[16px] font-medium text-white transition-transform duration-150'
              style={{ transform: pressed ? 'scale(.97)' : undefined }}
            >
              Start 7-day free trial
            </button>
            <p className='mt-3 text-center text-[12px] text-[#8b8794]'>Then {plan === 'year' ? '€59.99 a year' : '€8.49 a month'}. Cancel anytime.</p>
          </div>
        )}
      </div>

      <HomeBar dark />
    </Screen>
  )
}
