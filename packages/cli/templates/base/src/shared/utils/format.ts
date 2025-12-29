/**
 * 格式化工具函数
 */

/**
 * 格式化日期
 * 
 * @example
 * formatDate(new Date()) // "2024-01-01"
 * formatDate("2024-01-01T12:00:00Z", "YYYY年MM月DD日") // "2024年01月01日"
 */
export function formatDate(
  date: Date | string | number,
  format: string = 'YYYY-MM-DD'
): string {
  const d = new Date(date)
  
  if (isNaN(d.getTime())) {
    return 'Invalid Date'
  }

  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化相对时间
 * 
 * @example
 * formatRelativeTime(new Date(Date.now() - 60000)) // "1 分钟前"
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (years > 0) return `${years} 年前`
  if (months > 0) return `${months} 个月前`
  if (days > 0) return `${days} 天前`
  if (hours > 0) return `${hours} 小时前`
  if (minutes > 0) return `${minutes} 分钟前`
  return '刚刚'
}

/**
 * 格式化数字（千分位）
 * 
 * @example
 * formatNumber(1234567) // "1,234,567"
 * formatNumber(1234567.89, 2) // "1,234,567.89"
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

/**
 * 格式化货币
 * 
 * @example
 * formatCurrency(1234.56) // "¥1,234.56"
 * formatCurrency(1234.56, 'USD') // "$1,234.56"
 */
export function formatCurrency(
  amount: number,
  currency: 'CNY' | 'USD' | 'EUR' = 'CNY'
): string {
  const locales = {
    CNY: 'zh-CN',
    USD: 'en-US',
    EUR: 'de-DE',
  }

  return new Intl.NumberFormat(locales[currency], {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * 格式化文件大小
 * 
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1048576) // "1 MB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`
}

/**
 * 截断文本
 * 
 * @example
 * truncate("Hello World", 5) // "Hello..."
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str
  return str.slice(0, length) + suffix
}
