import fs from 'fs-extra'
import path from 'pathe'
import pc from 'picocolors'
import { spinner, outro, log, confirm } from '@clack/prompts'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function docsCommand(action: string): Promise<void> {
  switch (action) {
    case 'generate':
      await generateDocs()
      break

    case 'update':
      await updateDocs()
      break

    default:
      log.error(`Unknown action: ${action}`)
      log.info('Available actions: generate, update')
  }
}

async function generateDocs(): Promise<void> {
  const s = spinner()
  const cwd = process.cwd()

  // Check if we're in a valid project directory
  const packageJsonPath = path.join(cwd, 'package.json')
  if (!(await fs.pathExists(packageJsonPath))) {
    log.error('No package.json found. Please run this command in a project directory.')
    process.exit(1)
  }

  const auryDocsPath = path.join(cwd, 'aury_docs')
  const agentsMdPath = path.join(cwd, 'AGENTS.md')

  // Check for existing docs
  if (await fs.pathExists(auryDocsPath)) {
    const shouldOverwrite = await confirm({
      message: 'aury_docs already exists. Overwrite?',
      initialValue: false,
    })

    if (typeof shouldOverwrite === 'symbol' || !shouldOverwrite) {
      outro(pc.yellow('Cancelled'))
      return
    }
  }

  s.start('Generating documentation...')

  try {
    // Get template directory
    const templateDir = path.resolve(__dirname, '../packages/cli/templates/base')

    // Copy aury_docs
    const templateDocsPath = path.join(templateDir, 'aury_docs')
    if (await fs.pathExists(templateDocsPath)) {
      await fs.copy(templateDocsPath, auryDocsPath, { overwrite: true })
    }

    // Copy AGENTS.md
    const templateAgentsPath = path.join(templateDir, 'AGENTS.md')
    if (await fs.pathExists(templateAgentsPath)) {
      await fs.copyFile(templateAgentsPath, agentsMdPath)
    }

    s.stop('Documentation generated!')

    log.info('Generated:')
    log.message(`  ${pc.cyan('aury_docs/')} - Detailed project documentation`)
    log.message(`  ${pc.cyan('AGENTS.md')} - AI assistant development guide`)

    outro(pc.green('✨ Done!'))
  } catch (error) {
    s.stop('Failed to generate documentation')
    if (error instanceof Error) {
      log.error(error.message)
    }
    process.exit(1)
  }
}

async function updateDocs(): Promise<void> {
  const cwd = process.cwd()
  const auryDocsPath = path.join(cwd, 'aury_docs')

  if (!(await fs.pathExists(auryDocsPath))) {
    log.warn('No aury_docs found. Run `aury-web docs generate` first.')
    return
  }

  // TODO: Implement smart update that:
  // 1. Scans project structure
  // 2. Updates documentation to reflect changes
  // 3. Preserves custom documentation

  log.warn('Documentation update is not yet implemented')
  log.info('Currently you need to manually update the documentation files.')

  outro(pc.green('✨ Done!'))
}
