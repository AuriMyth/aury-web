# 09 - 数据请求与缓存

## 为什么用 TanStack Query

**传统做法的痛点**：

```typescript
// ❌ 每个组件都要写 loading/error
const [users, setUsers] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

useEffect(() => {
  setLoading(true)
  fetch('/api/users').then(res => res.json()).then(setUsers)...
}, [])

// ❌ A组件和B组件都需要用户列表，会请求两次
// ❌ 用户编辑后，怎么通知其他组件刷新？
// ❌ 页面切走再切回，要不要重新请求？
```

**TanStack Query 解决的问题**：

1. **自动缓存** - 多个组件用同一接口，只请求一次
2. **自动去重** - 同时发起相同请求，合并为一次
3. **状态同步** - 一处更新，所有使用该数据的组件自动刷新
4. **内置状态** - loading、error、data 开箱即用
5. **智能重试** - 请求失败自动重试

## 基础用法

### 查询数据

```typescript
import { useAuryApi } from '@aury/web-core/hooks'

function UserList() {
  const { data, isLoading, error } = useAuryApi<User[]>('/api/v1/users')

  if (isLoading) return <div>加载中...</div>
  if (error) return <div>出错了: {error.message}</div>
  
  return (
    <ul>
      {data?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

### 变更数据

```typescript
import { useAuryMutation } from '@aury/web-core/hooks'
import { useQueryClient } from '@tanstack/react-query'

function CreateUser() {
  const queryClient = useQueryClient()
  
  const { mutate, isPending } = useAuryMutation<User, CreateUserDto>(
    '/api/v1/users',
    {
      method: 'post',
      onSuccess: () => {
        // 创建成功后，刷新用户列表
        queryClient.invalidateQueries({ queryKey: ['/api/v1/users'] })
      }
    }
  )

  return (
    <button 
      disabled={isPending}
      onClick={() => mutate({ name: '张三' })}
    >
      {isPending ? '创建中...' : '创建用户'}
    </button>
  )
}
```

## 刷新策略

### 默认行为

TanStack Query **不是轮询**，默认只在以下时机重新获取：

| 时机 | 默认值 | 说明 |
|------|--------|------|
| 组件挂载 | ✅ 开启 | 首次渲染时获取 |
| 窗口聚焦 | ✅ 开启 | 用户切回浏览器 Tab 时 |
| 网络重连 | ✅ 开启 | 断网恢复后 |
| 手动触发 | - | 调用 refetch() 或 invalidateQueries() |

### 关闭窗口聚焦刷新

如果觉得切 Tab 自动刷新太频繁：

```typescript
// 单个查询关闭
const { data } = useAuryApi<User[]>('/api/v1/users', {
  refetchOnWindowFocus: false
})

// 全局关闭 (src/main.tsx)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,  // 5分钟内认为数据新鲜
    }
  }
})
```

### 手动刷新

```typescript
const { data, refetch } = useAuryApi<User[]>('/api/v1/users')

// 刷新按钮
<button onClick={() => refetch()}>刷新列表</button>
```

### 轮询（需要显式开启）

```typescript
// 每 5 秒轮询一次
const { data } = useAuryApi<Notification[]>('/api/v1/notifications', {
  refetchInterval: 5000
})

// 只在页面可见时轮询
const { data } = useAuryApi<Notification[]>('/api/v1/notifications', {
  refetchInterval: 5000,
  refetchIntervalInBackground: false
})
```

## 常见场景

### 场景1：创建/编辑后刷新列表

```typescript
const queryClient = useQueryClient()

const { mutate } = useAuryMutation('/api/v1/products', {
  method: 'post',
  onSuccess: () => {
    // 方式1: 精确刷新
    queryClient.invalidateQueries({ queryKey: ['/api/v1/products'] })
    
    // 方式2: 模糊匹配刷新所有 products 相关
    queryClient.invalidateQueries({ queryKey: ['/api/v1/products'], exact: false })
  }
})
```

### 场景2：删除后刷新

```typescript
const queryClient = useQueryClient()

const { mutate: deleteProduct } = useAuryMutation(
  `/api/v1/products/${id}`,
  {
    method: 'delete',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/v1/products'] })
    }
  }
)
```

### 场景3：乐观更新（先改UI再请求）

```typescript
const queryClient = useQueryClient()

const { mutate } = useAuryMutation('/api/v1/todos', {
  method: 'post',
  onMutate: async (newTodo) => {
    // 取消进行中的查询
    await queryClient.cancelQueries({ queryKey: ['/api/v1/todos'] })
    
    // 保存旧数据
    const previous = queryClient.getQueryData(['/api/v1/todos'])
    
    // 乐观更新
    queryClient.setQueryData(['/api/v1/todos'], (old: Todo[]) => 
      [...old, { id: 'temp', ...newTodo }]
    )
    
    return { previous }
  },
  onError: (err, newTodo, context) => {
    // 出错时回滚
    queryClient.setQueryData(['/api/v1/todos'], context?.previous)
  },
  onSettled: () => {
    // 无论成功失败，都重新获取确保同步
    queryClient.invalidateQueries({ queryKey: ['/api/v1/todos'] })
  }
})
```

### 场景4：依赖查询

```typescript
// 先获取用户，再根据用户ID获取订单
const { data: user } = useAuryApi<User>('/api/v1/user/me')

const { data: orders } = useAuryApi<Order[]>(
  `/api/v1/users/${user?.id}/orders`,
  { enabled: !!user?.id }  // 只有 user.id 存在时才请求
)
```

### 场景5：分页

```typescript
import { useAuryPagination } from '@aury/web-core/hooks'

function ProductList() {
  const [page, setPage] = useState(1)
  const pageSize = 20

  const { data, isLoading } = useAuryPagination<Product[]>(
    '/api/v1/products',
    page,
    pageSize
  )

  return (
    <>
      <ProductGrid products={data} />
      <Pagination 
        current={page} 
        onChange={setPage} 
      />
    </>
  )
}
```

## 缓存控制

### staleTime vs cacheTime

```typescript
const { data } = useAuryApi('/api/v1/config', {
  staleTime: 10 * 60 * 1000,  // 10分钟内认为数据新鲜，不重新获取
  cacheTime: 30 * 60 * 1000,  // 缓存保留30分钟（即使没组件使用）
})
```

- **staleTime**: 数据多久后变"旧"（旧了才会触发重新获取）
- **cacheTime**: 数据在缓存中保留多久（组件卸载后）

### 预取数据

```typescript
const queryClient = useQueryClient()

// 鼠标悬停时预取
<Link 
  to={`/products/${id}`}
  onMouseEnter={() => {
    queryClient.prefetchQuery({
      queryKey: [`/api/v1/products/${id}`],
      queryFn: () => api.get(`/api/v1/products/${id}`)
    })
  }}
>
  查看详情
</Link>
```

## 调试

安装 React Query DevTools：

```typescript
// src/main.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

可以查看：
- 所有查询的状态
- 缓存的数据
- 请求时间线
- 手动触发 refetch/invalidate

## 不需要 TanStack Query 的场景

如果你的场景满足以下条件，可以直接用 `fetch`：

- 单个组件使用，不需要跨组件共享
- 不需要缓存
- 不需要自动重试
- 不需要 loading/error 统一管理

```typescript
// 简单场景直接用 fetch
useEffect(() => {
  fetch('/api/simple').then(res => res.json()).then(setData)
}, [])
```
