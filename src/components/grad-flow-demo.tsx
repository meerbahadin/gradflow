'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'
import { GradFlowProps, GradientConfig } from '@/types/gradient'
import { ALT_DEMO_CONFIG, DEFAULT_CONFIG, PRESETS } from '@/constants/gradients'
import { useWebGLRenderer } from '@/hooks/useWebGLRenderer'
import { captureImage } from '@/lib/image-capture'
import { copyCodeToClipboard } from '@/lib/clipboard'
import { normalizeColor } from '@/lib/color-conversion'
import ContentDemo from './content-demo'
import { Check, Code, ImageDown, Settings } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import Image from 'next/image'
import Link from 'next/link'
import { GradientControls } from './demo/gradient-controls'
import { PresetButtons } from './demo/preset-buttons'

function applyInitialConfig(
  base: GradientConfig,
  initialConfig: GradFlowProps['config']
): GradientConfig {
  const normalized: GradientConfig = { ...base }

  if (initialConfig) {
    if (initialConfig.color1)
      normalized.color1 = normalizeColor(initialConfig.color1)
    if (initialConfig.color2)
      normalized.color2 = normalizeColor(initialConfig.color2)
    if (initialConfig.color3)
      normalized.color3 = normalizeColor(initialConfig.color3)
    if (initialConfig.speed !== undefined)
      normalized.speed = initialConfig.speed
    if (initialConfig.scale !== undefined)
      normalized.scale = initialConfig.scale
    if (initialConfig.type) normalized.type = initialConfig.type
    if (initialConfig.noise !== undefined)
      normalized.noise = initialConfig.noise
  }

  return normalized
}

export default function GradFlowDemo({
  config: initialConfig,
  className = '',
}: GradFlowProps) {
  const [config, setConfig] = useState<GradientConfig>(() =>
    applyInitialConfig(DEFAULT_CONFIG, initialConfig)
  )
  const hasCustomConfig = useRef(Boolean(initialConfig))

  // pick the demo's alternate hero look after mount only, so the
  // server-rendered markup and the first client render always match
  useEffect(() => {
    if (hasCustomConfig.current) return
    if (Math.random() < 0.5) {
      setConfig(applyInitialConfig(ALT_DEMO_CONFIG, initialConfig))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { canvasRef, rendererRef, meshRef } = useWebGLRenderer(config)

  const updateConfig = useCallback(
    (updates: Partial<GradientConfig>) => {
      const newConfig = { ...config, ...updates }
      setConfig(newConfig)
    },
    [config]
  )

  const applyPreset = useCallback((presetName: keyof typeof PRESETS) => {
    setConfig((prev) => ({ ...prev, ...PRESETS[presetName] }))
  }, [])

  const handleCaptureImage = useCallback(() => {
    const canvas = canvasRef.current
    const renderer = rendererRef.current
    const mesh = meshRef.current

    if (!canvas || !renderer) {
      console.log('Canvas or renderer not ready. Please try again.')
      return
    }

    captureImage(canvas, renderer, mesh)
  }, [canvasRef, rendererRef, meshRef])

  const [copied, setCopied] = useState(false)

  const handleCopyCode = useCallback(() => {
    copyCodeToClipboard(config).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [config])

  const actionButtons = (
    <div className='flex gap-2'>
      <Button
        className='flex-1 capitalize cursor-pointer'
        onClick={handleCopyCode}
        size='icon'
      >
        {copied ? <Check /> : <Code />}
        {copied ? 'copied' : 'copy'}
      </Button>
      <Button
        variant='outline'
        className='cursor-pointer'
        onClick={handleCaptureImage}
        title='Capture Image'
      >
        <ImageDown />
      </Button>
    </div>
  )

  return (
    <div className='h-screen w-full flex flex-col items-center justify-between relative py-2 rounded-3xl'>
      <nav className='flex w-full z-50 container justify-between items-center gap-4 pt-4 text-white'>
        <div className='flex items-center gap-8'>
          <Link href='/'>
            <Image
              width={30}
              height={30}
              src='/logo.svg'
              alt='logo'
              className='w-[30px] h-[30px]'
            />
          </Link>
          <div className='hidden md:flex items-center gap-8 text-xs uppercase tracking-widest'>
            <Link
              href='/#installation'
              className='opacity-70 hover:opacity-100 transition-opacity'
            >
              Docs
            </Link>
          </div>
        </div>

        <div className='flex items-center gap-8'>
          <div className='hidden md:flex items-center gap-8 text-xs uppercase tracking-widest'>
            <Link
              href='https://github.com/meerbahadin/gradflow'
              target='_blank'
              className='opacity-70 hover:opacity-100 transition-opacity'
            >
              GitHub
            </Link>
          </div>

          {/* mobile: controls stay in a popover */}
          <div className='relative lg:hidden dark'>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size='icon'
                  variant='outline'
                  className='cursor-pointer bg-transparent border-white/60 text-white'
                  aria-label='playground controls'
                >
                  <Settings />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='space-y-4'>
                <GradientControls
                  config={config}
                  onConfigChange={updateConfig}
                />
                <PresetButtons onApplyPreset={applyPreset} />
                {actionButtons}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>

      {/* desktop: controls in a fixed panel on the right for more space */}
      <aside className='dark hidden lg:block absolute right-4 top-1/2 -translate-y-1/2 z-50 w-80 max-h-[92vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden space-y-4 p-4 bg-black/80 text-white outline-1 outline-offset-2 outline-white/15 rounded-xl backdrop-blur-lg'>
        <GradientControls config={config} onConfigChange={updateConfig} />
        <PresetButtons onApplyPreset={applyPreset} />
        {actionButtons}
      </aside>

      <ContentDemo />

      <canvas
        ref={canvasRef}
        className={cn(
          'w-full h-full block absolute -z-10 top-0 touch-none select-none',
          className
        )}
      />
    </div>
  )
}
