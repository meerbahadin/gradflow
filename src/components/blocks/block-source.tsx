'use client'

import { useState } from 'react'

import { CodeBlock } from '@/components/arc/code-block/code-block'
import SegmentedControl from '@/components/arc/segmented-control/segmented-control'

export type BlockSourceEntry = { file: string; label: string; code: string }

/** Pick a block, read its source. */
export default function BlockSource({ blocks }: { blocks: BlockSourceEntry[] }) {
  const [file, setFile] = useState(blocks[0].file)
  const current = blocks.find((block) => block.file === file) ?? blocks[0]

  return (
    <div className='grid grid-cols-[minmax(0,1fr)] gap-4'>
      {/* in a flex row so the control keeps its own width instead of
          stretching across the grid column */}
      <div className='flex'>
        <SegmentedControl
          label='Component'
          value={file}
          onValueChange={setFile}
          options={blocks.map((block) => ({ value: block.file, label: block.label }))}
        />
      </div>
      <CodeBlock
        code={current.code}
        filename={current.file}
        language='tsx'
        maxLines={26}
      />
    </div>
  )
}
