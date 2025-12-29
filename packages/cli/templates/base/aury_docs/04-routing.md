# 04 - 路由系统详解

## TanStack Router

项目使用 **TanStack Router v1**，提供完全类型安全的 File-based routing。

## File-based Routing

### 路由文件映射规则

| 文件路径 | URL 路径 | 说明 |
|---------|----------|------|
| `index.tsx` | `/` | 首页 |
| `about.tsx` | `/about` | 关于页 |
| `blog/index.tsx` | `/blog` | 博客列表 |
| `blog/$postId.tsx` | `/blog/:postId` | 博客详情 (动态参数) |
| `users/$userId/posts.tsx` | `/users/:userId/posts` | 嵌套路由 |
| `__root.tsx` | - | 根布局 (特殊) |

### 创建路由

```typescript
// src/routes/about.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return <div>About Page</div>
}
```

### 动态路由参数

```typescript
// src/routes/users/$userId.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/users/$userId')({
  component: UserProfile,
})

function UserProfile() {
  const { userId } = Route.useParams()
  return <div>User: {userId}</div>
}
```

## 路由导航

### Link 组件 (类型安全)

```typescript
import { Link } from '@tanstack/react-router'

// 静态路由
<Link to="/about">About</Link>

// 动态路由
<Link to="/users/$userId" params={{ userId: '123' }}>
  User Profile
</Link>

// 带查询参数
<Link to="/search" search={{ q: 'react', page: 1 }}>
  Search
</Link>
```

### useNavigate Hook

```typescript
import { useNavigate } from '@tanstack/react-router'

function MyComponent() {
  const navigate = useNavigate()

  const goToUser = (userId: string) => {
    navigate({ to: '/users/$userId', params: { userId } })
  }

  return <button onClick={() => goToUser('123')}>Go</button>
}
```

## 数据加载

### Loader (预加载数据)

```typescript
// src/routes/users/$userId.tsx
import { createFileRoute } from '@tanstack/react-router'
import { apiClient } from '@/lib/api-client'

export const Route = createFileRoute('/users/$userId')({
  loader: async ({ params }) => {
    const user = await apiClient.get(`/users/${params.userId}`)
    return { user }
  },
  component: UserProfile,
})

function UserProfile() {
  const { user } = Route.useLoaderData()
  return <div>{user.name}</div>
}
```

### 结合 TanStack Query

```typescript
import { queryOptions } from '@tanstack/react-query'

const userQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ['users', userId],
    queryFn: () => apiClient.get(`/users/${userId}`),
  })

export const Route = createFileRoute('/users/$userId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(userQueryOptions(params.userId)),
  component: UserProfile,
})

function UserProfile() {
  const { userId } = Route.useParams()
  const { data: user } = useQuery(userQueryOptions(userId))
  return <div>{user.name}</div>
}
```

## 路由守卫

### Before Load (权限检查)

```typescript
export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context }) => {
    if (!context.user?.isAdmin) {
      throw redirect({ to: '/login' })
    }
  },
  component: AdminPage,
})
```

## 嵌套路由

### 布局路由

```typescript
// src/routes/__root.tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Navbar } from '@/components/layout/navbar'

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet />  {/* 子路由渲染位置 */}
      </main>
    </div>
  )
}
```

## 搜索参数 (Query Params)

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const searchSchema = z.object({
  page: z.number().default(1),
  q: z.string().optional(),
})

export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,
  component: SearchPage,
})

function SearchPage() {
  const { page, q } = Route.useSearch()
  return <div>Page: {page}, Query: {q}</div>
}
```

## 路由元信息

```typescript
export const Route = createFileRoute('/about')({
  meta: () => [
    { title: 'About Us' },
    { name: 'description', content: 'Learn more about us' },
  ],
  component: AboutPage,
})
```

---

**下一步**: 阅读 [05-api-client.md](./05-api-client.md) 了解 API 请求。
