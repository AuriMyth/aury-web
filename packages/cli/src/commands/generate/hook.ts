import fs from 'fs-extra'
import path from 'pathe'
import pc from 'picocolors'
import { spinner, outro, log } from '@clack/prompts'
import { toPascalCase, toCamelCase } from '../../utils/naming.js'

interface GenerateOptions {
  interactive?: boolean
}

export async function generateHook(name: string, options: GenerateOptions): Promise<void> {
  const s = spinner()
  const cwd = process.cwd()
  
  // Ensure name starts with "use"
  let hookName = toCamelCase(name)
  if (!hookName.startsWith('use')) {
    hookName = `use${toPascalCase(name)}`
  }
  
  const hooksDir = path.join(cwd, 'src', 'hooks')
  const hookPath = path.join(hooksDir, `${hookName}.ts`)

  // Check if hook already exists
  if (await fs.pathExists(hookPath)) {
    log.error(`Hook "${hookName}" already exists`)
    return
  }

  s.start(`Generating hook: ${hookName}...`)

  try {
    await fs.ensureDir(hooksDir)

    const content = `import { useState, useCallback } from 'react'

interface ${toPascalCase(hookName.replace('use', ''))}Options {
  // Add options here
}

interface ${toPascalCase(hookName.replace('use', ''))}Return {
  // Add return values here
  value: unknown
  setValue: (value: unknown) => void
  reset: () => void
}

export function ${hookName}(options: ${toPascalCase(hookName.replace('use', ''))}Options = {}): ${toPascalCase(hookName.replace('use', ''))}Return {
  const [value, setValue] = useState<unknown>(null)

  const reset = useCallback(() => {
    setValue(null)
  }, [])

  return {
    value,
    setValue,
    reset,
  }
}
`

    await fs.writeFile(hookPath, content)

    // Update index.ts
    const indexPath = path.join(hooksDir, 'index.ts')
    let indexContent = ''
    
    if (await fs.pathExists(indexPath)) {
      indexContent = await fs.readFile(indexPath, 'utf-8')
    }
    
    const exportLine = `export * from './${hookName}'\n`
    if (!indexContent.includes(exportLine)) {
      indexContent += exportLine
      await fs.writeFile(indexPath, indexContent)
    }

    s.stop(`Hook "${hookName}" generated!`)
    log.info(`Created: src/hooks/${hookName}.ts`)

    outro(pc.green('✨ Done!'))
  } catch (error) {
    s.stop('Failed to generate hook')
    if (error instanceof Error) {
      log.error(error.message)
    }
  }
}
