import { execaCommand } from 'execa'
import type { PackageManager } from './package-manager.js'

/**
 * Shadcn UI 组件预设
 * 
 * 官方组件列表: https://ui.shadcn.com/docs/components
 */
export const SHADCN_PRESETS = {
  /**
   * Minimal - 15 个核心组件
   * 适合: 轻量级项目、原型开发
   */
  minimal: [
    // 基础 (5)
    'button',           // 按钮
    'input',            // 输入框
    'label',            // 标签
    'card',             // 卡片
    'badge',            // 徽章
    // 表单 (4)
    'form',             // 表单 (react-hook-form 集成)
    'select',           // 下拉选择
    'checkbox',         // 复选框
    'switch',           // 开关
    // 布局 (3)
    'dialog',           // 弹窗
    'tabs',             // 标签页
    'sheet',            // 侧边栏抽屉
    // 反馈 (2)
    'toast',            // 轻提示 (Radix)
    'alert',            // 警告
    // 数据 (1)
    'table',            // 表格
  ],
  
  /**
   * Standard - 25 个常用组件（默认）
   * 适合: 大多数项目，覆盖 80% 常见场景
   */
  standard: [
    // 基础 (6)
    'button',           // 按钮
    'input',            // 输入框
    'label',            // 标签
    'textarea',         // 多行文本
    'card',             // 卡片
    'badge',            // 徽章
    // 表单 (5)
    'form',             // 表单
    'select',           // 下拉选择
    'checkbox',         // 复选框
    'switch',           // 开关
    'slider',           // 滑块
    // 布局 (5)
    'dialog',           // 弹窗
    'sheet',            // 侧边栏抽屉
    'tabs',             // 标签页
    'accordion',        // 手风琴
    'separator',        // 分隔线
    // 数据展示 (4)
    'table',            // 表格
    'avatar',           // 头像
    'skeleton',         // 骨架屏
    'progress',         // 进度条
    // 导航 (3)
    'dropdown-menu',    // 下拉菜单
    'navigation-menu',  // 导航菜单
    'breadcrumb',       // 面包屑
    // 反馈 (2)
    'sonner',           // Toast (Sonner - 更现代)
    'alert',            // 警告
  ],
  
  /**
   * Full - 50 个全部组件
   * 适合: 大型项目、全功能需求
   */
  full: [
    // ========== 基础组件 (10) ==========
    'button',           // 按钮
    'input',            // 输入框
    'label',            // 标签
    'textarea',         // 多行文本
    'card',             // 卡片
    'badge',            // 徽章
    'avatar',           // 头像
    'separator',        // 分隔线
    'aspect-ratio',     // 宽高比
    'scroll-area',      // 滚动区域
    
    // ========== 表单组件 (10) ==========
    'form',             // 表单 (react-hook-form)
    'select',           // 下拉选择
    'checkbox',         // 复选框
    'radio-group',      // 单选组
    'switch',           // 开关
    'slider',           // 滑块
    'calendar',         // 日历
    'date-picker',      // 日期选择器
    'combobox',         // 组合框 (可搜索下拉)
    'input-otp',        // OTP 验证码输入
    
    // ========== 布局组件 (12) ==========
    'tabs',             // 标签页
    'accordion',        // 手风琴
    'sheet',            // 侧边栏抽屉
    'dialog',           // 弹窗
    'drawer',           // 抽屉
    'popover',          // 弹出框
    'dropdown-menu',    // 下拉菜单
    'navigation-menu',  // 导航菜单
    'command',          // 命令面板 (CMD+K)
    'context-menu',     // 右键菜单
    'menubar',          // 菜单栏
    'collapsible',      // 可折叠
    
    // ========== 数据展示 (9) ==========
    'table',            // 表格
    'pagination',       // 分页
    'progress',         // 进度条
    'skeleton',         // 骨架屏
    'breadcrumb',       // 面包屑
    'carousel',         // 轮播图
    'chart',            // 图表 (Recharts)
    'sidebar',          // 侧边栏
    
    // ========== 反馈组件 (6) ==========
    'sonner',           // Toast (Sonner)
    'alert',            // 警告
    'alert-dialog',     // 确认弹窗
    'tooltip',          // 工具提示
    'hover-card',       // 悬停卡片
    'resizable',        // 可调整大小
    
    // ========== 其他 (3) ==========
    'toggle',           // 切换按钮
    'toggle-group',     // 切换按钮组
  ],
} as const

export type ShadcnPreset = keyof typeof SHADCN_PRESETS

/**
 * 获取 npx/pnpm dlx 前缀
 */
function getNpxCommand(pm: PackageManager): string {
  switch (pm) {
    case 'pnpm':
      return 'pnpm dlx'
    case 'yarn':
      return 'yarn dlx'
    case 'bun':
      return 'bunx'
    default:
      return 'npx'
  }
}

/**
 * 安装 Shadcn UI 组件
 */
export async function installShadcnComponents(
  projectPath: string,
  pm: PackageManager,
  preset: ShadcnPreset,
  onProgress?: (message: string) => void
): Promise<void> {
  const components = SHADCN_PRESETS[preset]
  const npx = getNpxCommand(pm)
  
  onProgress?.(`Installing ${components.length} Shadcn UI components (${preset})...`)
  
  // shadcn 支持一次安装多个组件
  const cmd = `${npx} shadcn@latest add ${components.join(' ')} --yes --overwrite`
  
  await execaCommand(cmd, {
    cwd: projectPath,
    stdio: 'inherit',
  })
}

/**
 * 初始化 Shadcn UI（如果尚未初始化）
 */
export async function initShadcn(
  projectPath: string,
  pm: PackageManager
): Promise<void> {
  const npx = getNpxCommand(pm)
  
  // 使用默认配置初始化
  const cmd = `${npx} shadcn@latest init --yes --defaults`
  
  await execaCommand(cmd, {
    cwd: projectPath,
    stdio: 'inherit',
  })
}
