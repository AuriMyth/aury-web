import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query'
import { useAuryClient } from '../providers'

type AuryQueryOptions<T> = Omit<UseQueryOptions<T, Error, T, string[]>, 'queryKey' | 'queryFn'>

type AuryMutationOptions<TData, TVariables> = UseMutationOptions<TData, Error, TVariables> & {
  method?: 'post' | 'put' | 'patch' | 'delete'
}

/**
 * 查询数据 - 自动处理 BaseResponse
 * 
 * @example
 * ```tsx
 * const { data, isLoading } = useAuryApi<User[]>('/api/v1/users')
 * ```
 */
export function useAuryApi<T>(
  url: string,
  options?: AuryQueryOptions<T>
) {
  const client = useAuryClient()
  
  return useQuery<T, Error, T, string[]>({
    queryKey: [url],
    queryFn: () => client.get<T>(url),
    ...options,
  })
}

/**
 * 变更数据 - 自动处理 BaseResponse
 * 
 * @example
 * ```tsx
 * const { mutate, isPending } = useAuryMutation<User, CreateUserDto>('/api/v1/users')
 * mutate({ name: '张三' })
 * ```
 */
export function useAuryMutation<TData, TVariables>(
  url: string,
  options?: AuryMutationOptions<TData, TVariables>
) {
  const client = useAuryClient()
  const queryClient = useQueryClient()
  const { method = 'post', ...mutationOptions } = options || {}
  
  return useMutation<TData, Error, TVariables>({
    mutationFn: (data: TVariables) => client[method]<TData>(url, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [url] })
    },
    ...mutationOptions,
  })
}

/**
 * 分页查询
 */
export function useAuryPagination<T>(
  url: string,
  page: number,
  pageSize: number
) {
  const client = useAuryClient()
  
  return useQuery({
    queryKey: [url, 'pagination', page, pageSize],
    queryFn: () => client.get<T>(`${url}?page=${page}&pageSize=${pageSize}`),
  })
}
