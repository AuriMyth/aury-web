import fs from 'fs-extra'
import path from 'pathe'
import fg from 'fast-glob'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 获取模板目录路径
 */
export function getTemplateDir(): string {
  // tsup 打包后所有代码都在 dist/index.js
  // 所以从 dist/ 到 templates/ 是 ../packages/cli/templates
  return path.resolve(__dirname, '../packages/cli/templates')
}

/**
 * 检查路径是否存在
 */
async function pathExists(p: string): Promise<boolean> {
  try {
    await fs.access(p)
    return true
  } catch {
    return false
  }
}

/**
 * 确保目录存在
 */
async function ensureDir(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (error: any) {
    if (error.code !== 'EEXIST') throw error
  }
}

/**
 * 复制模板文件到目标目录
 */
export async function copyTemplate(
  templateName: string,
  targetDir: string,
  replacements: Record<string, string> = {}
): Promise<void> {
  const templateDir = path.join(getTemplateDir(), 'base')
  const themeDir = path.join(getTemplateDir(), 'themes', templateName)

  // 复制基础模板
  await copyDirectory(templateDir, targetDir, replacements)

  // 如果主题目录存在，复制主题文件（覆盖基础模板）
  if (await pathExists(themeDir)) {
    await copyDirectory(themeDir, targetDir, replacements)
  }
}

/**
 * 递归复制目录
 */
async function copyDirectory(
  sourceDir: string,
  targetDir: string,
  replacements: Record<string, string>
): Promise<void> {
  if (!(await pathExists(sourceDir))) {
    return
  }

  const files = await fg('**/*', {
    cwd: sourceDir,
    dot: true,
    ignore: ['node_modules', '.git'],
  })

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file)
    const targetPath = path.join(targetDir, file)

    const stat = await fs.stat(sourcePath)
    if (stat.isDirectory()) {
      await ensureDir(targetPath)
    } else {
      await ensureDir(path.dirname(targetPath))
      
      // 读取文件内容
      let content = await fs.readFile(sourcePath, 'utf-8')
      
      // 替换占位符
      for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
        content = content.replace(regex, value)
      }
      
      await fs.writeFile(targetPath, content, 'utf-8')
    }
  }
}
