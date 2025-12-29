// 与后端对齐的类型定义
export type BaseResponse<T = any> = {
  code: number
  message: string
  data: T
  timestamp?: string
}

export type PaginationResponse<T> = {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export class AuryApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public details?: any
  ) {
    super(message)
    this.name = 'AuryApiError'
  }
}
