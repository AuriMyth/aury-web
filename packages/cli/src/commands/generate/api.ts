import fs from 'fs-extra'
import path from 'pathe'
import pc from 'picocolors'
import { spinner, outro, log, text } from '@clack/prompts'
import { toPascalCase, toCamelCase, toKebabCase } from '../../utils/naming.js'

interface GenerateOptions {
  interactive?: boolean
  baseUrl?: string
}

export async function generateApi(name: string, options: GenerateOptions): Promise<void> {
  const s = spinner()
  const cwd = process.cwd()
  
  const apiName = toKebabCase(name)
  const pascalName = toPascalCase(name)
  const camelName = toCamelCase(name)
  
  let baseUrl = options.baseUrl || `/api/v1/${camelName}s`

  if (options.interactive && !options.baseUrl) {
    const result = await text({
      message: 'API base URL',
      initialValue: baseUrl,
    })

    if (typeof result === 'symbol') {
      outro(pc.yellow('Cancelled'))
      return
    }

    baseUrl = result
  }

  const featuresDir = path.join(cwd, 'src', 'features', apiName)
  const apiDir = path.join(featuresDir, 'api')

  s.start(`Generating API: ${apiName}...`)

  try {
    await fs.ensureDir(apiDir)

    // Generate types
    const typesDir = path.join(featuresDir, 'types')
    await fs.ensureDir(typesDir)

    const typesContent = `export interface ${pascalName} {
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
`
    await fs.writeFile(path.join(typesDir, 'index.ts'), typesContent)

    // Generate API
    const apiContent = `import type { ${pascalName}, Create${pascalName}Dto, Update${pascalName}Dto } from '../types'

const API_BASE = '${baseUrl}'

export const ${camelName}Api = {
  base: API_BASE,
  list: () => API_BASE,
  detail: (id: string) => \`\${API_BASE}/\${id}\`,
  create: () => API_BASE,
  update: (id: string) => \`\${API_BASE}/\${id}\`,
  delete: (id: string) => \`\${API_BASE}/\${id}\`,
}
`
    await fs.writeFile(path.join(apiDir, `${apiName}.ts`), apiContent)
    await fs.writeFile(path.join(apiDir, 'index.ts'), `export * from './${apiName}'\n`)

    // Generate hooks
    const hooksDir = path.join(featuresDir, 'hooks')
    await fs.ensureDir(hooksDir)

    const hooksContent = `import { useAuryApi, useAuryMutation } from '@aury/web-core/hooks'
import type { ${pascalName}, Create${pascalName}Dto, Update${pascalName}Dto } from '../types'

const API_BASE = '${baseUrl}'

export function use${pascalName}s() {
  return useAuryApi<${pascalName}[]>(API_BASE)
}

export function use${pascalName}(id: string) {
  return useAuryApi<${pascalName}>(\`\${API_BASE}/\${id}\`, { enabled: !!id })
}

export function useCreate${pascalName}() {
  return useAuryMutation<${pascalName}, Create${pascalName}Dto>(API_BASE, { method: 'post' })
}

export function useUpdate${pascalName}(id: string) {
  return useAuryMutation<${pascalName}, Update${pascalName}Dto>(\`\${API_BASE}/\${id}\`, { method: 'patch' })
}

export function useDelete${pascalName}(id: string) {
  return useAuryMutation<void, void>(\`\${API_BASE}/\${id}\`, { method: 'delete' })
}
`
    await fs.writeFile(path.join(hooksDir, `use${pascalName}.ts`), hooksContent)
    await fs.writeFile(path.join(hooksDir, 'index.ts'), `export * from './use${pascalName}'\n`)

    // Generate feature index
    const indexContent = `export * from './api'
export * from './hooks'
export * from './types'
`
    await fs.writeFile(path.join(featuresDir, 'index.ts'), indexContent)

    s.stop(`API "${apiName}" generated!`)
    log.info(`Created: src/features/${apiName}/`)
    log.message(pc.dim(`Base URL: ${baseUrl}`))

    outro(pc.green('✨ Done!'))
  } catch (error) {
    s.stop('Failed to generate API')
    if (error instanceof Error) {
      log.error(error.message)
    }
  }
}
