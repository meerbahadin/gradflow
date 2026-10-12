import { cn } from '@/lib/utils'

/** The eyebrow, title and lede that open each section of the landing page. */
export default function SectionHeading({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow: string
  title: React.ReactNode
  children?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('max-w-2xl', className)}>
      <p className='font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground'>
        {eyebrow}
      </p>
      <h2 className='mt-4 text-balance text-3xl font-medium leading-[1.05] sm:text-4xl'>
        {title}
      </h2>
      {children && (
        <p className='mt-5 max-w-xl text-pretty text-base leading-relaxed text-subtle sm:text-lg'>
          {children}
        </p>
      )}
    </div>
  )
}
