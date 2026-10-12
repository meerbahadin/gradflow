'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export type DocsSection = { id: string; label: string }

/** The docs table of contents; highlights whichever section is being read. */
export default function DocsNav({ sections }: { sections: DocsSection[] }) {
  const [active, setActive] = useState(sections[0]?.id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      // a band near the top of the viewport: a section is "current" while
      // its heading area passes through it
      { rootMargin: '-15% 0px -70% 0px' }
    )

    for (const { id } of sections) {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    }

    return () => observer.disconnect()
  }, [sections])

  return (
    <nav aria-label='On this page' className='grid gap-0.5 text-sm'>
      <p className='mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>
        On this page
      </p>
      {sections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={active === id ? 'location' : undefined}
          className={cn(
            'border-l py-1.5 pl-4 transition-colors',
            active === id
              ? 'border-foreground text-foreground'
              : 'border-border text-muted-foreground hover:text-foreground'
          )}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}
