/**
 * MSW Mock 模块
 * 
 * 启用 Mock 的方法:
 * 
 * 1. 安装依赖:
 *    pnpm add -D msw
 * 
 * 2. 初始化 Service Worker:
 *    npx msw init public/
 * 
 * 3. 在 main.tsx 中启动:
 *    ```typescript
 *    async function enableMocking() {
 *      if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK === 'true') {
 *        const { worker } = await import('./mocks/browser')
 *        return worker.start({ onUnhandledRequest: 'bypass' })
 *      }
 *    }
 *    
 *    enableMocking().then(() => {
 *      ReactDOM.createRoot(document.getElementById('root')!).render(...)
 *    })
 *    ```
 * 
 * 4. 在 .env 中配置:
 *    VITE_ENABLE_MOCK=true
 * 
 * 5. 在 handlers.ts 中添加你的 API mock
 */

export { handlers } from './handlers'
export { worker } from './browser'
