# 99 - 最佳实践

## 代码质量

### 1. TypeScript 严格模式
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### 2. ESLint 规则
- 使用 ESLint 9 Flat Config
- 启用 React 19 规则
- 禁止 `any` 类型

### 3. 代码审查清单
- [ ] 所有函数都有类型定义
- [ ] 没有 `any` 类型
- [ ] 组件职责单一
- [ ] 样式使用 Tailwind
- [ ] API 请求使用 TanStack Query

## 性能优化

### 1. 避免过度渲染
```typescript
// ❌ 每次都创建新对象
<Component config={{}} />

// ✅ 使用 useMemo
const config = useMemo(() => ({}), [])
<Component config={config} />
```

### 2. 懒加载路由
```typescript
const About = lazy(() => import('./routes/about'))
```

### 3. 图片优化
- 使用 WebP 格式
- 添加 `loading="lazy"`
- 使用适当尺寸

## 安全实践

### 1. 环境变量
- 敏感信息存储在 `.env.local` (不提交 Git)
- 使用 `VITE_` 前缀暴露给客户端

### 2. API 请求
- 使用 HTTPS
- 添加请求超时
- 验证响应数据

### 3. XSS 防护
- 避免 `dangerouslySetInnerHTML`
- 使用 React 自动转义

## 测试策略

### 1. 单元测试
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from './button'

test('renders button', () => {
  render(<Button>Click</Button>)
  expect(screen.getByText('Click')).toBeInTheDocument()
})
```

### 2. 集成测试
- 测试完整用户流程
- 使用 MSW mock API

### 3. E2E 测试
- 使用 Playwright
- 测试关键业务流程

## Git 工作流

### 1. 提交信息规范
```
feat: 添加用户登录功能
fix: 修复按钮样式问题
docs: 更新 README
refactor: 重构 API client
```

### 2. 分支策略
- `main` - 生产环境
- `develop` - 开发环境
- `feature/*` - 功能分支
- `hotfix/*` - 紧急修复

## 部署检查清单

- [ ] 环境变量已配置
- [ ] 构建成功
- [ ] 类型检查通过
- [ ] 测试通过
- [ ] 性能指标正常
- [ ] 安全检查通过

---

**持续改进**: 定期回顾和更新最佳实践。
