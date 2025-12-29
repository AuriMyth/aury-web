import fs from 'fs-extra'
import path from 'pathe'
import pc from 'picocolors'
import { spinner, outro, log, multiselect } from '@clack/prompts'
import { toPascalCase, toKebabCase, toCamelCase } from '../../utils/naming.js'

interface GenerateOptions {
  interactive?: boolean
}

const FEATURE_PARTS = [
  { value: 'components', label: 'Components', hint: 'Feature-specific components' },
  { value: 'hooks', label: 'Hooks', hint: 'Custom hooks' },
  { value: 'api', label: 'API', hint: 'API client functions' },
  { value: 'store', label: 'Store', hint: 'Zustand store' },
  { value: 'types', label: 'Types', hint: 'TypeScript types' },
]

export async function generateFeature(name: string, options: GenerateOptions): Promise<void> {
  const s = spinner()
  const cwd = process.cwd()
  
  const featureName = toKebabCase(name)
  const pascalName = toPascalCase(name)
  const camelName = toCamelCase(name)
  const featureDir = path.join(cwd, 'src', 'features', featureName)

  // Check if feature already exists
  if (await fs.pathExists(featureDir)) {
    log.error(`Feature "${featureName}" already exists at src/features/${featureName}`)
    return
  }

  let selectedParts = ['components', 'hooks', 'api', 'store', 'types']

  if (options.interactive) {
    const result = await multiselect({
      message: 'Select feature parts to generate',
      options: FEATURE_PARTS,
      initialValues: selectedParts,
    })

    if (typeof result === 'symbol') {
      outro(pc.yellow('Cancelled'))
      return
    }

    selectedParts = result as string[]
  }

  s.start(`Generating feature: ${featureName}...`)

  try {
    // Create feature directory
    await fs.ensureDir(featureDir)

    // Generate selected parts
    if (selectedParts.includes('components')) {
      await generateFeatureComponents(featureDir, pascalName)
    }

    if (selectedParts.includes('hooks')) {
      await generateFeatureHooks(featureDir, pascalName, camelName)
    }

    if (selectedParts.includes('api')) {
      await generateFeatureApi(featureDir, pascalName, camelName, featureName)
    }

    if (selectedParts.includes('store')) {
      await generateFeatureStore(featureDir, pascalName, camelName)
    }

    if (selectedParts.includes('types')) {
      await generateFeatureTypes(featureDir, pascalName)
    }

    // Generate index.ts
    await generateFeatureIndex(featureDir, pascalName, camelName, selectedParts)

    s.stop(`Feature "${featureName}" generated!`)

    log.info('Generated structure:')
    log.message(`  src/features/${featureName}/`)
    if (selectedParts.includes('components')) log.message(`    components/`)
    if (selectedParts.includes('hooks')) log.message(`    hooks/`)
    if (selectedParts.includes('api')) log.message(`    api/`)
    if (selectedParts.includes('store')) log.message(`    store/`)
    if (selectedParts.includes('types')) log.message(`    types/`)
    log.message(`    index.ts`)

    outro(pc.green('✨ Done!'))
  } catch (error) {
    s.stop('Failed to generate feature')
    if (error instanceof Error) {
      log.error(error.message)
    }
  }
}

async function generateFeatureComponents(featureDir: string, pascalName: string): Promise<void> {
  const componentsDir = path.join(featureDir, 'components')
  await fs.ensureDir(componentsDir)

  const content = `import { cn } from '@/lib/utils'

interface ${pascalName}CardProps {
  className?: string
  children?: React.ReactNode
}

export function ${pascalName}Card({ className, children }: ${pascalName}CardProps) {
  return (
    <div className={cn('rounded-lg border p-4', className)}>
      {children}
    </div>
  )
}
`

  await fs.writeFile(path.join(componentsDir, `${pascalName}Card.tsx`), content)
  await fs.writeFile(
    path.join(componentsDir, 'index.ts'),
    `export * from './${pascalName}Card'\n`
  )
}

async function generateFeatureHooks(featureDir: string, pascalName: string, camelName: string): Promise<void> {
  const hooksDir = path.join(featureDir, 'hooks')
  await fs.ensureDir(hooksDir)

  const content = `import { useAuryApi, useAuryMutation } from '@aury/web-core/hooks'
import type { ${pascalName}, Create${pascalName}Dto, Update${pascalName}Dto } from '../types'

const API_BASE = '/api/v1/${camelName}s'

export function use${pascalName}s() {
  return useAuryApi<${pascalName}[]>(API_BASE)
}

export function use${pascalName}(id: string) {
  return useAuryApi<${pascalName}>(\`\${API_BASE}/\${id}\`, { enabled: !!id })
}

export function useCreate${pascalName}() {
  return useAuryMutation<${pascalName}, Create${pascalName}Dto>(API_BASE, {
    method: 'post',
  })
}

export function useUpdate${pascalName}(id: string) {
  return useAuryMutation<${pascalName}, Update${pascalName}Dto>(\`\${API_BASE}/\${id}\`, {
    method: 'patch',
  })
}

export function useDelete${pascalName}(id: string) {
  return useAuryMutation<void, void>(\`\${API_BASE}/\${id}\`, {
    method: 'delete',
  })
}
`

  await fs.writeFile(path.join(hooksDir, `use${pascalName}.ts`), content)
  await fs.writeFile(
    path.join(hooksDir, 'index.ts'),
    `export * from './use${pascalName}'\n`
  )
}

async function generateFeatureApi(
  featureDir: string, 
  pascalName: string, 
  camelName: string,
  featureName: string
): Promise<void> {
  const apiDir = path.join(featureDir, 'api')
  await fs.ensureDir(apiDir)

  const content = `import type { ${pascalName}, Create${pascalName}Dto, Update${pascalName}Dto } from '../types'

const API_BASE = '/api/v1/${camelName}s'

/**
 * ${pascalName} API endpoints
 * 
 * Note: Prefer using hooks (use${pascalName}s, use${pascalName}, etc.) for data fetching.
 * These functions are provided for cases where you need direct API access.
 */
export const ${camelName}Api = {
  base: API_BASE,
  
  list: () => API_BASE,
  detail: (id: string) => \`\${API_BASE}/\${id}\`,
  create: () => API_BASE,
  update: (id: string) => \`\${API_BASE}/\${id}\`,
  delete: (id: string) => \`\${API_BASE}/\${id}\`,
}
`

  await fs.writeFile(path.join(apiDir, `${featureName}.ts`), content)
  await fs.writeFile(
    path.join(apiDir, 'index.ts'),
    `export * from './${featureName}'\n`
  )
}

async function generateFeatureStore(featureDir: string, pascalName: string, camelName: string): Promise<void> {
  const storeDir = path.join(featureDir, 'store')
  await fs.ensureDir(storeDir)

  const content = `import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ${pascalName} } from '../types'

interface ${pascalName}State {
  selected${pascalName}: ${pascalName} | null
  filter: string
  
  // Actions
  setSelected${pascalName}: (item: ${pascalName} | null) => void
  setFilter: (filter: string) => void
  reset: () => void
}

const initialState = {
  selected${pascalName}: null,
  filter: '',
}

export const use${pascalName}Store = create<${pascalName}State>()(
  devtools(
    (set) => ({
      ...initialState,
      
      setSelected${pascalName}: (item) => set({ selected${pascalName}: item }),
      setFilter: (filter) => set({ filter }),
      reset: () => set(initialState),
    }),
    { name: '${camelName}Store' }
  )
)
`

  await fs.writeFile(path.join(storeDir, `${camelName}Store.ts`), content)
  await fs.writeFile(
    path.join(storeDir, 'index.ts'),
    `export * from './${camelName}Store'\n`
  )
}

async function generateFeatureTypes(featureDir: string, pascalName: string): Promise<void> {
  const typesDir = path.join(featureDir, 'types')
  await fs.ensureDir(typesDir)

  const content = `export interface ${pascalName} {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface Create${pascalName}Dto {
  name: string
}

export interface Update${pascalName}Dto {
  name?: string
}

export interface ${pascalName}ListParams {
  page?: number
  pageSize?: number
  search?: string
}
`

  await fs.writeFile(path.join(typesDir, 'index.ts'), content)
}

async function generateFeatureIndex(
  featureDir: string, 
  pascalName: string, 
  camelName: string,
  parts: string[]
): Promise<void> {
  const exports: string[] = []

  if (parts.includes('components')) exports.push(`export * from './components'`)
  if (parts.includes('hooks')) exports.push(`export * from './hooks'`)
  if (parts.includes('api')) exports.push(`export * from './api'`)
  if (parts.includes('store')) exports.push(`export * from './store'`)
  if (parts.includes('types')) exports.push(`export * from './types'`)

  await fs.writeFile(path.join(featureDir, 'index.ts'), exports.join('\n') + '\n')
}
