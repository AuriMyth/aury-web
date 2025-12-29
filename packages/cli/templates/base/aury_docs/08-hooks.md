# 08 - 自定义 Hooks

## 内置 Hooks

### useLocalStorage

持久化存储：

```typescript
import { useLocalStorage } from '@/hooks'

function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark')
  
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      当前主题: {theme}
    </button>
  )
}
```

### useWindowSize

窗口尺寸：

```typescript
import { useWindowSize } from '@/hooks'

function ResponsiveComponent() {
  const { width, height } = useWindowSize()
  const isMobile = width < 768
  
  return isMobile ? <MobileView /> : <DesktopView />
}
```

### useDebounce

防抖：

```typescript
import { useDebounce } from '@/hooks'

function SearchInput() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  
  useEffect(() => {
    // 只有在用户停止输入 500ms 后才执行搜索
    if (debouncedSearch) {
      performSearch(debouncedSearch)
    }
  }, [debouncedSearch])
  
  return <input value={search} onChange={e => setSearch(e.target.value)} />
}
```

### useMediaQuery

媒体查询：

```typescript
import { useMediaQuery, breakpoints } from '@/hooks'

function Component() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isDesktop = useMediaQuery(breakpoints.lg)
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  
  // ...
}
```

## @aurimyth/web-core Hooks

### useAuryApi

查询数据：

```typescript
import { useAuryApi } from '@aurimyth/web-core/hooks'

const { data, isLoading, error, refetch } = useAuryApi<User[]>('/api/v1/users')
```

### useAuryMutation

变更数据：

```typescript
import { useAuryMutation } from '@aurimyth/web-core/hooks'

const { mutate, isPending } = useAuryMutation<User, CreateUserDto>('/api/v1/users', {
  method: 'post',  // 'post' | 'put' | 'patch' | 'delete'
  onSuccess: (data) => console.log('Success:', data),
  onError: (error) => console.log('Error:', error),
})

// 调用
mutate({ name: '张三' })
```

### useAuryPagination

分页查询：

```typescript
import { useAuryPagination } from '@aurimyth/web-core/hooks'

const { data, isLoading } = useAuryPagination<User[]>('/api/v1/users', page, pageSize)
```

## 创建自定义 Hook

### 命名规范

- 以 `use` 开头
- 驼峰命名
- 放在 `src/hooks/` 或对应的 `features/xxx/hooks/`

### 示例：useToggle

```typescript
// src/hooks/useToggle.ts
import { useState, useCallback } from 'react'

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue)
  
  const toggle = useCallback(() => setValue(v => !v), [])
  const setTrue = useCallback(() => setValue(true), [])
  const setFalse = useCallback(() => setValue(false), [])
  
  return { value, toggle, setTrue, setFalse }
}

// 使用
const { value: isOpen, toggle, setFalse: close } = useToggle()
```

### 示例：usePrevious

```typescript
// src/hooks/usePrevious.ts
import { useRef, useEffect } from 'react'

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>()
  
  useEffect(() => {
    ref.current = value
  }, [value])
  
  return ref.current
}

// 使用
const count = 5
const prevCount = usePrevious(count) // 4
```
