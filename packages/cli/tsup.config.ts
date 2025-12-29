import { defineConfig } from 'tsup'

// shadcn同款配置：ESM + external node_modules
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  // 移除shims，因为与external冲突
  // 所有node_modules依赖在运行时加载，避免CJS/ESM兼容问题
  external: [/node_modules/],
})
