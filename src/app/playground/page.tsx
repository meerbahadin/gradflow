import type { Metadata } from 'next'

import Playground from '@/components/playground/playground'
import { GRADIENT_TYPES, PRESETS } from '@/constants/gradients'
import { resolveConfig } from '@/lib/resolve-config'
import type { GradientType, PresetName } from '@/types/gradient'

export const metadata: Metadata = {
  title: 'Playground',
  description:
    'Tune every GradFlow shader live: type, colors, speed, scale and noise. Copy the code or export a still.',
}

type Props = {
  searchParams: Promise<{ type?: string; preset?: string }>
}

export default async function PlaygroundPage({ searchParams }: Props) {
  const { type, preset } = await searchParams

  // links from the gallery open the playground on a given shader or preset
  const presetName =
    preset && preset in PRESETS ? (preset as PresetName) : undefined
  const typeName = GRADIENT_TYPES.includes(type as GradientType)
    ? (type as GradientType)
    : undefined

  // with nothing asked for, the playground opens on the package defaults
  const initial = resolveConfig(
    typeName ? { type: typeName } : undefined,
    presetName
  )

  return <Playground initial={initial} />
}
