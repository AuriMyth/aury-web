# Create Aury Web

🚀 现代化 React 脚手架工具，多主题支持

## ✨ 特性

- ⚡ **React 19** - 支持 useTransition、useOptimistic
- 🏗️ **Vite 7** - 极速 HMR 和构建
- 🎨 **Tailwind CSS v4** - Lightning CSS 引擎
- 🎯 **TanStack Router** - 类型安全路由
- 🔄 **TanStack Query v5** - 强大的数据请求
- 🐻 **Zustand** - 轻量级状态管理
- 📝 **React Hook Form + Zod** - 类型安全表单
- 🎭 **Shadcn UI** - 精美、无障碍组件
- 🎨 **多主题** - Minimalist Modern、Cyberpunk

## 📦 安装

```bash
# 使用 pnpm（推荐）
pnpm create aury-web my-app

# 使用 npx
npx create-aury-web my-app

# 直接命令
aury-web init my-app
```

## 🎯 命令

### 初始化项目
```bash
# 交互模式
aury-web init

# 带参数
aury-web init my-app --template cyberpunk --pm pnpm --skip-git
```

### 添加组件
```bash
# 添加 Shadcn UI 组件
aury-web add button dialog table

# 添加多个组件
aury-web add button input card badge
```

### 代码生成
```bash
# 生成 feature 模块
aury-web generate feature product
aury-web generate feature product -i  # 交互模式

# 生成组件
aury-web generate component ProductCard

# 生成页面
aury-web generate page products

# 生成 API 客户端
aury-web generate api product --base-url /api/v1/products

# 生成 store
aury-web generate store cart
```

### 主题管理
```bash
# 列出可用主题
aury-web theme list

# 查看当前主题
aury-web theme current

# 切换主题（交互）
aury-web theme change

# 切换到指定主题
aury-web theme switch cyberpunk
```

### Docker 配置
```bash
# 生成 Docker 文件
aury-web docker init

# 包含 Nginx
aury-web docker init --nginx

# 多阶段构建
aury-web docker init --multi-stage
```

### 文档
```bash
# 生成文档
aury-web docs generate

# 更新文档
aury-web docs update
```

### 开发
```bash
# 启动开发服务器
aury-web dev

# 生产构建
aury-web build

# 预览生产构建
aury-web preview
```

## 🧪 本地开发

```bash
# 克隆并安装
git clone <repo-url>
cd aury-web
pnpm install

# 构建
pnpm build  # 构建所有包

# 全局链接 CLIï¼只需一次ï¼
cd packages/cli && pnpm link --global
```

### 测试生成的项目

由于 `@aury/web-core` 尚未发布到 npm，本地测试需要 link：

```bash
export ROOT=/path/to/aury-web

# 一键测试
cd $ROOT && pnpm build && \
rm -rf /tmp/aury-test && mkdir -p /tmp/aury-test && cd /tmp/aury-test && \
node $ROOT/packages/cli/dist/index.js init . --skip-git --skip-install && \
pnpm link $ROOT/packages/core && \
pnpm install && \
npx shadcn@latest add button card -y && \
pnpm dev
```

## 📁 生成的项目结构

```
my-app/
├── src/
│   ├── routes/           # TanStack Router 文件路由
│   ├── shared/           # ⭐ 全局复用层
│   │   ├── hooks/       # 通用 hooks
│   │   ├── types/       # 通用类型
│   │   └── utils/       # 工具函数
│   ├── features/         # ⭐ 业务功能模块（自包含）
│   ├── components/
│   │   ├── ui/          # Shadcn UI 组件
│   │   ├── common/      # 通用组件
│   │   └── layout/      # 布局组件
│   ├── lib/              # 第三方库封装
│   ├── stores/           # Zustand Stores
│   └── providers/        # Context Providers
├── AGENTS.md             # AI 开发指南
├── aury_docs/            # 详细文档
└── package.json
```

## 🎨 主题

- **Minimalist Modern**（默认）- 简洁设计，Electric Blue 渐变强调色
- **Cyberpunk** - 霓虹色彩、扫描线、故障动画

## 🤖 AI 友好文档

每个生成的项目都包含：
- `AGENTS.md` - AI 助手开发指南
- `aury_docs/` - 详细文档，涵盖架构、组件、API 规范和最佳实践

## 🛠️ 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | React 19 |
| 构建工具 | Vite 7 |
| 路由 | TanStack Router v1 |
| 数据请求 | TanStack Query v5 |
| 状态管理 | Zustand v5 |
| 样式 | Tailwind CSS v4 |
| UI 组件 | Shadcn UI + Radix UI |
| 表单 | React Hook Form + Zod |
| 包管理器 | pnpm（推荐）|

## 🚀 发布

```bash
# 首次发布需要登录（使用官方源）
npm login --registry https://registry.npmjs.org

# 发布 CLI
pnpm release:cli --registry https://registry.npmjs.org

# 发布 core
pnpm release:core --registry https://registry.npmjs.org
```

## 📝 许可证

MIT

## 🤝 贡献

欢迎贡献！请阅读我们的贡献指南。

## 📞 支持

- GitHub Issues: [报告问题或提出建议](https://github.com/AuriMyth/create-aury-web/issues)
- 文档: [完整文档](https://github.com/AuriMyth/create-aury-web/wiki)

---

由 Aury Team 用 ❤️ 打造
