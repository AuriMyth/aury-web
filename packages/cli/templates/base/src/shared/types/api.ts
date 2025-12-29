// 基础类型从 @aury/web-core 导入
export { BaseResponse, PaginationResponse, AuryApiError } from '@aury/web-core/types'

/**
 * 分页请求参数
 */
export type PaginationRequest = {
  page?: number
  size?: number
  sort?: string
  order?: 'asc' | 'desc'
}
