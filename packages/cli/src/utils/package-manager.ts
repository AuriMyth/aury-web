import { execaCommand } from 'execa'
import fs from 'fs-extra'
import path from 'pathe'

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'

/**
 * 检测可用的包管理器
 */
export async function detectPackageManager(): Promise<PackageManager[]> {
  const managers: PackageManager[] = []
  const checks = [
    { name: 'pnpm' as PackageManager, command: 'pnpm --version' },
    { name: 'bun' as PackageManager, command: 'bun --version' },
    { name: 'yarn' as PackageManager, command: 'yarn --version' },
    { name: 'npm' as PackageManager, command: 'npm --version' },
  ]

  for (const { name, command } of checks) {
    try {
      await execaCommand(command, { stdio: 'ignore' })
      managers.push(name)
    } catch {
      // 忽略错误，该包管理器不可用
    }
  }

  return managers
}

/**
 * 获取推荐的包管理器
 */
export async function getRecommendedPackageManager(
  cwd: string
): Promise<PackageManager> {
  // 检查项目中的锁文件
  if (await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'))) {
    return 'pnpm'
  }
  if (await fs.pathExists(path.join(cwd, 'bun.lockb'))) {
    return 'bun'
  }
  if (await fs.pathExists(path.join(cwd, 'yarn.lock'))) {
    return 'yarn'
  }
  if (await fs.pathExists(path.join(cwd, 'package-lock.json'))) {
    return 'npm'
  }

  // 默认推荐 pnpm
  const available = await detectPackageManager()
  return available.includes('pnpm') ? 'pnpm' : available[0] || 'npm'
}

/**
 * 获取安装命令
 */
export function getInstallCommand(pm: PackageManager): string {
  const commands = {
    npm: 'npm install',
    pnpm: 'pnpm install',
    yarn: 'yarn',
    bun: 'bun install',
  }
  return commands[pm]
}

/**
 * 获取运行脚本命令
 */
export function getRunCommand(pm: PackageManager, script: string): string {
  const commands = {
    npm: `npm run ${script}`,
    pnpm: `pnpm ${script}`,
    yarn: `yarn ${script}`,
    bun: `bun run ${script}`,
  }
  return commands[pm]
}
