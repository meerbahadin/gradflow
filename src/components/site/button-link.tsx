import Link from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import styles from '@/components/arc/button/button.module.css'

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

/** A link that wears the Arc button styles, for navigation that looks like an action. */
export default function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(styles.button, styles[variant], styles[size], className)}
      {...props}
    />
  )
}
