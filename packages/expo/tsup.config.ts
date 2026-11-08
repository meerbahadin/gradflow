import { defineConfig } from 'tsup'
import path from 'path'

// The shaders, presets, color helpers and the animation clock live in the web
// package's src/ and are bundled in from there, so both packages always ship
// the same 21 shaders.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: false,
  clean: true,
  external: ['react', 'react-native', 'expo-gl'],
  treeshake: true,
  minify: true,
  esbuildOptions(options) {
    options.alias = {
      '@': path.resolve(__dirname, '../../src'),
    }
  },
})
