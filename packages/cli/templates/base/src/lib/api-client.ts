import { AuryApiClient } from '@aurimyth/web-core/api'

/**
 * API 客户端配置
 * 
 * 自动处理后端 BaseResponse 格式：
 * - code !== successCode 时抛出 AuryApiError
 * - 成功时自动返回 data 字段
 */
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

// 添加响应拦截器：处理 401
api.axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
