# GradFlow

Beautiful animated WebGL gradients for React. Create stunning, performant gradient backgrounds with multiple animation styles.

## Features

- 🎨 **20 Gradient Types**: from Aurora, Mesh and Silk to Lava, Prism, Caustics, Glass and Nebula
- 🌊 **Blended Transitions**: changing type, colors or speed morphs the canvas instead of cutting
- 🖱️ **Pointer Interaction**: an optional lens that swells the pattern under the cursor
- 📦 **Zero Dependencies**: raw WebGL, about 11 kB gzipped
- ♿ **Motion-Aware**: Respects `prefers-reduced-motion` and supports a `paused` prop
- 🔋 **Battery Friendly**: Automatically stops rendering when offscreen or in a hidden tab
- 🚀 **High Performance**: WebGL-powered rendering with optimized shaders
- 🎛️ **Fully Customizable**: Control colors, animation speed, scale, and noise
- 📱 **Responsive**: Automatically adapts to container size
- 🔧 **TypeScript Support**: Fully typed API
- 🎭 **Easy Integration**: Simple npm install and import

## Demo

Visit [gradflow.meerbahadin.dev](https://gradflow.meerbahadin.dev) to see GradFlow in action and experiment with different configurations.

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

Available presets: `cosmic`, `matrix`, `electric`, `inferno`, `mystic`, `cyber`, `neon`, `plasma`, `dream`, `borealis`, `magma`, `lagoon`, `andromeda`, `cathedral`, `atlas`, `reeded`, `maelstrom`, `newsprint`, `spectrum`, `coral`, `sahara`, `mono`

Presets can be combined with `config` — config values override the preset:

```tsx
<GradFlow preset='borealis' config={{ speed: 0.2 }} />
```

### Pausing the Animation

```tsx
<GradFlow paused />
```

Renders a static frame without the animation loop. GradFlow also pauses itself automatically when the canvas is scrolled offscreen, the tab is hidden, or the user has `prefers-reduced-motion` enabled.

### Transitions

When `preset` or `config` changes, the canvas blends to the new look. Colors, speed, scale and noise interpolate, and a change of type dissolves one pattern into the other. `transition` sets the duration in milliseconds; `0` switches instantly.

```tsx
<GradFlow preset={preset} transition={1200} />
```

### Pointer Interaction

```tsx
<GradFlow preset='atlas' interactive />
```

The pattern is magnified under the pointer. The pointer is tracked on the window, so it works when the canvas sits behind other content.

### Exporting a Still

The ref is forwarded to the canvas. Set `preserveDrawingBuffer` on any gradient you want to read back.

```tsx
const canvas = useRef<HTMLCanvasElement>(null)

<GradFlow ref={canvas} preset='spectrum' preserveDrawingBuffer />

canvas.current?.toBlob((blob) => {
  /* save it */
})
```

## API Reference

### GradFlow Component

| Prop                    | Type                     | Default          | Description                                                  |
| ----------------------- | ------------------------ | ---------------- | ------------------------------------------------------------ |
| `config`                | `GradientConfigInput`    | `DEFAULT_CONFIG` | Gradient configuration object                                |
| `preset`                | `PresetName`             | —                | Built-in preset name (e.g. `'cosmic'`)                       |
| `transition`            | `number`                 | `700`            | Milliseconds a config change takes to blend in; `0` disables |
| `interactive`           | `boolean`                | `false`          | Swell the pattern under the pointer                          |
| `paused`                | `boolean`                | `false`          | Freeze the animation on a static frame                       |
| `preserveDrawingBuffer` | `boolean`                | `false`          | Keep the canvas readable for `toBlob` / `toDataURL`          |
| `className`             | `string`                 | `''`             | Additional CSS classes                                       |
| `ref`                   | `Ref<HTMLCanvasElement>` | —                | Forwarded to the canvas element                              |

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
- `lava` - Metaballs that merge and split
- `caustics` - Light through moving water
- `nebula` - Warped dust clouds over a star field
- `rays` - Shafts of light from above
- `topo` - An animated contour map
- `glass` - A soft field behind fluted glass
- `vortex` - A three-armed logarithmic spiral
- `halftone` - A rotated dot screen
- `prism` - Bands of light split into three colors
- `cells` - Voronoi cells with drifting sites
- `dunes` - Layered, drifting ridgelines

`GRADIENT_TYPES` exports the full list as an array.

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

- Each `GradFlow` owns a WebGL context, and browsers allow roughly 16 per page. Keep the number mounted at once in single digits.
- The render loop stops while the canvas is offscreen or the tab is hidden.
- The component limits device pixel ratio to 2.
- If the browser drops the WebGL context, GradFlow rebuilds its program when the context is restored.

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

Created by [Meer](https://www.meerbahadin.dev/)

---

**Note**: This component requires WebGL support. It gracefully handles unsupported environments but won't render gradients in very old browsers.
