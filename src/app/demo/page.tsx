import path from 'path'

import CodeBlock from '@/components/code/code-block'
import { AiChat } from './ai-chat'

export default function DemoPage() {
  return (
    <main className='w-full'>
      <div className='h-screen w-full'>
        <AiChat />
      </div>

      <section className='container max-w-4xl py-16 space-y-3'>
        <h2 className='text-xl font-semibold'>AI Chat Source</h2>
        <p className='text-sm text-muted-foreground'>
          The full component behind this demo, background gradient included.
        </p>
        <CodeBlock
          filePath={path.join(process.cwd(), 'src/app/demo/ai-chat.tsx')}
        />
      </section>
    </main>
  )
}
