# 02 - 组件开发指南

## Shadcn UI 组件库

项目已预装 **15 个核心 Shadcn UI 组件**，开箱即用。

### 预装组件列表

| 组件 | 用途 | 文件路径 |
|------|------|----------|
| Button | 按钮 | `@/components/ui/button` |
| Card | 卡片容器 | `@/components/ui/card` |
| Input | 输入框 | `@/components/ui/input` |
| Label | 标签 | `@/components/ui/label` |
| Form | 表单容器 | `@/components/ui/form` |
| Select | 下拉选择 | `@/components/ui/select` |
| Checkbox | 复选框 | `@/components/ui/checkbox` |
| Switch | 开关 | `@/components/ui/switch` |
| Dialog | 对话框 | `@/components/ui/dialog` |
| Tabs | 标签页 | `@/components/ui/tabs` |
| Sheet | 侧边抽屉 | `@/components/ui/sheet` |
| Toast | 提示通知 | `@/components/ui/toast` |
| Alert | 警告提示 | `@/components/ui/alert` |
| Badge | 徽章 | `@/components/ui/badge` |
| Table | 表格 | `@/components/ui/table` |

### 使用示例

#### Button 按钮
```typescript
import { Button } from '@/components/ui/button'

<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

#### Card 卡片
```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

#### Input + Label
```typescript
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

#### Dialog 对话框
```typescript
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content goes here</p>
  </DialogContent>
</Dialog>
```

#### Select 下拉选择
```typescript
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

### 添加新的 Shadcn UI 组件

```bash
# 查看可用组件
npx shadcn@latest add

# 添加单个组件
npx shadcn@latest add dropdown-menu

# 添加多个组件
npx shadcn@latest add avatar dropdown-menu tooltip
```

## 自定义 Cyberpunk 组件

### Terminal Card 终端卡片
```typescript
// src/components/custom/terminal-card.tsx
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type TerminalCardProps = {
  title?: string
  children: React.ReactNode
  className?: string
}

export function TerminalCard({ title, children, className }: TerminalCardProps) {
  return (
    <Card className={cn('border-primary/30 bg-background/80 backdrop-blur-sm', className)}>
      {title && (
        <div className="border-b border-primary/30 px-4 py-2 font-mono text-sm text-primary">
          {title}
        </div>
      )}
      <div className="p-4 font-mono text-sm">{children}</div>
    </Card>
  )
}
```

### Glitch Text 故障文字
```typescript
// src/components/custom/glitch-text.tsx
import { cn } from '@/lib/utils'

type GlitchTextProps = {
  children: string
  className?: string
}

export function GlitchText({ children, className }: GlitchTextProps) {
  return (
    <span
      className={cn('glitch relative inline-block', className)}
      data-text={children}
    >
      {children}
    </span>
  )
}
```

### Neon Button 霓虹按钮
```typescript
// src/components/custom/neon-button.tsx
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function NeonButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(
        'neon-glow border-primary bg-primary/10 text-primary hover:bg-primary/20',
        className
      )}
      {...props}
    />
  )
}
```

## 布局组件

### Navbar 导航栏
```typescript
// src/components/layout/navbar.tsx
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <nav className="border-b border-border">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold">
          {{PROJECT_NAME}}
        </Link>
        <div className="flex gap-4">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost">About</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
```

### Sidebar 侧边栏
```typescript
// src/components/layout/sidebar.tsx
import { Link } from '@tanstack/react-router'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

export function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="flex flex-col gap-4">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start">
              Home
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost" className="w-full justify-start">
              About
            </Button>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
```

## 组件开发最佳实践

### 1. 组件结构

```typescript
// 标准组件结构
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ComponentProps } from '@/types'

// 1. 类型定义
type MyComponentProps = {
  title: string
  description?: string
  onAction?: () => void
} & ComponentProps

// 2. 组件实现
export function MyComponent({ 
  title, 
  description, 
  onAction,
  className 
}: MyComponentProps) {
  // 3. Hooks
  const [count, setCount] = useState(0)

  // 4. 事件处理
  const handleClick = () => {
    setCount(count + 1)
    onAction?.()
  }

  // 5. 渲染
  return (
    <div className={cn('p-4', className)}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      <Button onClick={handleClick}>Count: {count}</Button>
    </div>
  )
}
```

### 2. Props 类型定义

```typescript
// ✅ 推荐：使用 type
export type ButtonProps = {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  children: React.ReactNode
}

// ✅ 扩展原生 HTML 属性
export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string
}

// ✅ 扩展其他组件 Props
export type CustomButtonProps = ButtonProps & {
  loading?: boolean
}
```

### 3. 样式管理 (CVA)

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

// 定义变体
const buttonVariants = cva(
  // 基础样式
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground'
      },
      size: {
        sm: 'h-9 px-3 text-sm',
        default: 'h-10 px-4 py-2',
        lg: 'h-11 px-8'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

// 使用
type ButtonProps = VariantProps<typeof buttonVariants> & {
  children: React.ReactNode
}

export function Button({ variant, size, children, className }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)}>
      {children}
    </button>
  )
}
```

### 4. 组件组合

```typescript
// 复合组件模式
export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border bg-card">{children}</div>
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="p-6">{children}</div>
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6 pt-0">{children}</div>
}

// 使用
<Card>
  <CardHeader>Header</CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### 5. forwardRef 使用

```typescript
import { forwardRef } from 'react'

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn('flex h-10 w-full rounded-md border', className)}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
```

## 图标使用 (Lucide React)

```typescript
import { Check, X, AlertCircle, Loader2 } from 'lucide-react'

// 基础使用
<Check className="h-4 w-4" />

// 带颜色
<AlertCircle className="h-4 w-4 text-destructive" />

// 加载动画
<Loader2 className="h-4 w-4 animate-spin" />

// 在 Button 中使用
<Button>
  <Check className="mr-2 h-4 w-4" />
  Save
</Button>
```

## 响应式设计

```typescript
// 使用 Tailwind 响应式前缀
<div className="flex flex-col gap-4 md:flex-row md:gap-6 lg:gap-8">
  {/* Mobile: 列布局, Desktop: 行布局 */}
</div>

// 隐藏/显示
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>

// 文字大小
<h1 className="text-2xl md:text-3xl lg:text-4xl">Responsive Heading</h1>
```

## 性能优化

### 1. React.memo 使用
```typescript
import { memo } from 'react'

export const ExpensiveComponent = memo(function ExpensiveComponent({ data }: Props) {
  // 仅在 props 变化时重新渲染
  return <div>{/* ... */}</div>
})
```

### 2. 懒加载组件
```typescript
import { lazy, Suspense } from 'react'

const HeavyComponent = lazy(() => import('./heavy-component'))

export function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  )
}
```

### 3. 虚拟滚动 (大列表)
```typescript
// 使用 @tanstack/react-virtual
import { useVirtualizer } from '@tanstack/react-virtual'

export function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50
  })

  return (
    <div ref={parentRef} className="h-[400px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div key={item.key} style={{ height: `${item.size}px` }}>
            {items[item.index]}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

**下一步**: 阅读 [03-state-management.md](./03-state-management.md) 了解状态管理。
