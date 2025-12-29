import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'api/index': 'src/api/index.ts',
    'types/index': 'src/types/index.ts',
    'hooks/index': 'src/hooks/index.ts',
    'providers/index': 'src/providers/index.ts',
  },
  format: ['esm'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  treeshake: true,
})
