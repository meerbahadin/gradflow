'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'

import GradFlow from '@/components/grad-flow'
import { AnimatedCounter } from '@/components/arc/animated-counter/animated-counter'
import { Badge } from '@/components/arc/badge/badge'
import { Button } from '@/components/arc/button/button'
import SegmentedControl from '@/components/arc/segmented-control/segmented-control'

const PRICES = { monthly: 24, yearly: 19 }
type Billing = keyof typeof PRICES

const FEATURES = [
  'Unlimited projects',
  'Custom domains',
  'Priority rendering',
  'Team seats included',
]

/** A featured plan card carried by a live gradient. */
export default function Pricing() {
  const [billing, setBilling] = useState<Billing>('yearly')

  return (
    <div className='on-gradient relative isolate flex h-full min-h-[560px] flex-col justify-between gap-10 overflow-hidden bg-black p-7'>
      <div className='pointer-events-none absolute inset-0 -z-10'>
        <GradFlow
          config={{
            type: 'aurora',
            color1: '#d21570',
            color2: '#8c3ff8',
            color3: '#56ffc3',
            speed: 0.5,
            scale: 1.2,
            noise: 0.2,
          }}
        />
        <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/25 to-transparent' />
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
