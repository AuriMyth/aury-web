# 07 - 表单处理

## 技术栈

- **React Hook Form** - 表单状态管理
- **Zod** - 数据验证
- **Shadcn Form** - UI 组件

## 基础用法

### 1. 定义 Schema

```typescript
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱'),
  password: z.string().min(6, '密码至少 6 位'),
})

type LoginFormData = z.infer<typeof loginSchema>
```

### 2. 创建表单

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (data: LoginFormData) => {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? '登录中...' : '登录'}
        </Button>
      </form>
    </Form>
  )
}
```

## 与 API 集成

```tsx
import { useAuryMutation } from '@aurimyth/web-core/hooks'

function CreateUserForm() {
  const { mutate, isPending } = useAuryMutation<User, CreateUserDto>('/api/v1/users')

  const form = useForm<CreateUserDto>({
    resolver: zodResolver(createUserSchema),
  })

  const onSubmit = (data: CreateUserDto) => {
    mutate(data, {
      onSuccess: () => {
        form.reset()
        toast.success('创建成功')
      },
      onError: (error) => {
        toast.error(error.message)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* ... */}
        <Button disabled={isPending}>
          {isPending ? '提交中...' : '提交'}
        </Button>
      </form>
    </Form>
  )
}
```

## 常用 Schema 模式

```typescript
// 可选字段
z.string().optional()

// 必填字段
z.string().min(1, '必填')

// 邮箱
z.string().email('邮箱格式错误')

// 手机号
z.string().regex(/^1[3-9]\d{9}$/, '手机号格式错误')

// 枚举
z.enum(['admin', 'user', 'guest'])

// 数组
z.array(z.string()).min(1, '至少选择一项')

// 对象
z.object({
  name: z.string(),
  age: z.number(),
})

// 条件验证
z.object({
  hasEmail: z.boolean(),
  email: z.string().email(),
}).refine(
  (data) => !data.hasEmail || data.email.length > 0,
  { message: '请填写邮箱', path: ['email'] }
)
```

## 表单状态

```typescript
const {
  formState: {
    isSubmitting,  // 提交中
    isValid,       // 是否有效
    isDirty,       // 是否修改过
    errors,        // 错误信息
  },
  reset,           // 重置表单
  setValue,        // 设置字段值
  watch,           // 监听字段变化
} = useForm()
```
