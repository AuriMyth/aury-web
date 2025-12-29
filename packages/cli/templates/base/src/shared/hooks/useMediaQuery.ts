import { useState, useEffect } from 'react'

/**
 * 媒体查询 Hook
 * 
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)')
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
 * const isReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches
    }
    return false
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    function handleChange(event: MediaQueryListEvent) {
      setMatches(event.matches)
    }

    // 初始化
    setMatches(mediaQuery.matches)

    // 监听变化
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}

// 预设的常用断点
export const breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
}
