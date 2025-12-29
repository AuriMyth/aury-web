export * from './api'

/**
 * 用户信息
 */
export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  created_at: string
}

/**
 * 主题模式
 */
export type Theme = 'light' | 'dark' | 'system'
