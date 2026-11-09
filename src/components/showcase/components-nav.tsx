'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { CATEGORIES, ENTRIES } from './catalog'

/** The component library's sidebar: every piece, grouped, with the current one marked. */
export default function ComponentsNav() {
  const path = usePathname()

  return (
    <nav aria-label='Components' className='grid gap-7 text-sm'>
      <Link
        href='/components'
        aria-current={path === '/components' ? 'page' : undefined}
        className={cn('transition-colors', path === '/components' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground')}
      >
        Overview
      </Link>
      {CATEGORIES.map((c) => (
        <div key={c.id}>
          <p className='mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>{c.name}</p>
          <div className='grid gap-0.5'>
            {ENTRIES.filter((e) => e.category === c.id).map((e) => {
              const on = path === `/components/${e.slug}`
              return (
                <Link
                  key={e.slug}
                  href={`/components/${e.slug}`}
                  aria-current={on ? 'page' : undefined}
                  className={cn(
                    'border-l py-1.5 pl-4 transition-colors',
                    on ? 'border-foreground text-foreground' : 'border-border text-muted-foreground hover:text-foreground'
                  )}
                >
                  {e.name}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}
