import { defineConfig } from 'tsup'
import path from 'path'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: {
    compilerOptions: {
      incremental: false,
      // tsup resolves the "@/" alias by injecting baseUrl, which TypeScript 6
      // reports as deprecated and fails the declaration build on
      ignoreDeprecations: '6.0',
    },
  },
  splitting: false,
  sourcemap: false,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
  minify: true,
  esbuildOptions(options) {
    options.alias = {
      '@': path.resolve(__dirname, './src'),
    }
  },
})
