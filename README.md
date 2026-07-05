# GradFlow

Beautiful animated WebGL gradients for React. Create stunning, performant gradient backgrounds with multiple animation styles.

## Features

- 🎨 **9 Gradient Types**: Linear, Conic, Animated, Wave, Silk, Smoke, Stripe, Mesh, and Aurora
- ♿ **Motion-Aware**: Respects `prefers-reduced-motion` and supports a `paused` prop
- 🔋 **Battery Friendly**: Automatically stops rendering when offscreen or in a hidden tab
- 🚀 **High Performance**: WebGL-powered rendering with optimized shaders
- 🎛️ **Fully Customizable**: Control colors, animation speed, scale, and noise
- 📱 **Responsive**: Automatically adapts to container size
- 🔧 **TypeScript Support**: Fully typed API
- 🎭 **Easy Integration**: Simple npm install and import

## Demo

Visit [gradflow.meera.dev](https://gradflow.meera.dev) to see GradFlow in action and experiment with different configurations.

## Installation

```bash
npm install gradflow
```

## Quick Start

```tsx
import { GradFlow } from 'gradflow'

function App() {
  return (
    <div className='relative h-screen'>
      <GradFlow />
      {/* Your content here */}
    </div>
  )
}
```

## Usage Examples

### With Custom Configuration

```tsx
import { GradFlow } from 'gradflow'

function App() {
  return (
    <GradFlow
      config={{
        color1: { r: 210, g: 21, b: 112 },
        color2: { r: 140, g: 63, b: 248 },
        color3: { r: 86, g: 255, b: 195 },
        speed: 0.5,
        scale: 1.2,
        type: 'aurora',
        noise: 0.32,
      }}
    />
  )
}
```

### Using Hex Colors

```tsx
import { GradFlow } from 'gradflow'

function App() {
  return (
    <GradFlow
      config={{
        color1: '#d21570',
        color2: '#8c3ff8',
        color3: '#56ffc3',
      }}
    />
  )
}
```

### Using Presets

```tsx
import { GradFlow } from 'gradflow'

function App() {
  return <GradFlow preset='cosmic' />
}
```

Available presets: `cosmic`, `matrix`, `electric`, `inferno`, `mystic`, `cyber`, `neon`, `plasma`, `dream`, `borealis`

Presets can be combined with `config` — config values override the preset:

```tsx
<GradFlow preset='borealis' config={{ speed: 0.2 }} />
```

### Pausing the Animation

```tsx
<GradFlow paused />
```

Renders a static frame without the animation loop. GradFlow also pauses itself automatically when the canvas is scrolled offscreen, the tab is hidden, or the user has `prefers-reduced-motion` enabled.

## API Reference

### GradFlow Component

| Prop        | Type                  | Default          | Description                             |
| ----------- | --------------------- | ---------------- | --------------------------------------- |
| `config`    | `GradientConfigInput` | `DEFAULT_CONFIG` | Gradient configuration object           |
| `preset`    | `string`              | —                | Built-in preset name (e.g. `'cosmic'`)  |
| `paused`    | `boolean`             | `false`          | Freeze the animation on a static frame  |
| `className` | `string`              | `''`             | Additional CSS classes                  |

### GradientConfigInput

All properties are optional. You can use either hex strings or RGB objects for colors.

```typescript
type GradientConfigInput = {
  color1?: string | RGB // First gradient color
  color2?: string | RGB // Second gradient color
  color3?: string | RGB // Third gradient color
  speed?: number // Animation speed (0-2)
  scale?: number // Pattern scale (0.5-3)
  type?: GradientType // Gradient pattern type
  noise?: number // Noise intensity (0-0.5)
}

type RGB = {
  r: number // 0-255
  g: number // 0-255
  b: number // 0-255
}
```

### Gradient Types

- `linear` - Classic linear gradient with wave distortion
- `animated` - Dynamic flowing patterns with rotation
- `conic` - Circular/radial gradient patterns
- `wave` - Wave-based undulating patterns
- `silk` - Smooth silk-like flowing textures
- `smoke` - Organic smoke-like patterns
- `stripe` - Warped stripe patterns
- `mesh` - Soft drifting color blobs (mesh gradient)
- `aurora` - Northern-lights curtains (default)

## Utility Functions

### Color Conversion

```tsx
import { hexToRgb, rgbToHex, normalizeColor } from 'gradflow'

// Convert hex to RGB
const rgb = hexToRgb('#ff0000') // { r: 255, g: 0, b: 0 }

// Convert RGB to hex
const hex = rgbToHex({ r: 255, g: 0, b: 0 }) // '#ff0000'

// Normalize color (accepts both string and RGB)
const normalized = normalizeColor('#ff0000') // { r: 255, g: 0, b: 0 }
```

### Random Colors

```tsx
import { randomRGB, generateRandomColors } from 'gradflow'

// Generate single random RGB color
const color = randomRGB()

// Generate random gradient colors
const colors = generateRandomColors()
// Returns: { color1: RGB, color2: RGB, color3: RGB }
```

## Performance Tips

- Use `scale` values between 0.5-2.0 for optimal performance
- Lower `noise` values (< 0.2) perform better
- Consider using `will-change: transform` CSS for smooth animations
- The component automatically limits device pixel ratio to 2 for performance

## Requirements

- React >= 18.0.0
- react-dom >= 18.0.0
- Modern browser with WebGL support

## Browser Support

GradFlow works in all modern browsers that support WebGL:

- Chrome 56+
- Firefox 51+
- Safari 15+
- Edge 79+

## License

MIT License - feel free to use in your projects!

## Credits

Created by [Meer](https://www.meera.dev/)

---

**Note**: This component requires WebGL support. It gracefully handles unsupported environments but won't render gradients in very old browsers.
