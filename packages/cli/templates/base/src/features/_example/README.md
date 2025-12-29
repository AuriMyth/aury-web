# Feature 模块示例

这是一个 Feature 模块的示例结构，展示如何按业务领域组织代码。

## 目录结构

```
features/users/
├── components/       # 私有组件
│   ├── UserList.tsx
│   └── UserCard.tsx
├── hooks/            # 私有 hooks
│   ├── useUsers.ts
│   └── useCreateUser.ts
├── api.ts            # API 请求（可选，如果需要脱离 hooks）
├── types.ts          # 类型定义
└── index.ts          # 统一导出
```

## 使用示例

### types.ts

```typescript
export type User = {
  id: string
  name: string
  email: string
  createdAt: string
}

export type CreateUserDto = {
  name: string
  email: string
}
```

### hooks/useUsers.ts

```typescript
import { useAuryApi, useAuryMutation } from '@aury/web-core/hooks'
import type { User, CreateUserDto } from '../types'

export function useUsers() {
  return useAuryApi<User[]>('/api/v1/users')
}

export function useCreateUser() {
  return useAuryMutation<User, CreateUserDto>('/api/v1/users')
}
```

### components/UserList.tsx

```typescript
import { useUsers } from '../hooks/useUsers'

export function UserList() {
  const { data: users, isLoading, error } = useUsers()
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### index.ts

```typescript
// Types
export * from './types'

// Hooks
export * from './hooks/useUsers'

// Components
export { UserList } from './components/UserList'
```

## 在页面中使用

```typescript
// src/routes/users/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { UserList } from '@/features/users'

export const Route = createFileRoute('/users/')({
  component: UsersPage
})

function UsersPage() {
  return (
    <div>
      <h1>用户列表</h1>
      <UserList />
    </div>
  )
}
```
