# 06 - 样式系统

## Tailwind CSS v4

本项目使用 Tailwind CSS v4，基于 Lightning CSS，零配置开箱即用。

### 配置文件

样式配置在 `src/index.css`，包含：
- CSS 变量（颜色、字体、阴影等）
- 主题特定的工具类
- 组件样式覆盖

## 主题系统

项目初始化时可选择主题，主题定义在 `src/index.css`。

查看当前主题的所有可用样式类，直接阅读 `src/index.css` 文件。

切换主题：
```bash
aury-web theme list      # 查看可用主题
aury-web theme change    # 交互式切换
```

## Shadcn UI 组件

Shadcn UI 组件放在 `src/components/ui/`，使用 Tailwind 类自定义：

```tsx
// 自定义 Button
<Button className="cyber-btn neon-glow">
  Click Me
</Button>

// 自定义 Card
<Card className="cyber-card chamfer">
  <CardHeader>...</CardHeader>
</Card>
```

## cn() 工具函数

合并 Tailwind 类：

```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  "base-class",
  isActive && "active-class",
  className
)}>
```

## 响应式设计

```tsx
// Tailwind 断点
<div className="
  w-full          // 默认
  md:w-1/2        // >= 768px
  lg:w-1/3        // >= 1024px
">
```

## 暗色模式

默认启用暗色模式，通过 CSS 变量切换：

```css
:root {
  --background: oklch(0.12 0 0);
}

.dark {
  --background: oklch(0.08 0 0);
}
```
