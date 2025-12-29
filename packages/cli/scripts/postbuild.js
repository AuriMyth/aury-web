import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const distPath = resolve('dist/index.js')
const content = readFileSync(distPath, 'utf-8')

// Only add shebang if it doesn't exist
if (!content.startsWith('#!/usr/bin/env node')) {
  const withShebang = `#!/usr/bin/env node\n${content}`
  writeFileSync(distPath, withShebang)
  console.log('✅ Added shebang to dist/index.js')
} else {
  console.log('✅ Shebang already exists in dist/index.js')
}
