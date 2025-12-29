/**
 * MSW (Mock Service Worker) 请求处理器
 * 
 * 用于前端开发阶段模拟后端 API
 * 
 * 使用方法:
 * 1. 安装 MSW: pnpm add -D msw
 * 2. 初始化: npx msw init public/
 * 3. 在 main.tsx 中启动 (见下方注释)
 * 
 * @see https://mswjs.io/
 */

import { http, HttpResponse, delay } from 'msw'
import type { BaseResponse } from '@/types/api'

// ============ 辅助函数 ============

/**
 * 创建标准 BaseResponse 格式的响应
 */
function createResponse<T>(data: T, message = 'success'): BaseResponse<T> {
  return {
    code: 200,
    message,
    data,
    timestamp: new Date().toISOString(),
  }
}

/**
 * 创建错误响应
 */
function createErrorResponse(code: number, message: string): BaseResponse<null> {
  return {
    code,
    message,
    data: null,
    timestamp: new Date().toISOString(),
  }
}

// ============ Mock 数据 ============

const mockUsers = [
  { id: '1', name: '张三', email: 'zhangsan@example.com', createdAt: '2024-01-01' },
  { id: '2', name: '李四', email: 'lisi@example.com', createdAt: '2024-01-02' },
  { id: '3', name: '王五', email: 'wangwu@example.com', createdAt: '2024-01-03' },
]

// ============ 请求处理器 ============

export const handlers = [
  /**
   * 获取用户列表
   * GET /api/v1/users
   */
  http.get('/api/v1/users', async () => {
    // 模拟网络延迟
    await delay(500)
    
    return HttpResponse.json(createResponse(mockUsers))
  }),

  /**
   * 获取单个用户
   * GET /api/v1/users/:id
   */
  http.get('/api/v1/users/:id', async ({ params }) => {
    await delay(300)
    
    const user = mockUsers.find(u => u.id === params.id)
    
    if (!user) {
      return HttpResponse.json(
        createErrorResponse(404, 'User not found'),
        { status: 404 }
      )
    }
    
    return HttpResponse.json(createResponse(user))
  }),

  /**
   * 创建用户
   * POST /api/v1/users
   */
  http.post('/api/v1/users', async ({ request }) => {
    await delay(500)
    
    const body = await request.json() as { name: string; email: string }
    
    const newUser = {
      id: String(mockUsers.length + 1),
      name: body.name,
      email: body.email,
      createdAt: new Date().toISOString().split('T')[0],
    }
    
    mockUsers.push(newUser)
    
    return HttpResponse.json(createResponse(newUser, 'User created'), { status: 201 })
  }),

  /**
   * 删除用户
   * DELETE /api/v1/users/:id
   */
  http.delete('/api/v1/users/:id', async ({ params }) => {
    await delay(300)
    
    const index = mockUsers.findIndex(u => u.id === params.id)
    
    if (index === -1) {
      return HttpResponse.json(
        createErrorResponse(404, 'User not found'),
        { status: 404 }
      )
    }
    
    mockUsers.splice(index, 1)
    
    return HttpResponse.json(createResponse(null, 'User deleted'))
  }),

  // ============ 添加更多 handlers ============
  // 在这里添加你的业务 API mock
]
