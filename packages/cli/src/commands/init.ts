import { intro, outro, text, select, confirm, spinner } from '@clack/prompts'
import { execaCommand } from 'execa'
import fs from 'fs-extra'
import path from 'pathe'
import pc from 'picocolors'
import type { InitOptions } from '../types/index.js'
import {
  detectPackageManager,
  getInstallCommand,
  getRunCommand,
  type PackageManager,
} from '../utils/package-manager.js'
import { copyTemplate } from '../utils/template.js'
import {
  installShadcnComponents,
  type ShadcnPreset,
  SHADCN_PRESETS,
} from '../utils/shadcn.js'

export async function initCommand(
  projectName: string | undefined,
  options: InitOptions
) {
  intro(pc.cyan('🚀 Create Aury Web'))

  // 1. 获取项目名称
  let targetDir = projectName
  if (!targetDir) {
    const result = await text({
      message: 'Project name:',
      placeholder: 'my-aury-app',
      validate: (value) => {
        if (!value) return 'Project name is required'
        // 允许 . 表示当前目录
        if (value === '.') return
        if (!/^[a-z0-9-.]+$/.test(value))
          return 'Project name can only contain lowercase letters, numbers, hyphens, and dots'
        return
      },
    })
    if (typeof result === 'symbol') {
      outro(pc.red('✖ Cancelled'))
      process.exit(0)
    }
    targetDir = result as string
  }

  // 支持 . 表示当前目录
  const projectPath = targetDir === '.' 
    ? process.cwd() 
    : path.resolve(process.cwd(), targetDir)
  
  // 用于package.json的项目名称
  const projectNameForPackage = targetDir === '.' 
    ? path.basename(process.cwd()) 
    : targetDir

  // 2. 检查目录是否存在
  if (await fs.pathExists(projectPath)) {
    const files = await fs.readdir(projectPath)
    if (files.length > 0) {
      const shouldContinue = await confirm({
        message: `Directory ${pc.cyan(targetDir)} is not empty. Continue?`,
      })
      if (!shouldContinue || typeof shouldContinue === 'symbol') {
        outro(pc.red('✖ Cancelled'))
        process.exit(0)
      }
    }
  }

  // 3. 选择主题
  let template = options.template
  if (!template) {
    const result = await select({
      message: 'Select a theme:',
      options: [
        {
          value: 'minimal',
          label: 'Minimalist Modern',
          hint: 'Clean design with Electric Blue gradient accent',
        },
        {
          value: 'cyberpunk',
          label: 'Cyberpunk / Glitch',
          hint: 'Neon-drenched digital dystopia',
        },
      ],
    })
    if (typeof result === 'symbol') {
      outro(pc.red('✖ Cancelled'))
      process.exit(0)
    }
    template = result as string
  }

  // 4. 选择包管理器
  let pm = options.pm
  if (!pm) {
    const available = await detectPackageManager()
    if (available.length === 0) {
      outro(pc.red('✖ No package manager found. Please install npm, pnpm, yarn, or bun.'))
      process.exit(1)
    }

    const result = await select({
      message: 'Select package manager:',
      options: available.map((name) => ({
        value: name,
        label: name,
        hint: name === 'pnpm' ? 'Recommended' : undefined,
      })),
    })
    if (typeof result === 'symbol') {
      outro(pc.red('✖ Cancelled'))
      process.exit(0)
    }
    pm = result as PackageManager
  }

  // 5. 选择 Shadcn UI 组件预设
  let componentsPreset: ShadcnPreset | null = options.components || null
  const skipComponents = options.skipComponents || false
  
  if (!skipComponents && !componentsPreset) {
    const result = await select({
      message: 'Select Shadcn UI components:',
      options: [
        {
          value: 'standard',
          label: `Standard (${SHADCN_PRESETS.standard.length} components)`,
          hint: 'Recommended - covers most use cases',
        },
        {
          value: 'minimal',
          label: `Minimal (${SHADCN_PRESETS.minimal.length} components)`,
          hint: 'Core essentials only',
        },
        {
          value: 'full',
          label: `Full (${SHADCN_PRESETS.full.length} components)`,
          hint: 'Everything included',
        },
        {
          value: 'skip',
          label: 'Skip',
          hint: 'Add components later with: aury-web add',
        },
      ],
    })
    if (typeof result === 'symbol') {
      outro(pc.red('✖ Cancelled'))
      process.exit(0)
    }
    componentsPreset = result === 'skip' ? null : result as ShadcnPreset
  }

  // 6. 创建项目
  const s = spinner()
  s.start('Creating project...')

  try {
    // 创建项目目录
    await fs.ensureDir(projectPath)

    // 复制模板文件（包含 package.json 和所有其他文件）
    s.message('Copying template files...')
    await copyTemplate(template, projectPath, {
      PROJECT_NAME: projectNameForPackage,
      PROJECT_DESCRIPTION: `A modern React app created with Create Aury Web`,
      TIMESTAMP: new Date().toISOString(),
    })

    // 初始化 Git
    if (!options.skipGit) {
      const gitDir = path.join(projectPath, '.git')
      const gitIgnorePath = path.join(projectPath, '.gitignore')
      
      // 检查是否已经是git仓库
      if (!(await fs.pathExists(gitDir))) {
        s.message('Initializing git repository...')
        try {
          await execaCommand('git init', { cwd: projectPath, stdio: 'ignore' })
        } catch (error) {
          // Git 初始化失败不影响项目创建
        }
      }
      
      // 创建或合并.gitignore
      const gitignoreContent = [
        'node_modules',
        'dist',
        '.env.local',
        '.DS_Store',
        '*.log',
      ].join('\n')
      
      if (await fs.pathExists(gitIgnorePath)) {
        // 如果已存在.gitignore，追加而不是覆盖
        const existing = await fs.readFile(gitIgnorePath, 'utf-8')
        const lines = new Set(existing.split('\n').filter(Boolean))
        gitignoreContent.split('\n').forEach(line => lines.add(line))
        await fs.writeFile(gitIgnorePath, Array.from(lines).join('\n') + '\n')
      } else {
        await fs.writeFile(gitIgnorePath, gitignoreContent + '\n')
      }
    }

    // 安装依赖
    if (!options.skipInstall) {
      s.message(`Installing dependencies with ${pm}...`)
      const installCmd = getInstallCommand(pm)
      await execaCommand(installCmd, { cwd: projectPath, stdio: 'inherit' })
    }

    // 安装 Shadcn UI 组件
    if (!options.skipInstall && !skipComponents && componentsPreset) {
      s.message(`Installing Shadcn UI components (${componentsPreset})...`)
      s.stop() // 暂停 spinner，因为 shadcn CLI 有自己的输出
      
      try {
        await installShadcnComponents(projectPath, pm, componentsPreset)
        s.start()
        s.message('Shadcn UI components installed!')
      } catch (error) {
        console.log(pc.yellow('\n⚠ Shadcn UI installation failed. You can install components later with: npx shadcn@latest add'))
      }
    }

    s.stop('✨ Project created successfully!')
  } catch (error) {
    s.stop('✖ Failed to create project')
    console.error(error)
    process.exit(1)
  }

  // 6. 输出后续步骤
  outro(pc.green('✨ Done!'))
  
  console.log()
  console.log(pc.bold('Next steps:'))
  console.log()
  // 只有非当前目录才显示cd命令
  if (targetDir !== '.') {
    console.log(`  ${pc.cyan('cd')} ${targetDir}`)
  }
  if (options.skipInstall) {
    console.log(`  ${pc.cyan(getInstallCommand(pm))}`)
  }
  console.log(`  ${pc.cyan(getRunCommand(pm, 'dev'))}`)
  console.log()
}
