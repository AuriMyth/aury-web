# 03 - 状态管理详解

## 状态管理策略

本项目采用 **分层状态管理**：

1. **服务端状态**: TanStack Query (React Query)
2. **全局客户端状态**: Zustand
3. **表单状态**: React Hook Form
4. **URL 状态**: TanStack Router

## TanStack Query (服务端状态)

### 基础使用

#### 查询数据 (useQuery)
```typescript
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => apiClient.get('/users'),
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 10 * 60 * 1000,   // 10分钟
  })
}

// 组件中使用
function UserList() {
  const { data, isLoading, error } = useUsers()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

#### 变更数据 (useMutation)
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useCreateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserDto) => apiClient.post('/users', data),
    onSuccess: () => {
      // 刷新用户列表
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

// 使用
function CreateUserForm() {
  const { mutate, isPending } = useCreateUser()

  const handleSubmit = (data: CreateUserDto) => {
    mutate(data, {
      onSuccess: () => alert('User created!'),
      onError: (error) => alert(error.message),
    })
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

### 高级用法

#### 乐观更新
```typescript
export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (user: User) => apiClient.put(`/users/${user.id}`, user),
    onMutate: async (newUser) => {
      // 取消正在进行的查询
      await queryClient.cancelQueries({ queryKey: ['users'] })

      // 保存之前的数据
      const previousUsers = queryClient.getQueryData(['users'])

      // 乐观更新
      queryClient.setQueryData(['users'], (old: User[]) =>
        old.map(u => u.id === newUser.id ? newUser : u)
      )

      return { previousUsers }
    },
    onError: (err, newUser, context) => {
      // 回滚
      queryClient.setQueryData(['users'], context?.previousUsers)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}
```

#### 分页查询
```typescript
export function useUsersPaginated(page: number) {
  return useQuery({
    queryKey: ['users', 'paginated', page],
    queryFn: () => apiClient.get(`/users?page=${page}`),
    keepPreviousData: true,
  })
}
```

#### 无限滚动
```typescript
import { useInfiniteQuery } from '@tanstack/react-query'

export function useUsersInfinite() {
  return useInfiniteQuery({
    queryKey: ['users', 'infinite'],
    queryFn: ({ pageParam = 1 }) => 
      apiClient.get(`/users?page=${pageParam}`),
    getNextPageParam: (lastPage, pages) => 
      lastPage.hasMore ? pages.length + 1 : undefined,
  })
}

// 使用
function InfiniteUserList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = 
    useUsersInfinite()

  return (
    <>
      {data?.pages.map((page) =>
        page.items.map((user) => <div key={user.id}>{user.name}</div>)
      )}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          Load More
        </button>
      )}
    </>
  )
}
```

## Zustand (全局状态)

### 基础 Store

```typescript
// src/stores/theme.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ThemeState = {
  mode: 'light' | 'dark'
  setMode: (mode: 'light' | 'dark') => void
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'dark',
      setMode: (mode) => set({ mode }),
      toggle: () => set((state) => ({ 
        mode: state.mode === 'dark' ? 'light' : 'dark' 
      })),
    }),
    { name: 'theme-storage' }
  )
)
```

### 使用 Store

```typescript
function ThemeToggle() {
  const { mode, toggle } = useThemeStore()

  return (
    <button onClick={toggle}>
      {mode === 'dark' ? '🌙' : '☀️'}
    </button>
  )
}

// 只订阅部分状态
function ModeDisplay() {
  const mode = useThemeStore((state) => state.mode)
  return <div>{mode}</div>
}
```

### Slices 模式 (大型 Store)

```typescript
// src/stores/app.ts
import { create } from 'zustand'

type UserSlice = {
  user: User | null
  setUser: (user: User) => void
}

type UISlice = {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

const createUserSlice = (set): UserSlice => ({
  user: null,
  setUser: (user) => set({ user }),
})

const createUISlice = (set): UISlice => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
})

export const useAppStore = create<UserSlice & UISlice>()((...a) => ({
  ...createUserSlice(...a),
  ...createUISlice(...a),
}))
```

## React Hook Form (表单状态)

详见 [07-forms.md](./07-forms.md)

## 状态管理最佳实践

### 1. 优先使用 TanStack Query
```typescript
// ✅ 推荐: 服务端数据用 TanStack Query
const { data: users } = useQuery({ queryKey: ['users'], ... })

// ❌ 避免: 用 Zustand 存储服务端数据
const users = useStore(state => state.users)
```

### 2. 最小化全局状态
```typescript
// ✅ 只存储真正需要全局共享的状态
type AppState = {
  theme: 'light' | 'dark'
  user: User | null
  sidebarOpen: boolean
}

// ❌ 避免存储组件局部状态
type AppState = {
  theme: 'light' | 'dark'
  user: User | null
  // ❌ 这些应该是局部状态
  modalOpen: boolean
  selectedTab: string
}
```

### 3. 使用选择器避免重渲染
```typescript
// ✅ 只订阅需要的状态
const userName = useUserStore((state) => state.user?.name)

// ❌ 订阅整个对象会导致不必要的重渲染
const user = useUserStore((state) => state.user)
```

---

**下一步**: 阅读 [04-routing.md](./04-routing.md) 了解路由系统。
