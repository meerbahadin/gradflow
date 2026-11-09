import ComponentsNav from '@/components/showcase/components-nav'

/** The component library: a sidebar of every piece beside the page being read. */
export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className='container grid gap-10 pb-24 pt-28 sm:pt-36 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-14'>
      <aside>
        {/* on small screens the list folds away behind one line */}
        <details className='group rounded-(--radius-panel) border border-border px-4 py-3 lg:hidden'>
          <summary className='cursor-pointer list-none text-sm font-medium'>
            Browse components <span className='text-muted-foreground group-open:hidden'>+</span>
          </summary>
          <div className='mt-5 pb-2'>
            <ComponentsNav />
          </div>
        </details>
        <div className='sticky top-28 hidden max-h-[calc(100vh-8rem)] overflow-y-auto pb-10 [scrollbar-width:none] lg:block'>
          <ComponentsNav />
        </div>
      </aside>
      <div className='min-w-0'>{children}</div>
    </main>
  )
}
