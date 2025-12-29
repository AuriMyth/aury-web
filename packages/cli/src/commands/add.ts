import { execaCommand } from 'execa'
import pc from 'picocolors'
import { spinner, outro, log } from '@clack/prompts'
import { getRecommendedPackageManager } from '../utils/package-manager.js'

export async function addCommand(components: string[]): Promise<void> {
  const pm = await getRecommendedPackageManager(process.cwd())
  const s = spinner()

  log.info(`Adding components: ${pc.cyan(components.join(', '))}`)
  s.start('Installing components...')

  try {
    // Use shadcn CLI to add components
    const npxCmd = pm === 'bun' ? 'bunx' : 'npx'
    const cmd = `${npxCmd} shadcn@latest add ${components.join(' ')} --yes`
    
    s.stop() // Stop spinner before stdio: inherit
    await execaCommand(cmd, { 
      stdio: 'inherit',
      shell: true 
    })

    outro(pc.green('✨ Done!'))
  } catch (error) {
    if (error instanceof Error) {
      log.error(error.message)
    }
    
    log.info(`You can try manually: ${pc.cyan(`npx shadcn@latest add ${components.join(' ')}`)}`)
    process.exit(1)
  }
}
