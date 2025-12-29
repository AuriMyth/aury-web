#!/usr/bin/env node

import { Command } from 'commander'
import { execaCommand } from 'execa'
import pc from 'picocolors'
import { initCommand } from './commands/init.js'
import { addCommand } from './commands/add.js'
import { generateCommand } from './commands/generate/index.js'
import { themeCommand } from './commands/theme.js'
import { dockerCommand } from './commands/docker.js'
import { docsCommand } from './commands/docs.js'

const program = new Command()

program
  .name('aury-web')
  .description('🚀 Aury Web CLI - Modern React scaffolding tool')
  .version('0.1.0')

program
  .command('init')
  .description('🎯 Initialize a new project')
  .argument('[project-name]', 'Project name')
  .option('--template <name>', 'Theme template (cyberpunk)')
  .option('--pm <manager>', 'Package manager (npm/pnpm/yarn/bun)')
  .option('--components <preset>', 'Shadcn UI preset: minimal (15) | standard (25, default) | full (50+)')
  .option('--skip-components', 'Skip Shadcn UI component installation')
  .option('--skip-git', 'Skip Git initialization')
  .option('--skip-install', 'Skip dependency installation')
  .action(async (projectName, options) => {
    await initCommand(projectName, options)
  })

program
  .command('add')
  .description('➕ Add Shadcn UI components')
  .argument('<components...>', 'Component names (e.g., button dialog table)')
  .action(async (components) => {
    await addCommand(components)
  })

program
  .command('generate')
  .alias('g')
  .description('⚡ Code generator')
  .argument('<type>', 'Type: feature(f)|component(c)|page(p)|api(a)|store(s)|hook(h)')
  .argument('<name>', 'Name')
  .option('-i, --interactive', 'Interactive mode')
  .option('--base-url <url>', 'API base URL (for api generator)')
  .action(async (type, name, options) => {
    await generateCommand(type, name, options)
  })

program
  .command('theme')
  .description('🎨 Theme management')
  .argument('<action>', 'Action: list|current|change|switch')
  .argument('[theme]', 'Theme name (for switch)')
  .action(async (action, theme) => {
    await themeCommand(action, theme)
  })

program
  .command('docker')
  .description('🐳 Generate Docker configuration')
  .option('--nginx', 'Include Nginx config')
  .option('--multi-stage', 'Multi-stage build')
  .action(async (options) => {
    await dockerCommand(options)
  })

program
  .command('docs')
  .description('📚 Generate/update documentation')
  .argument('<action>', 'Action: generate|update')
  .action(async (action) => {
    await docsCommand(action)
  })

program
  .command('dev')
  .description('🔥 Start development server')
  .action(async () => {
    try {
      await execaCommand('pnpm dev', { stdio: 'inherit' })
    } catch {
      console.log(pc.yellow('Try: npm run dev / yarn dev / bun dev'))
    }
  })

program
  .command('build')
  .description('📦 Build for production')
  .action(async () => {
    try {
      await execaCommand('pnpm build', { stdio: 'inherit' })
    } catch {
      console.log(pc.yellow('Try: npm run build / yarn build / bun build'))
    }
  })

program
  .command('preview')
  .description('👀 Preview production build')
  .action(async () => {
    try {
      await execaCommand('pnpm preview', { stdio: 'inherit' })
    } catch {
      console.log(pc.yellow('Try: npm run preview / yarn preview / bun preview'))
    }
  })

program.parse()
