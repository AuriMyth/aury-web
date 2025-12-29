import axios, { AxiosInstance, AxiosRequestConfig, CreateAxiosDefaults } from 'axios'
import { BaseResponse, AuryApiError } from '../types'

export type AuryApiClientConfig = {
  baseURL?: string
  timeout?: number
  headers?: Record<string, string>
  successCode?: number
} & Omit<CreateAxiosDefaults, 'baseURL' | 'timeout' | 'headers'>

export class AuryApiClient {
  private client: AxiosInstance
  private successCode: number

  constructor(config: AuryApiClientConfig = {}) {
    const {
      baseURL,
      timeout = 10000,
      headers = { 'Content-Type': 'application/json' },
      successCode = 0,
      ...axiosConfig
    } = config

    this.successCode = successCode
    this.client = axios.create({
      baseURL: baseURL || import.meta.env?.VITE_API_BASE_URL || '',
      timeout,
      headers,
      ...axiosConfig,
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.response.use(
      (response) => {
        const data = response.data as BaseResponse
        
        if (data.code === undefined) {
          return data
        }
        
        if (data.code !== this.successCode) {
          throw new AuryApiError(data.code, data.message)
        }
        
        return data.data
      },
      (error) => {
        const code = error.response?.status || -1
        const message = error.response?.data?.message || error.message
        throw new AuryApiError(code, message, error.response?.data)
      }
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config)
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config)
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config)
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config)
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.patch(url, data, config)
  }

  get axios() {
    return this.client
  }
}

export const auryApi = new AuryApiClient()
