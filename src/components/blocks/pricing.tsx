'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

import { Flow } from '@/components/showcase/flow/flow'
import { AnimatedCounter } from '@/components/arc/animated-counter/animated-counter'
import { Badge } from '@/components/arc/badge/badge'
import { Button } from '@/components/arc/button/button'
import SegmentedControl from '@/components/arc/segmented-control/segmented-control'
import { Slider } from '@/components/arc/slider/slider'

/**
 * A featured plan behind glass blinds (the `panes` shader): one pane per
 * seat, so a single seat is one sheet of glass across the card and dragging
 * the slider splits it into more blinds. The light behind follows the cursor,
 * the billing period re-tints it, and the total follows.
 */

const PRICES = { monthly: 24, yearly: 19 }
type Billing = keyof typeof PRICES

const PALETTE: Record<Billing, { color1: string; color2: string; color3: string }> = {
  monthly: { color1: '#6b4dff', color2: '#0b0822', color3: '#ff9db6' },
  yearly: { color1: '#ff8a3c', color2: '#1a0b08', color3: '#ffd6a0' },
}

const FEATURES = ['Unlimited projects', 'Custom domains', 'Priority rendering', 'Team seats included']

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>('yearly')
  const [seats, setSeats] = useState(5)

  return (
    <div className='on-gradient relative isolate flex h-full min-h-[560px] flex-col justify-between gap-8 overflow-hidden bg-black p-7'>
      <div className='pointer-events-none absolute inset-0 -z-10'>
        {/* one glass pane per seat: scale is the pane count for this shader */}
        <Flow config={{ type: 'panes', ...PALETTE[billing], speed: 0.4, scale: seats, noise: 0.05 }} transition={450} quality={0.75} interactive />
        <div className='absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-transparent' />
      </div>

      <div className='flex items-start justify-between gap-4'>
        <div>
          <Badge className='backdrop-blur-xl'>Most popular</Badge>
          <h3 className='mt-4 text-2xl font-medium leading-tight'>Studio</h3>
        </div>
        <SegmentedControl
          label='Billing period'
          value={billing}
          onValueChange={(value) => setBilling(value as Billing)}
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ]}
        />
      </div>

      <div>
        <div className='flex items-end gap-2'>
          <AnimatedCounter value={PRICES[billing]} prefix='$' />
          <span className='pb-1 text-sm text-subtle'>per seat / month</span>
        </div>

        <div className='mt-6 rounded-(--radius-control) border border-border bg-black/30 px-4 py-3 backdrop-blur-xl'>
          <Slider label='Seats' value={seats} onValueChange={setSeats} min={1} max={20} step={1} format={(v) => `${v} seats`} />
          <p className='mt-2 text-sm text-subtle'>
            <span className='font-medium text-foreground'>${PRICES[billing] * seats}</span> a month for the team
            {billing === 'yearly' && <span>, billed yearly</span>}
          </p>
        </div>

        <ul className='mt-6 grid gap-2.5 text-sm'>
          {FEATURES.map((feature) => (
            <li key={feature} className='flex items-center gap-2.5'>
              <Check className='size-4 shrink-0' />
              {feature}
            </li>
          ))}
        </ul>

        <Button size='lg' className='mt-7 w-full'>
          Start a 14-day trial
        </Button>
      </div>
    </div>
  )
}
