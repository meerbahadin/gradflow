import { GradientConfig } from '@/types/gradient'

export const copyCodeToClipboard = (config: GradientConfig) => {
  const codeString = `config={{
        color1: { r: ${config.color1.r}, g: ${config.color1.g}, b: ${config.color1.b} },
        color2: { r: ${config.color2.r}, g: ${config.color2.g}, b: ${config.color2.b} },
        color3: { r: ${config.color3.r}, g: ${config.color3.g}, b: ${config.color3.b} },
        speed: ${config.speed},
        scale: ${config.scale},
        type: '${config.type}',
        noise: ${config.noise}
      }}`
  return navigator.clipboard.writeText(codeString)
}
