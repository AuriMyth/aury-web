# 05 - API 客户端

## @aurimyth/web-core

本项目使用 `@aurimyth/web-core` 处理与后端的所有 API 交互。

### 后端 BaseResponse 格式

```typescript
{
  code: number      // 200 表示成功
  message: string   // 响应消息
  data: T           // 实际数据
  timestamp?: string
}
```

### 配置 API 客户端

```typescript
// src/lib/api-client.ts
import { AuryApiClient } from '@aurimyth/web-core/api'

export const api = new AuryApiClient({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
  successCode: 200,
})

// 添加请求拦截器：注入 token
api.axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 在 main.tsx 中注入

```typescript
import { AuryApiProvider } from '@aurimyth/web-core/providers'
import { api } from './lib/api-client'

<AuryApiProvider client={api}>
  <App />
</AuryApiProvider>
```

## 使用 Hooks

### 查询数据

```typescript
import { useAuryApi } from '@aurimyth/web-core/hooks'

function UserList() {
  const { data: users, isLoading, error } = useAuryApi<User[]>('/api/v1/users')
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <ul>
      {users?.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

### 变更数据

```typescript
import { useAuryMutation } from '@aurimyth/web-core/hooks'

function CreateUserForm() {
  const { mutate, isPending, error } = useAuryMutation<User, CreateUserDto>(
    '/api/v1/users'
  )
  
  const handleSubmit = (data: CreateUserDto) => {
    mutate(data, {
      onSuccess: (user) => {
        console.log('Created:', user)
      }
    })
  }
  
  return (
    <form onSubmit={handleSubmit}>
      {/* ... */}
    </form>
  )
}
```

### 分页查询

```typescript
import { useAuryPagination } from '@aurimyth/web-core/hooks'

function UserTable() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAuryPagination<User[]>(
    '/api/v1/users',
    page,
    10 // pageSize
  )
  
  // ...
}
```

## 错误处理

```typescript
import { AuryApiError } from '@aurimyth/web-core/types'

try {
  const users = await api.get('/api/v1/users')
} catch (error) {
  if (error instanceof AuryApiError) {
    console.log('业务错误:', error.code, error.message)
  }
}
```

## Mock 开发模式

启用 MSW 模拟后端：

```bash
# 安装
pnpm add -D msw
npx msw init public/

# 配置 .env.local
VITE_ENABLE_MOCK=true
```

在 `src/mocks/handlers.ts` 添加 mock handler，详见 `src/mocks/` 目录。
