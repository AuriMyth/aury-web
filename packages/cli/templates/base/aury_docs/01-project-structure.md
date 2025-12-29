# 01 - 项目结构详解

## 完整目录树

```
{{PROJECT_NAME}}/
├── public/                      # 静态资源目录
│   ├── favicon.ico              # 网站图标
│   └── robots.txt               # 搜索引擎爬虫配置
│
├── src/                         # 源代码目录
│   ├── main.tsx                 # 应用入口文件
│   ├── index.css                # 全局样式 + Tailwind CSS
│   ├── routeTree.gen.ts         # TanStack Router 自动生成
│   │
│   ├── routes/                  # 路由目录 (File-based routing)
│   │   ├── __root.tsx           # 根路由布局
│   │   ├── index.tsx            # 首页 (/)
│   │   ├── about.tsx            # 关于页 (/about)
│   │   └── users/               # 用户相关路由
│   │       ├── index.tsx        # 用户列表 (/users)
│   │       └── $userId.tsx      # 用户详情 (/users/:userId)
│   │
│   ├── components/              # 组件目录
│   │   ├── ui/                  # Shadcn UI 组件 (15个预装)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── form.tsx
│   │   │   ├── select.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── badge.tsx
│   │   │   └── table.tsx
│   │   │
│   │   ├── layout/              # 布局组件
│   │   │   ├── navbar.tsx       # 顶部导航栏
│   │   │   ├── sidebar.tsx      # 侧边栏
│   │   │   ├── footer.tsx       # 页脚
│   │   │   └── page-header.tsx  # 页面头部
│   │   │
│   │   └── custom/              # 自定义 Cyberpunk 组件
│   │       ├── terminal-card.tsx    # 终端风格卡片
│   │       ├── glitch-text.tsx      # 故障文字效果
│   │       ├── neon-button.tsx      # 霓虹按钮
│   │       └── scanline-bg.tsx      # 扫描线背景
│   │
│   ├── shared/                  # ⭐ 全局复用层
│   │   ├── hooks/               # 通用 hooks
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useDebounce.ts
│   │   │   └── useMediaQuery.ts
│   │   ├── types/               # 通用类型
│   │   │   └── index.ts
│   │   ├── utils/               # 工具函数
│   │   │   └── format.ts
│   │   └── index.ts             # 统一导出
│   │
│   ├── features/                # ⭐ 业务功能模块（自包含，不对外复用）
│   │   └── products/            # 产品功能 (示例)
│   │       ├── components/      # 私有组件
│   │       │   ├── product-list.tsx
│   │       │   └── product-card.tsx
│   │       ├── hooks/           # 私有 hooks
│   │       │   └── useProducts.ts
│   │       ├── types/           # 私有类型
│   │       │   └── index.ts
│   │       └── index.ts         # 统一导出
│   │
│   ├── stores/                  # Zustand 全局状态
│   │   ├── theme.ts             # 主题状态
│   │   └── user.ts              # 用户状态
│   │
│   ├── lib/                     # 第三方库封装
│   │   ├── api-client.ts        # API 客户端
│   │   └── utils.ts             # cn, clsx 等
│
├── aury_docs/                   # 详细开发文档 (9个主题)
│   ├── 00-overview.md
│   ├── 01-project-structure.md
│   ├── 02-components.md
│   ├── 03-state-management.md
│   ├── 04-routing.md
│   ├── 05-api-client.md
│   ├── 06-styling.md
│   ├── 07-forms.md
│   ├── 08-hooks.md
│   └── 99-best-practices.md
│
├── .env.example                 # 环境变量模板
├── .env.development             # 开发环境变量
├── .env.production              # 生产环境变量
├── .gitignore                   # Git 忽略配置
├── AGENTS.md                    # AI Agent 开发指南
├── README.md                    # 项目说明
│
├── components.json              # Shadcn UI 配置
├── tsconfig.json                # TypeScript 配置
├── tsconfig.node.json           # Node 环境 TS 配置
├── vite.config.ts               # Vite 构建配置
├── package.json                 # NPM 依赖配置
└── pnpm-lock.yaml               # 依赖锁定文件
```

## 核心目录详解

### 1. `src/routes/` - 路由目录

**TanStack Router File-based Routing**: 文件结构自动映射为路由

#### 路由文件命名规则

| 文件路径 | 路由路径 | 说明 |
|---------|---------|------|
| `index.tsx` | `/` | 索引路由 |
| `about.tsx` | `/about` | 静态路由 |
| `$userId.tsx` | `/:userId` | 动态路由参数 |
| `users/$userId.tsx` | `/users/:userId` | 嵌套动态路由 |
| `__root.tsx` | - | 根布局 (特殊文件) |

#### 示例：创建新路由

```bash
# 创建 /blog 路由
touch src/routes/blog.tsx

# 创建 /blog/:postId 路由
mkdir src/routes/blog
touch src/routes/blog/$postId.tsx
```

### 2. `src/components/` - 组件目录

#### 2.1 `ui/` - Shadcn UI 组件
- **来源**: 由 Shadcn CLI 生成
- **特点**: 完全可定制，源码在项目中
- **样式**: 使用 Tailwind CSS + CVA (Class Variance Authority)
- **添加新组件**: `npx shadcn@latest add [component-name]`

#### 2.2 `layout/` - 布局组件
- **用途**: 页面结构、导航、页头页脚
- **特点**: 全局复用，影响整体布局
- **示例**: Navbar, Sidebar, Footer, PageHeader

#### 2.3 `custom/` - 自定义组件
- **用途**: 项目特有的 Cyberpunk 风格组件
- **特点**: 不通用于其他项目，视觉效果强烈
- **示例**: TerminalCard, GlitchText, NeonButton

### 3. `src/features/` - 功能模块目录

**按业务领域组织代码** (Feature-first structure)

#### 功能模块标准结构
```
features/
└── products/                   # 产品功能
    ├── components/             # 功能私有组件
    │   ├── product-list.tsx
    │   └── product-card.tsx
    ├── hooks/                  # 功能私有 hooks
    │   ├── useProducts.ts
    │   └── useProductFilters.ts
    ├── api.ts                  # API 请求函数
    ├── types.ts                # 类型定义
    └── index.ts                # 统一导出
```

#### 优势
1. **高内聚**: 相关代码集中在一个目录
2. **易维护**: 功能边界清晰
3. **可复用**: 整个功能模块可迁移到其他项目
4. **易测试**: 功能独立，测试覆盖清晰

### 4. `src/stores/` - 全局状态目录

**Zustand Store**: 轻量级全局状态管理

#### 状态分类
- **theme.ts**: 主题状态 (dark/light mode)
- **user.ts**: 用户信息、认证状态
- **cart.ts**: 购物车状态 (示例)
- **ui.ts**: UI 状态 (sidebar 展开/收起等)

#### 原则
- **最小化全局状态**: 优先使用 TanStack Query 管理服务端数据
- **持久化**: 使用 `zustand/middleware` 的 `persist` 中间件
- **类型安全**: 使用 TypeScript 定义 State 和 Actions

### 5. `src/shared/` - 全局复用层

**明确要复用的代码**：hooks、types、utils

#### 结构
```
shared/
├── hooks/           # 通用 hooks
│   ├── useDebounce.ts
│   ├── useLocalStorage.ts
│   └── index.ts
├── types/           # 通用类型
│   └── index.ts
├── utils/           # 工具函数
│   └── format.ts
└── index.ts         # 统一导出
```

#### 使用规则
1. 新代码默认写在 `features/xxx/` 里
2. 当第二个 feature 需要用到时，移到 `shared/`
3. `shared/` 里的代码不能依赖 `features/`

#### 提升示例
```bash
# 1. 移动文件
mv src/features/product/hooks/useSearch.ts src/shared/hooks/

# 2. 更新 shared/hooks/index.ts
export * from './useSearch'

# 3. 更新引用
# 旧: import { useSearch } from '@/features/product'
# 新: import { useSearch } from '@/shared'
```

### 6. `src/lib/` - 第三方库封装

**第三方库的配置和封装**

#### 核心文件
- **api-client.ts**: @aury/web-core API 客户端配置
- **utils.ts**: cn, clsx 等工具函数

## 文件命名规范

### 组件文件
- **React 组件**: `kebab-case.tsx` (e.g., `user-profile.tsx`)
- **组件默认导出**: PascalCase (e.g., `export default UserProfile`)

### 非组件文件
- **Hooks**: `use-*.ts` (e.g., `use-debounce.ts`)
- **工具函数**: `*.ts` (e.g., `utils.ts`)
- **类型文件**: `*.ts` (e.g., `api.ts`)
- **Store**: `*.ts` (e.g., `theme.ts`)

### 特殊文件
- **路由文件**: TanStack Router 规范 (`__root.tsx`, `$userId.tsx`)
- **配置文件**: `*.config.ts` (e.g., `vite.config.ts`)

## 导入路径别名

项目配置了 `@` 别名指向 `src/` 目录：

```typescript
// ❌ 相对路径 (不推荐)
import { Button } from '../../../components/ui/button'

// ✅ 别名路径 (推荐)
import { Button } from '@/components/ui/button'
```

### 配置位置
- `vite.config.ts`: Vite 构建时解析
- `tsconfig.json`: TypeScript 类型检查时解析

## 代码组织最佳实践

### 1. 功能优先 (Feature-first)
```
✅ 推荐: features/products/{components,hooks,api,types}
❌ 避免: components/products/, hooks/products/, api/products/
```

### 2. 按层级导入
```typescript
// ✅ 按层级导入
import React from 'react'                      // 1. 第三方库
import { useQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button' // 2. 项目内部
import { useAuth } from '@/hooks/useAuth'

import type { User } from '@/types'            // 3. 类型定义
```

### 3. 统一导出
```typescript
// features/products/index.ts
export * from './components/product-list'
export * from './hooks/useProducts'
export * from './types'
```

## 扩展建议

### 添加新功能模块
```bash
# 1. 创建功能目录
mkdir -p src/features/orders/{components,hooks}

# 2. 创建核心文件
touch src/features/orders/{api.ts,types.ts,index.ts}

# 3. 在 index.ts 统一导出
```

### 添加新路由
```bash
# 1. 创建路由文件
touch src/routes/orders.tsx

# 2. 实现路由组件
# 3. TanStack Router 自动识别
```

---

**下一步**: 阅读 [02-components.md](./02-components.md) 了解组件开发规范。
