'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'
import { GITHUB_URL } from '@/lib/showcase'
import { motionTokens } from '@/components/arc/lib/motion-tokens'
import { MenuIcon } from '@/components/arc/icon-morph/icon-morph'
import { Tooltip } from '@/components/arc/tooltip/tooltip'
import { ThemeToggle } from '@/components/theme-toggle'
import ButtonLink from './button-link'
import GithubIcon from './github-icon'
import Logo from './logo'

const NAV = [
  { href: '/#collection', label: 'Gradients', match: null },
  { href: '/playground', label: 'Playground', match: '/playground' },
  { href: '/docs', label: 'Docs', match: '/docs' },
  { href: '/demo', label: 'Components', match: '/demo' },
]

const iconButton =
  'flex size-[38px] items-center justify-center rounded-xl text-subtle transition-colors hover:bg-muted hover:text-foreground'

export default function SiteHeader() {
  const pathname = usePathname()
  const reduced = useReducedMotion()
  const [hovered, setHovered] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const active = NAV.find((item) => item.match && pathname.startsWith(item.match))
  // the highlight rests on the current page and follows the pointer away from it
  const highlighted = hovered ?? active?.href ?? null

  return (
    <header className='pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-5'>
      <div className='pointer-events-auto mx-auto max-w-3xl rounded-[22px] border border-border bg-background/75 shadow-(--shadow-raised) backdrop-blur-xl backdrop-saturate-150'>
        <div className='flex h-[54px] items-center justify-between gap-2 pl-4 pr-2'>
          <Link
            href='/'
            className='flex items-center gap-2.5 rounded-lg'
            onClick={() => setOpen(false)}
          >
            <Logo className='h-4 w-auto' />
            <span className='font-heading text-[15px] font-semibold tracking-tight'>
              gradflow
            </span>
          </Link>

          <nav
            className='hidden items-center md:flex'
            onMouseLeave={() => setHovered(null)}
          >
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onMouseEnter={() => setHovered(href)}
                onFocus={() => setHovered(href)}
                onBlur={() => setHovered(null)}
                aria-current={active?.href === href ? 'page' : undefined}
                className={cn(
                  'relative rounded-xl px-3 py-2 text-sm transition-colors',
                  highlighted === href ? 'text-foreground' : 'text-subtle'
                )}
              >
                {highlighted === href && (
                  <motion.span
                    layoutId='nav-highlight'
                    className='absolute inset-0 rounded-xl bg-muted'
                    transition={reduced ? { duration: 0 } : motionTokens.spring.morph}
                  />
                )}
                <span className='relative'>{label}</span>
              </Link>
            ))}
          </nav>

          <div className='flex items-center gap-1'>
            <Tooltip content='Star on GitHub' side='bottom'>
              <a
                href={GITHUB_URL}
                target='_blank'
                rel='noreferrer'
                aria-label='GradFlow on GitHub'
                className={cn(iconButton, 'hidden sm:flex')}
              >
                <GithubIcon className='size-[18px]' />
              </a>
            </Tooltip>
            <ThemeToggle />
            {/* the wrapper carries the breakpoint: Arc's button styles set
                their own display and would win over a utility on the link */}
            <span className='ml-1 hidden sm:block'>
              <ButtonLink href='/docs' size='sm'>
                Get started
              </ButtonLink>
            </span>
            <button
              type='button'
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className={cn(iconButton, 'md:hidden')}
            >
              <MenuIcon state={open} className='size-5' />
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.nav
              key='mobile-nav'
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={reduced ? { duration: 0 } : motionTokens.spring.smooth}
              className='overflow-hidden md:hidden'
            >
              <div className='flex flex-col gap-0.5 border-t border-hairline p-2'>
                {NAV.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-muted',
                      active?.href === href
                        ? 'bg-muted text-foreground'
                        : 'text-subtle'
                    )}
                  >
                    {label}
                  </Link>
                ))}
                <a
                  href={GITHUB_URL}
                  target='_blank'
                  rel='noreferrer'
                  className='rounded-xl px-3 py-2.5 text-sm text-subtle transition-colors hover:bg-muted'
                >
                  GitHub
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
