'use client'

import React from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { GradientConfig, GradientType } from '@/types/gradient'
import { hexToRgb, rgbToHex } from '@/lib/color-utils'
import { generateRandomColors, randomGradientType } from '@/lib/random-colors'

interface GradientControlsProps {
  config: GradientConfig
  onConfigChange: (updates: Partial<GradientConfig>) => void
}

export function GradientControls({ config, onConfigChange }: GradientControlsProps) {
  const [randomizeType, setRandomizeType] = React.useState(true)

  return (
    <>
      <h3 className='font-semibold mb-3'>Gradient Controls</h3>

      <Select
        value={config.type}
        onValueChange={(e) => onConfigChange({ type: e as GradientType })}
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select a type' />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Type</SelectLabel>
            <SelectItem value='linear'>Linear</SelectItem>
            <SelectItem value='conic'>Conic</SelectItem>
            <SelectItem value='animated'>Animated</SelectItem>
            <SelectItem value='wave'>Wave</SelectItem>
            <SelectItem value='silk'>Silk</SelectItem>
            <SelectItem value='smoke'>Smoke</SelectItem>
            <SelectItem value='stripe'>Stripe</SelectItem>
            <SelectItem value='mesh'>Mesh</SelectItem>
            <SelectItem value='aurora'>Aurora</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div className='space-y-2'>
        {(['color1', 'color2', 'color3'] as const).map((colorKey) => (
          <div key={colorKey} className='flex items-center space-x-3'>
            <input
              type='color'
              value={rgbToHex(config[colorKey])}
              onChange={(e) =>
                onConfigChange({
                  [colorKey]: hexToRgb(e.target.value),
                })
              }
              className='w-10 h-6 rounded border cursor-pointer'
            />
            <input
              type='text'
              value={rgbToHex(config[colorKey])}
              onChange={(e) =>
                onConfigChange({
                  [colorKey]: hexToRgb(e.target.value),
                })
              }
              className='flex-1 border rounded px-2 py-1 text-xs'
            />
          </div>
        ))}
      </div>

      <div className='space-y-2'>
        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            id='randomize-type'
            checked={randomizeType}
            onChange={(e) => setRandomizeType(e.target.checked)}
            className='w-4 h-4 cursor-pointer'
          />
          <label htmlFor='randomize-type' className='text-sm cursor-pointer'>
            Randomize type
          </label>
        </div>
        <Button
          onClick={() => {
            const randomConfig = generateRandomColors()
            if (randomizeType) {
              randomConfig.type = randomGradientType()
            }
            onConfigChange(randomConfig)
          }}
          className='w-full'
          variant='outline'
        >
          Randomize
        </Button>
      </div>

      <div>
        <label className='block text-sm mb-1'>Speed: {config.speed.toFixed(1)}</label>
        <Slider
          min={0}
          onValueChange={(e) => onConfigChange({ speed: Number(e) })}
          value={[config.speed]}
          max={3}
          step={0.1}
          aria-label='speed'
        />
      </div>

      <div>
        <label className='block text-sm mb-1'>Scale: {config.scale.toFixed(1)}</label>
        <Slider
          min={0.5}
          onValueChange={(e) => onConfigChange({ scale: Number(e) })}
          value={[config.scale]}
          max={3}
          step={0.1}
          aria-label='scale'
        />
      </div>

      <div>
        <label className='block text-sm mb-1'>Noise: {config.noise.toFixed(2)}</label>
        <Slider
          min={0}
          onValueChange={(e) => onConfigChange({ noise: Number(e) })}
          value={[config.noise]}
          max={0.5}
          step={0.01}
          aria-label='noise'
        />
      </div>
    </>
  )
}
