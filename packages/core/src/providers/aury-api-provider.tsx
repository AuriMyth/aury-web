import { createContext, useContext, ReactNode } from 'react'
import { AuryApiClient, auryApi } from '../api'

const AuryApiContext = createContext<AuryApiClient>(auryApi)

export type AuryApiProviderProps = {
  client: AuryApiClient
  children: ReactNode
}

/**
 * 全局 API Client Provider
 * 
 * @example
 * ```tsx
 * import { AuryApiProvider } from '@aury/web-core/providers'
 * import { api } from './lib/api-client'
 * 
 * <AuryApiProvider client={api}>
 *   <App />
 * </AuryApiProvider>
 * ```
 */
export function AuryApiProvider({ client, children }: AuryApiProviderProps) {
  return (
    <AuryApiContext.Provider value={client}>
      {children}
    </AuryApiContext.Provider>
  )
}

/**
 * 获取当前 API Client 实例
 */
export function useAuryClient() {
  return useContext(AuryApiContext)
}
