import fs from 'fs'
import path from 'path'
import type { Metadata } from 'next'

import BlockSource from '@/components/blocks/block-source'
import Player from '@/components/blocks/player'
import Pricing from '@/components/blocks/pricing'
import SignIn from '@/components/blocks/sign-in'
import StatCard from '@/components/blocks/stat-card'
import Waitlist from '@/components/blocks/waitlist'

export const metadata: Metadata = {
  title: 'Components',
  description:
    'Sign-in, pricing, waitlist, stat and player components built on GradFlow, with their source.',
}

const BLOCKS = [
  { file: 'sign-in.tsx', label: 'Sign in' },
  { file: 'pricing.tsx', label: 'Pricing' },
  { file: 'waitlist.tsx', label: 'Waitlist' },
  { file: 'stat-card.tsx', label: 'Stat card' },
  { file: 'player.tsx', label: 'Player' },
]

// show each source as it would read in someone else's project: the local
// alias for the gradient becomes an import from the published package
const readSource = (file: string) =>
  fs
    .readFileSync(path.join(process.cwd(), 'src/components/blocks', file), 'utf-8')
    .replace(
      "import GradFlow from '@/components/grad-flow'",
      "import { GradFlow } from 'gradflow'"
    )

const frame = 'overflow-hidden rounded-(--radius-surface) border border-border'

export default function DemoPage() {
  const sources = BLOCKS.map((block) => ({ ...block, code: readSource(block.file) }))

  return (
    <main className='container pb-24 pt-32 sm:pt-40'>
      <header className='max-w-2xl'>
        <p className='font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground'>
          Components
        </p>
        <h1 className='mt-4 text-4xl font-medium leading-[1.02]'>
          Gradients, put to work.
        </h1>
        <p className='mt-5 text-pretty text-lg leading-relaxed text-subtle'>
          Five pieces of interface with a GradFlow canvas somewhere inside.
          They are all live, so sign in, flip the billing period and pause
          the track.
        </p>
      </header>

      <div className='mt-14 grid gap-3 lg:grid-cols-12'>
        <div className={`${frame} lg:col-span-7`}>
          <SignIn />
        </div>
        <div className={`${frame} lg:col-span-5`}>
          <Pricing />
        </div>
        <div className={`${frame} lg:col-span-12`}>
          <Waitlist />
        </div>
        <div className={`${frame} lg:col-span-5`}>
          <StatCard />
        </div>
        <div className={`${frame} lg:col-span-7`}>
          <Player />
        </div>
      </div>

      <section className='mt-24 grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16'>
        <div>
          <p className='font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground'>
            Source
          </p>
          <h2 className='mt-4 text-3xl font-medium leading-[1.05]'>
            One file each.
          </h2>
          <p className='mt-4 text-pretty leading-relaxed text-subtle'>
            Every component is a single file built from GradFlow and a few
            Arc UI parts. Copy the one you need.
          </p>
        </div>
        <BlockSource blocks={sources} />
      </section>
    </main>
  )
}
