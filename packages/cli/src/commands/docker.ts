import fs from 'fs-extra'
import path from 'pathe'
import pc from 'picocolors'
import { spinner, outro, log, confirm } from '@clack/prompts'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface DockerOptions {
  nginx?: boolean
  multiStage?: boolean
}

export async function dockerCommand(options: DockerOptions): Promise<void> {
  const s = spinner()
  const cwd = process.cwd()

  // Check if we're in a valid project directory
  const packageJsonPath = path.join(cwd, 'package.json')
  if (!(await fs.pathExists(packageJsonPath))) {
    log.error('No package.json found. Please run this command in a project directory.')
    process.exit(1)
  }

  // Check for existing Docker files
  const dockerfilePath = path.join(cwd, 'Dockerfile')
  const dockerComposePath = path.join(cwd, 'docker-compose.yml')
  const nginxPath = path.join(cwd, 'nginx.conf')
  const dockerignorePath = path.join(cwd, '.dockerignore')

  const existingFiles: string[] = []
  if (await fs.pathExists(dockerfilePath)) existingFiles.push('Dockerfile')
  if (await fs.pathExists(dockerComposePath)) existingFiles.push('docker-compose.yml')
  if (await fs.pathExists(nginxPath)) existingFiles.push('nginx.conf')
  if (await fs.pathExists(dockerignorePath)) existingFiles.push('.dockerignore')

  if (existingFiles.length > 0) {
    const shouldOverwrite = await confirm({
      message: `Found existing files: ${existingFiles.join(', ')}. Overwrite?`,
      initialValue: false,
    })

    if (typeof shouldOverwrite === 'symbol' || !shouldOverwrite) {
      outro(pc.yellow('Cancelled'))
      return
    }
  }

  s.start('Generating Docker configuration...')

  try {
    // Get template directory - from dist/index.js to packages/cli/templates/docker
    const templateDir = path.resolve(__dirname, '../packages/cli/templates/docker')

    // Copy Dockerfile
    await fs.copyFile(path.join(templateDir, 'Dockerfile'), dockerfilePath)

    // Copy docker-compose.yml
    await fs.copyFile(path.join(templateDir, 'docker-compose.yml'), dockerComposePath)

    // Copy nginx.conf (always included since we use nginx in Dockerfile)
    await fs.copyFile(path.join(templateDir, 'nginx.conf'), nginxPath)

    // Copy .dockerignore
    await fs.copyFile(path.join(templateDir, '.dockerignore'), dockerignorePath)

    s.stop('Docker configuration generated!')

    log.info('Generated files:')
    log.message(`  ${pc.cyan('Dockerfile')} - Multi-stage build with pnpm`)
    log.message(`  ${pc.cyan('docker-compose.yml')} - Container orchestration`)
    log.message(`  ${pc.cyan('nginx.conf')} - SPA-ready Nginx config`)
    log.message(`  ${pc.cyan('.dockerignore')} - Build optimization`)

    log.info('')
    log.info('Usage:')
    log.message(`  ${pc.cyan('docker compose up --build')} - Build and run`)
    log.message(`  ${pc.cyan('docker compose up -d')} - Run in background`)

    outro(pc.green('✨ Done!'))
  } catch (error) {
    s.stop('Failed to generate Docker configuration')
    if (error instanceof Error) {
      log.error(error.message)
    }
    process.exit(1)
  }
}
