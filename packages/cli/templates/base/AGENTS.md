# AGENTS.md - AI 开发指南

> 本文档为 AI Agent 提供项目完整开发指南。

## 项目架构

```
src/
├── routes/          # TanStack Router 文件路由
│   ├── __root.tsx  # 根布局
│   └── index.tsx   # 首页 (/)
├── shared/          # ⭐ 全局复用层
│   ├── hooks/       # 通用 hooks (useDebounce, useLocalStorage 等)
│   ├── types/       # 通用类型 (BaseResponse, Pagination 等)
│   └── utils/       # 工具函数 (format, cn 等)
├── features/        # ⭐ 业务功能模块（自包含，不对外复用）
│   └── product/
│       ├── components/  # 私有组件
│       ├── hooks/       # 私有 hooks
│       ├── types/       # 私有类型
│       └── index.ts     # 统一导出
├── components/
│   ├── ui/          # Shadcn UI 原子组件
│   ├── common/      # 跨模块业务组件
│   └── layout/      # 布局 (Navbar, Sidebar, Footer)
├── api/             # 全局 API
├── assets/          # 静态资源
├── lib/             # 第三方库封装
├── providers/       # 全局 Context Providers
└── stores/          # Zustand 全局状态
```

## shared vs features 使用规则

**核心原则**：
- `shared/` - 明确要复用的代码
- `features/` - 业务专属代码，不对外复用

**决策流程**：
1. 新代码默认写在 `features/xxx/` 里
2. 当第二个 feature 需要用到时，移到 `shared/`
3. `shared/` 里的代码不能依赖 `features/`

**示例：将 hook 从 feature 提升到 shared**：

```bash
# 1. 移动文件
mv src/features/product/hooks/useSearch.ts src/shared/hooks/

# 2. 更新 shared/hooks/index.ts
export * from './useSearch'

# 3. 更新引用
# 旧: import { useSearch } from '@/features/product'
# 新: import { useSearch } from '@/shared'
```

## 技术栈

| 维度 | 选型 | 版本 |
|------|------|------|
| 核心框架 | React | 19 |
| 构建工具 | Vite | 6 |
| 路由管理 | TanStack Router | v1 (File-based, Type-safe) |
| 异步状态 | TanStack Query | v5 |
| 全局状态 | Zustand | v5 |
| 样式方案 | Tailwind CSS | v4 (Lightning CSS) |
| UI 组件库 | Shadcn UI | 最新 (源代码形式) |
| 表单处理 | React Hook Form + Zod | 最新 |
| 后端集成 | @aurimyth/web-core | v1 |

## @aurimyth/web-core 核心库

**本项目使用 `@aurimyth/web-core` 处理与后端的集成。**

### 后端 BaseResponse 格式

后端所有接口都返回统一格式：

```typescript
{
  code: number      // 200 表示成功
  message: string   // 响应消息
  data: T           // 实际数据
  timestamp?: string
}
```

### 自动处理 BaseResponse

`@aurimyth/web-core` 自动解包 `data` 字段：

```typescript
import { useAuryApi, useAuryMutation } from '@aurimyth/web-core/hooks'

// 查询 - 自动解包，data 直接是 User[]
const { data, isLoading, error } = useAuryApi<User[]>('/api/v1/users')

// 变更
const { mutate, isPending } = useAuryMutation<User, CreateUserDto>('/api/v1/users')
mutate({ name: '张三', email: 'test@example.com' })
```

### API 客户端配置

```typescript
// src/lib/api-client.ts
import { AuryApiClient } from '@aurimyth/web-core/api'

export const api = new AuryApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  successCode: 200,  // 后端成功码
  headers: {
    'Content-Type': 'application/json',
  }
})
```

## 核心设计约束

### 1. API 请求规范

**✅ 必须使用 @aurimyth/web-core**：

```typescript
// ✅ 正确 - 自动处理 BaseResponse
const { data } = useAuryApi<User[]>('/api/v1/users')

// ❌ 错误 - 不要手动处理 BaseResponse
const { data } = useQuery({
  queryFn: async () => {
    const res = await fetch('/api/v1/users')
    const json = await res.json()
    if (json.code !== 200) throw new Error(json.message)
    return json.data  // 手动解包
  }
})
```

### 2. 路由系统 (TanStack Router)

**File-based Routing**：

| 文件路径 | URL 路径 | 说明 |
|---------|---------|------|
| `routes/index.tsx` | `/` | 首页 |
| `routes/about.tsx` | `/about` | 关于页 |
| `routes/users/index.tsx` | `/users` | 用户列表 |
| `routes/users/$userId.tsx` | `/users/:userId` | 用户详情（动态路由）|
| `routes/__root.tsx` | - | 根布局（特殊文件）|

**示例**：

```typescript
// src/routes/users/$userId.tsx
import { createFileRoute } from '@tanstack/react-router'
import { useAuryApi } from '@aurimyth/web-core/hooks'

export const Route = createFileRoute('/users/$userId')({
  component: UserProfile
})

function UserProfile() {
  const { userId } = Route.useParams()
  const { data: user, isLoading } = useAuryApi<User>(`/api/v1/users/${userId}`)
  
  if (isLoading) return <div>Loading...</div>
  return <div>{user?.name}</div>
}
```

### 3. 状态管理分层

- **服务端状态**: TanStack Query（通过 useAuryApi）
- **全局客户端状态**: Zustand（用户信息、主题配置）
- **表单状态**: React Hook Form + Zod
- **URL 状态**: TanStack Router（搜索参数、路由参数）

### 4. Feature 模块化

**按业务领域组织代码（高内聚低耦合）**：

```
features/feature/
├── components/
│   ├── FeatureList.tsx      # 功能列表
│   └── FeatureCard.tsx      # 功能卡片
├── hooks/
│   ├── useFeatures.ts       # 查询功能列表
│   └── useCreateFeature.ts  # 创建功能
├── api.ts                   # API 请求函数
├── types.ts                 # 类型定义
└── index.ts                 # 统一导出
```

```typescript
// features/feature/hooks/useFeatures.ts
import { useAuryApi } from '@aurimyth/web-core/hooks'
import type { Feature } from '../types'

export function useFeatures() {
  return useAuryApi<Feature[]>('/api/v1/features')
}

// features/feature/index.ts
export * from './hooks/useFeatures'
export * from './hooks/useCreateFeature'
export * from './components/FeatureList'
export * from './types'

// 使用
import { useFeatures, FeatureList } from '@/features/feature'
```

### 5. 类型定义规范

```typescript
// src/types/user.ts

// 后端 DTO（与后端字段一致，蛇形命名）
export type UserDTO = {
  id: string
  name: string
  email: string
  created_at: string
}

// 前端使用类型（驼峰命名，可选字段）
export type User = {
  id: string
  name: string
  email: string
  createdAt: string
}

// 表单类型
export type UserFormData = {
  name: string
  email: string
}
```

## Cyberpunk 主题系统

### 设计哲学

**"High-Tech, Low-Life"** - 数字废土美学

**核心元素**：
- **霓虹色**: `#00ff88` (绿), `#ff00ff` (品红), `#00d4ff` (青)
- **扫描线**: CRT 显示器效果
- **故障效果**: RGB 色差、画面撕裂
- **霓虹光晕**: 多层 box-shadow
- **切角边框**: clip-path 实现
- **等宽字体**: JetBrains Mono, Orbitron
- **大写文本**: 终端风格

### 全局效果

```css
/* 扫描线覆盖 */
body::before {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.3) 2px,
    rgba(0, 0, 0, 0.3) 4px
  );
}

/* 电路板背景 */
.cyber-grid {
  background-image:
    linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}
```

### 关键样式类

| 类名 | 效果 |
|------|------|
| `neon-glow` | 文字的多层发光效果 |
| `neon-border` | 边框的霉虹灯光晕 |
| `glitch` | RGB 色差故障动画 |
| `chamfer` / `chamfer-sm` | 切角边框 |
| `cyber-grid` | 电路板网格背景 |
| `holographic` | 全息渐变动画 |
| `terminal-cursor` | 终端光标闪烁 |
| `cyber-btn` | Cyberpunk 按钮样式 |
| `cyber-card` | Cyberpunk 卡片样式 |
| `cyber-input` | Cyberpunk 输入框样式 |
| `text-cyber-gradient` | 霉虹文字渐变 |
| `cyber-divider` | 装饰分隔线 |
| `corner-decor` | 角落装饰 |
| `typing` | 打字机效果 |
| `status-online` | 在线状态指示器 |

```tsx
// 使用示例
<Card className="cyber-card chamfer">
  <h2 className="text-cyber-gradient uppercase tracking-widest">
    SYSTEM ONLINE
  </h2>
  <div className="cyber-divider my-4" />
  <Button className="cyber-btn neon-glow">
    CONNECT
  </Button>
</Card>
```

## Mock 开发模式

使用 **MSW (Mock Service Worker)** 在前端模拟后端 API，无需等待后端开发完成。

### 启用 Mock

```bash
# 1. 安装依赖
pnpm add -D msw

# 2. 初始化 Service Worker
npx msw init public/

# 3. 配置环境变量
echo "VITE_ENABLE_MOCK=true" >> .env.local
```

### 添加 Mock Handler

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse, delay } from 'msw'

export const handlers = [
  http.get('/api/v1/users', async () => {
    await delay(500)  // 模拟网络延迟
    
    return HttpResponse.json({
      code: 200,
      message: 'success',
      data: [
        { id: '1', name: '张三', email: 'test@example.com' }
      ],
      timestamp: new Date().toISOString()
    })
  }),
]
```

### 在 main.tsx 中启用

```typescript
async function enableMocking() {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK === 'true') {
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
```

## 开发工作流

### 添加新页面

```bash
# 创建路由文件
touch src/routes/about.tsx

# 实现组件（文件会自动映射为 /about）
```

### 添加新 Feature

```bash
# 1. 创建目录结构
mkdir -p src/features/products/{components,hooks}
touch src/features/products/{api.ts,types.ts,index.ts}

# 2. 实现 Hook
# features/products/hooks/useProducts.ts
import { useAuryApi } from '@aurimyth/web-core/hooks'

export function useProducts() {
  return useAuryApi<Product[]>('/api/v1/products')
}

# 3. 在页面使用
import { useProducts, ProductList } from '@/features/products'
```

### 添加 Shadcn UI 组件

```bash
# 查看可用组件
npx shadcn@latest add

# 添加组件
npx shadcn@latest add dropdown-menu
```

## 环境变量

```bash
# .env
# 只配置域名和端口，API 路径前缀在代码中统一管理
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_TITLE=My App
```

```typescript
// API 路径在 hooks 中定义
const { data } = useAuryApi<User[]>('/api/v1/users')  // 包含完整路径
```

## 最佳实践

### ✅ 推荐

1. **API 请求优先使用 useAuryApi**
2. **路由使用 TanStack Router 的类型安全导航**
3. **组件优先使用 Shadcn UI（源码可修改）**
4. **样式使用 Tailwind CSS Utility Classes**
5. **Feature 模块化组织（高内聚低耦合）**
6. **类型定义完整（避免 any）**

### ❌ 避免

1. ❌ 手动处理 BaseResponse 解包
2. ❌ 硬编码 API URL
3. ❌ 滥用全局状态（优先 TanStack Query）
4. ❌ 混合使用其他 UI 库
5. ❌ 忽略 TypeScript 类型错误
6. ❌ 在 components/ 中放业务逻辑（应放 features/）

## ❗ 必读文档

**开发对应功能前，必须阅读相关文档！**

| 开发任务 | 必读文档 |
|---------|----------|
| 新建项目/理解架构 | `01-project-structure.md` |
| 开发组件 | `02-components.md` |
| 状态管理 | `03-state-management.md` |
| 路由配置 | `04-routing.md` |
| **调用接口/数据请求** | `05-api-client.md` + `09-data-fetching.md` |
| 样式/主题 | `06-styling.md` |
| 表单开发 | `07-forms.md` |
| 自定义 Hooks | `08-hooks.md` |

## 文档目录

`aury_docs/` 完整列表：

- **00-overview.md** - 项目总览
- **01-project-structure.md** - 目录结构详解（含 shared vs features）
- **02-components.md** - 组件开发指南
- **03-state-management.md** - 状态管理详解
- **04-routing.md** - 路由系统详解
- **05-api-client.md** - @aurimyth/web-core 使用
- **06-styling.md** - Tailwind CSS + Cyberpunk 主题
- **07-forms.md** - React Hook Form + Zod 表单
- **08-hooks.md** - 自定义 Hooks 指南
- **09-data-fetching.md** - ⭐ 数据请求与缓存（重要！）
- **99-best-practices.md** - 最佳实践合集

---

**Last Updated**: {{TIMESTAMP}}  
**Project Version**: 0.1.0  
**Core Library**: @aurimyth/web-core v1.0.0  
**Theme**: Cyberpunk / Glitch
