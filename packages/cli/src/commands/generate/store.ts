import fs from 'fs-extra'
import path from 'pathe'
import pc from 'picocolors'
import { spinner, outro, log } from '@clack/prompts'
import { toPascalCase, toCamelCase } from '../../utils/naming.js'

interface GenerateOptions {
  interactive?: boolean
}

export async function generateStore(name: string, options: GenerateOptions): Promise<void> {
  const s = spinner()
  const cwd = process.cwd()
  
  const pascalName = toPascalCase(name)
  const camelName = toCamelCase(name)
  const storesDir = path.join(cwd, 'src', 'stores')
  const storePath = path.join(storesDir, `${camelName}Store.ts`)

  // Check if store already exists
  if (await fs.pathExists(storePath)) {
    log.error(`Store "${camelName}Store" already exists`)
    return
  }

  s.start(`Generating store: ${camelName}Store...`)

  try {
    await fs.ensureDir(storesDir)

    const content = `import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface ${pascalName}State {
  // State
  items: unknown[]
  isLoading: boolean
  error: string | null
  
  // Actions
  setItems: (items: unknown[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

const initialState = {
  items: [],
  isLoading: false,
  error: null,
}

export const use${pascalName}Store = create<${pascalName}State>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setItems: (items) => set({ items }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),
        reset: () => set(initialState),
      }),
      { name: '${camelName}-storage' }
    ),
    { name: '${camelName}Store' }
  )
)
`

    await fs.writeFile(storePath, content)

    // Update index.ts
    const indexPath = path.join(storesDir, 'index.ts')
    let indexContent = ''
    
    if (await fs.pathExists(indexPath)) {
      indexContent = await fs.readFile(indexPath, 'utf-8')
    }
    
    const exportLine = `export * from './${camelName}Store'\n`
    if (!indexContent.includes(exportLine)) {
      indexContent += exportLine
      await fs.writeFile(indexPath, indexContent)
    }

    s.stop(`Store "${camelName}Store" generated!`)
    log.info(`Created: src/stores/${camelName}Store.ts`)

    outro(pc.green('✨ Done!'))
  } catch (error) {
    s.stop('Failed to generate store')
    if (error instanceof Error) {
      log.error(error.message)
    }
  }
}
