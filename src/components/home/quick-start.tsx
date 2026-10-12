'use client'

import { useState } from 'react'

import { CodeBlock } from '@/components/arc/code-block/code-block'
import SegmentedControl from '@/components/arc/segmented-control/segmented-control'
import SectionHeading from '@/components/site/section-heading'

const MANAGERS = {
  npm: 'npm install gradflow',
  pnpm: 'pnpm add gradflow',
  yarn: 'yarn add gradflow',
  bun: 'bun add gradflow',
}

type Manager = keyof typeof MANAGERS

const BACKGROUND = `import { GradFlow } from 'gradflow'

export default function Hero() {
  return (
    <section className="relative isolate h-screen">
      <div className="absolute inset-0 -z-10">
        <GradFlow preset="borealis" />
      </div>

      <h1>Your content, on top.</h1>
    </section>
  )
}`

const CUSTOM = `<GradFlow
  config={{
    type: 'prism',
    color1: '#ff3c78',
    color2: '#3c6eff',
    color3: '#5affc8',
    speed: 0.5,
    scale: 1,
    noise: 0.1,
  }}
  transition={900}
  interactive
/>`

function Step({
  number,
  title,
  children,
  aside,
}: {
  number: string
  title: string
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <li className='grid grid-cols-[minmax(0,1fr)] gap-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h3 className='flex items-baseline gap-3 text-lg font-medium'>
          <span className='font-mono text-xs text-muted-foreground'>{number}</span>
          {title}
        </h3>
        {aside}
      </div>
      {children}
    </li>
  )
}

export default function QuickStart() {
  const [manager, setManager] = useState<Manager>('npm')

  return (
    <section className='container grid gap-12 py-24 sm:py-32 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16'>
      <SectionHeading
        eyebrow='Quick start'
        title='From install to a living background in a minute.'
        className='lg:sticky lg:top-28 lg:self-start'
      >
        It is a client component that renders one canvas and fills its
        parent. Put it behind your content and it is done.
      </SectionHeading>

      <ol className='grid min-w-0 grid-cols-[minmax(0,1fr)] gap-10'>
        <Step
          number='01'
          title='Install'
          aside={
            <SegmentedControl
              label='Package manager'
              value={manager}
              onValueChange={(value) => setManager(value as Manager)}
              options={Object.keys(MANAGERS).map((name) => ({
                value: name,
                label: name,
              }))}
            />
          }
        >
          <CodeBlock code={MANAGERS[manager]} language='bash' />
        </Step>

        <Step number='02' title='Put it behind something'>
          <CodeBlock code={BACKGROUND} filename='hero.tsx' language='tsx' />
        </Step>

        <Step number='03' title='Make it yours'>
          <CodeBlock code={CUSTOM} language='tsx' />
        </Step>
      </ol>
    </section>
  )
}
