import { cn } from '@/lib/utils'
import { INSTALL_COMMAND } from '@/lib/showcase'
import { CopyButton } from '@/components/arc/copy-button/copy-button'

/** The install command in a field of its own, with a copy action. */
export default function InstallCommand({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex h-[50px] items-center gap-2 rounded-(--radius-control) border border-border bg-surface pl-4 pr-1.5 backdrop-blur-xl',
        className
      )}
    >
      <span aria-hidden='true' className='select-none font-mono text-sm text-muted-foreground'>
        $
      </span>
      <code className='font-mono text-sm'>{INSTALL_COMMAND}</code>
      <CopyButton
        value={INSTALL_COMMAND}
        label='Copy install command'
        iconOnly
        variant='plain'
      />
    </div>
  )
}
