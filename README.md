# Create Aury Web

🚀 现代化 React 脚手架工具，自带赛博朋克主题

## ✨ 特性

- ⚡ **React 19** - 支持 useTransition、useOptimistic
- 🏗️ **Vite 7** - 极速 HMR 和构建
- 🎨 **Tailwind CSS v4** - Lightning CSS 引擎
- 🎯 **TanStack Router** - 类型安全路由
- 🔄 **TanStack Query v5** - 强大的数据请求
- 🐻 **Zustand** - 轻量级状态管理
- 📝 **React Hook Form + Zod** - 类型安全表单
- 🎭 **Shadcn UI** - 精美、无障碍组件
- 🌌 **赛博朋克主题** - 霉虹灯设计系统

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

# 构建 CLI
pnpm build

# 全局链接（只需一次）
pnpm setup  # 首次需要设置 pnpm 全局目录
source ~/.zshrc  # 重新加载 shell 配置
pnpm link --global

# 开发模式 - 终端1：自动构建
pnpm build --watch

# 开发模式 - 终端2：测试命令
cd ~/Desktop/test
aury-web init test-project

# 或者手动构建
pnpm build  # 修改代码后手动构建
aury-web init test  # 然后测试
```

### 测试生成的项目（含 @aury/web-core）

由于 `@aury/web-core` 尚未发布到 npm，本地测试需要 link：

```bash
# 1. 构建 core 包
cd /path/to/aury-web
pnpm build:core

# 2. 创建测试项目
mkdir -p ~/Desktop/test && cd ~/Desktop/test
node /path/to/aury-web/dist/index.js init my-test --skip-install --skip-components

# 3. 进入项目并 link core
cd my-test
pnpm link /path/to/aury-web/packages/core

# 4. 安装依赖
pnpm install

# 5. 启动开发服务器
pnpm dev
```

**一键测试脚本**：

```bash
export ROOT=/Users/gao/Desktop/gitSource/aury-web

cd $ROOT && pnpm build && pnpm build:core && \
rm -rf /tmp/aury-test && mkdir -p /tmp/aury-test && cd /tmp/aury-test && \
node $ROOT/dist/index.js init . --skip-git --skip-install && \
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

### Cyberpunk（默认）
- 霉虹色彩（青色、品红、电光绿）
- 扫描线效果
- 故障动画
- 切角边框
- 终端美学

更多主题即将推出...

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

### 发布流程

```bash
pnpm login --registry https://registry.npmjs.org/

# 1. 更新版本号
pnpm version patch  # 或 minor / major

# 2. 构建
pnpm build
pnpm build:core

# 3. 发布 @aury/web-core
cd packages/core
pnpm publish --access public

# 4. 发布 create-aury-web
cd ../.. 
pnpm publish --access public

# 5. 推送 tag
git push --tags
```

### 发布检查清单

- [ ] 所有测试通过
- [ ] 版本号已更新 (package.json, packages/core/package.json)
- [ ] CHANGELOG 已更新
- [ ] 构建成功
- [ ] 本地测试通过

## 📝 许可证

MIT

## 🤝 贡献

欢迎贡献！请阅读我们的贡献指南。

## 📞 支持

- GitHub Issues: [报告问题或提出建议](https://github.com/AuriMyth/create-aury-web/issues)
- 文档: [完整文档](https://github.com/AuriMyth/create-aury-web/wiki)

---

由 Aury Team 用 ❤️ 打造
