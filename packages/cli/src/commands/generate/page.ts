import fs from 'fs-extra'
import path from 'pathe'
import pc from 'picocolors'
import { spinner, outro, log } from '@clack/prompts'
import { toPascalCase, toKebabCase } from '../../utils/naming.js'

interface GenerateOptions {
  interactive?: boolean
}

export async function generatePage(name: string, options: GenerateOptions): Promise<void> {
  const s = spinner()
  const cwd = process.cwd()
  
  const pageName = toPascalCase(name)
  const routeName = toKebabCase(name)
  const routesDir = path.join(cwd, 'src', 'routes')
  const pagePath = path.join(routesDir, `${routeName}.tsx`)

  // Check if page already exists
  if (await fs.pathExists(pagePath)) {
    log.error(`Page "${routeName}" already exists`)
    return
  }

  s.start(`Generating page: ${pageName}...`)

  try {
    await fs.ensureDir(routesDir)

    const content = `import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/${routeName}')({
  component: ${pageName}Page,
})

function ${pageName}Page() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">${pageName}</h1>
      <p className="text-muted-foreground">
        This is the ${pageName} page.
      </p>
    </div>
  )
}
`

    await fs.writeFile(pagePath, content)

    s.stop(`Page "${pageName}" generated!`)
    log.info(`Created: src/routes/${routeName}.tsx`)
    log.message(pc.dim(`Route: /${routeName}`))

    outro(pc.green('✨ Done!'))
  } catch (error) {
    s.stop('Failed to generate page')
    if (error instanceof Error) {
      log.error(error.message)
    }
  }
}
