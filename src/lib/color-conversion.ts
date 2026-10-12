import { RGB } from '@/types/gradient'

/**
 * Converts a hex color string to RGB object
 * @param hex - Hex color string (e.g., '#ff0000' or 'ff0000')
 * @returns RGB object with r, g, b values (0-255)
 */
export function hexToRgb(hex: string): RGB {
  // Remove # if present
  let cleaned = hex.trim().replace('#', '')

  // expand shorthand: #f0a -> #ff00aa
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('')
  }

  // Parse hex string
  const bigint = parseInt(cleaned, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return { r, g, b }
}

/**
 * Converts RGB object to hex color string
 * @param rgb - RGB object with r, g, b values (0-255)
 * @returns Hex color string with # prefix
 */
export function rgbToHex(rgb: RGB): string {
  const { r, g, b } = rgb
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

/**
 * Normalizes color input to RGB object
 * @param color - Hex string or RGB object
 * @returns RGB object
 */
export function normalizeColor(color: string | RGB): RGB {
  if (typeof color === 'string') {
    return hexToRgb(color)
  }
  return color
}
