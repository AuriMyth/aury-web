import fs from 'fs-extra'
import path from 'pathe'
import pc from 'picocolors'
import { spinner, outro, log } from '@clack/prompts'
import { toPascalCase } from '../../utils/naming.js'

interface GenerateOptions {
  interactive?: boolean
}

export async function generateComponent(name: string, options: GenerateOptions): Promise<void> {
  const s = spinner()
  const cwd = process.cwd()
  
  const componentName = toPascalCase(name)
  const componentDir = path.join(cwd, 'src', 'components', 'common')
  const componentPath = path.join(componentDir, `${componentName}.tsx`)

  // Check if component already exists
  if (await fs.pathExists(componentPath)) {
    log.error(`Component "${componentName}" already exists`)
    return
  }

  s.start(`Generating component: ${componentName}...`)

  try {
    await fs.ensureDir(componentDir)

    const content = `import { cn } from '@/lib/utils'

interface ${componentName}Props {
  className?: string
  children?: React.ReactNode
}

export function ${componentName}({ className, children }: ${componentName}Props) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  )
}
`

    await fs.writeFile(componentPath, content)

    // Update index.ts
    const indexPath = path.join(componentDir, 'index.ts')
    let indexContent = ''
    
    if (await fs.pathExists(indexPath)) {
      indexContent = await fs.readFile(indexPath, 'utf-8')
    }
    
    const exportLine = `export * from './${componentName}'\n`
    if (!indexContent.includes(exportLine)) {
      indexContent += exportLine
      await fs.writeFile(indexPath, indexContent)
    }

    s.stop(`Component "${componentName}" generated!`)
    log.info(`Created: src/components/common/${componentName}.tsx`)

    outro(pc.green('✨ Done!'))
  } catch (error) {
    s.stop('Failed to generate component')
    if (error instanceof Error) {
      log.error(error.message)
    }
  }
}
