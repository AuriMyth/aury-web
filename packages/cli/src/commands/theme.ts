import pc from 'picocolors'
import { log, select, outro } from '@clack/prompts'

const AVAILABLE_THEMES = [
  { value: 'minimal', label: 'Minimalist Modern', hint: 'Clean design, Electric Blue gradient accent' },
  { value: 'cyberpunk', label: 'Cyberpunk / Glitch', hint: 'Neon colors, scanlines, glitch effects' },
  // Future themes
  // { value: 'corporate', label: 'Corporate', hint: 'Professional business style' },
]

export async function themeCommand(action: string, themeName?: string): Promise<void> {
  switch (action) {
    case 'list':
      listThemes()
      break

    case 'current':
      showCurrentTheme()
      break

    case 'change':
      await changeTheme()
      break

    case 'switch':
      if (themeName) {
        await switchTheme(themeName)
      } else {
        log.error('Please specify a theme name: aury-web theme switch <theme>')
        listThemes()
      }
      break

    default:
      log.error(`Unknown action: ${action}`)
      log.info('Available actions: list, current, change, switch')
  }
}

function listThemes(): void {
  log.info('Available themes:')
  for (const theme of AVAILABLE_THEMES) {
    log.message(`  ${pc.cyan(theme.value)} - ${theme.label}`)
    log.message(`    ${pc.dim(theme.hint)}`)
  }
}

function showCurrentTheme(): void {
  // TODO: Read from project config or index.css
  log.info(`Current theme: ${pc.cyan('cyberpunk')}`)
  log.message(pc.dim('Theme detection reads from src/index.css'))
}

async function changeTheme(): Promise<void> {
  const result = await select({
    message: 'Select a theme',
    options: AVAILABLE_THEMES,
  })

  if (typeof result === 'symbol') {
    outro(pc.yellow('Cancelled'))
    return
  }

  await switchTheme(result)
}

async function switchTheme(themeName: string): Promise<void> {
  const theme = AVAILABLE_THEMES.find(t => t.value === themeName)
  
  if (!theme) {
    log.error(`Unknown theme: ${themeName}`)
    listThemes()
    return
  }

  // TODO: Actually switch theme by:
  // 1. Copy theme CSS to src/index.css
  // 2. Update any theme-specific components
  
  log.warn('Theme switching is not yet implemented')
  log.info(`To switch to ${pc.cyan(themeName)}, manually copy the theme CSS from:`)
  log.message(`  templates/themes/${themeName}/src/index.css`)
  log.message(`to your project's src/index.css`)

  outro(pc.green('✨ Done!'))
}
