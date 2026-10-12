import Link from 'next/link'

import { GITHUB_URL, NPM_URL } from '@/lib/showcase'
import ButtonLink from './button-link'
import GradientWordmark from './gradient-wordmark'
import InstallCommand from './install-command'

const LINKS = [
  { label: 'Docs', href: '/docs' },
  { label: 'Playground', href: '/playground' },
  { label: 'Components', href: '/demo' },
  { label: 'GitHub', href: GITHUB_URL },
  { label: 'npm', href: NPM_URL },
  { label: 'Issues', href: `${GITHUB_URL}/issues` },
]

export default function SiteFooter() {
  return (
    <footer className='px-2 pb-2 sm:px-3 sm:pb-3'>
      <div className='overflow-hidden rounded-(--radius-surface) border border-border bg-surface'>
        <div className='container pb-8 pt-16 sm:pt-24'>
          <div className='flex flex-col justify-between gap-10 lg:flex-row lg:items-end'>
            <h2 className='max-w-xl text-balance text-3xl font-medium leading-[1.05] sm:text-4xl'>
              Give your next page{' '}
              <em className='font-serif font-normal tracking-[-0.02em]'>
                a pulse.
              </em>
            </h2>
            <div className='flex flex-wrap items-center gap-3'>
              <InstallCommand />
              <ButtonLink href='/docs' size='lg'>
                Read the docs
              </ButtonLink>
            </div>
          </div>

          <div className='mt-14 sm:mt-20'>
            <GradientWordmark />
          </div>

          <div className='mt-10 flex flex-col justify-between gap-6 border-t border-hairline pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center'>
            <p>
              MIT licensed. Built by{' '}
              <a
                href='https://www.meera.dev/'
                target='_blank'
                rel='noreferrer'
                className='text-foreground underline-offset-4 hover:underline'
              >
                Meer Bahadin
              </a>
              .
            </p>
            <nav className='flex flex-wrap gap-x-6 gap-y-2'>
              {LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noreferrer' : undefined}
                  className='transition-colors hover:text-foreground'
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
