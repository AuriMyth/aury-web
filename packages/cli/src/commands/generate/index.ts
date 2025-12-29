import pc from 'picocolors'
import { log } from '@clack/prompts'
import { generateFeature } from './feature.js'
import { generateComponent } from './component.js'
import { generatePage } from './page.js'
import { generateApi } from './api.js'
import { generateStore } from './store.js'
import { generateHook } from './hook.js'

interface GenerateOptions {
  interactive?: boolean
  baseUrl?: string
}

export async function generateCommand(
  type: string, 
  name: string, 
  options: GenerateOptions
): Promise<void> {
  switch (type) {
    case 'feature':
    case 'f':
      await generateFeature(name, options)
      break

    case 'component':
    case 'c':
      await generateComponent(name, options)
      break

    case 'page':
    case 'p':
      await generatePage(name, options)
      break

    case 'api':
    case 'a':
      await generateApi(name, options)
      break

    case 'store':
    case 's':
      await generateStore(name, options)
      break

    case 'hook':
    case 'h':
      await generateHook(name, options)
      break

    default:
      log.error(`Unknown generator type: ${type}`)
      log.info('Available types:')
      log.message(`  ${pc.cyan('feature')} (f)   - Feature module with components, hooks, types`)
      log.message(`  ${pc.cyan('component')} (c) - React component`)
      log.message(`  ${pc.cyan('page')} (p)      - Route page component`)
      log.message(`  ${pc.cyan('api')} (a)       - API client module`)
      log.message(`  ${pc.cyan('store')} (s)     - Zustand store`)
      log.message(`  ${pc.cyan('hook')} (h)      - Custom React hook`)
  }
}
