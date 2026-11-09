import type { Metadata } from 'next'
import Link from 'next/link'

import { CATEGORIES, ENTRIES } from '@/components/showcase/catalog'

export const metadata: Metadata = {
  title: 'Component library',
  description: 'Phone screens, Dynamic Islands, product and glass screens, and new gradient types built on GradFlow. Each one is a single file.',
}

export default function ComponentsIndex() {
  return (
    <>
      <header className='max-w-2xl'>
        <p className='font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground'>Component library</p>
        <h1 className='mt-4 text-4xl font-medium leading-[1.02]'>Gradients, doing real work.</h1>
        <p className='mt-5 text-pretty text-lg leading-relaxed text-subtle'>
          {ENTRIES.length} pieces built on GradFlow: phone screens, Dynamic Islands, product and glass screens, and new
          gradient types. Open one to see it live, tune it and copy its source.
        </p>
      </header>

      {CATEGORIES.map((c) => (
        <section key={c.id} className='mt-16'>
          <div className='flex flex-wrap items-baseline justify-between gap-2 border-b border-hairline pb-3'>
            <h2 className='text-xl font-medium'>{c.name}</h2>
            <p className='text-sm text-muted-foreground'>{c.blurb}</p>
          </div>
          <div className='mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3'>
            {ENTRIES.filter((e) => e.category === c.id).map((e) => {
              const [a, b, d] = e.swatch
              return (
                <Link
                  key={e.slug}
                  href={`/components/${e.slug}`}
                  className='group overflow-hidden rounded-(--radius-panel) border border-border bg-surface transition-colors hover:border-ring'
                >
                  <div
                    className='h-28 transition-transform duration-500 group-hover:scale-[1.03]'
                    style={{ background: `radial-gradient(120% 140% at 20% 110%, ${a} 0%, transparent 55%), radial-gradient(90% 120% at 90% -10%, ${d} 0%, transparent 60%), ${b}` }}
                  />
                  <div className='p-4'>
                    <div className='flex items-baseline justify-between gap-3'>
                      <span className='shrink-0 font-medium'>{e.name}</span>
                      <span className='min-w-0 truncate font-mono text-[11px] text-muted-foreground'>{e.uses.join(' · ')}</span>
                    </div>
                    <p className='mt-1.5 line-clamp-2 text-sm leading-relaxed text-subtle'>{e.desc}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      ))}
    </>
  )
}
