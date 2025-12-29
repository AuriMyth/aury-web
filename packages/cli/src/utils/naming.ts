/**
 * Convert string to PascalCase
 * @example toPascalCase('user-profile') => 'UserProfile'
 * @example toPascalCase('userProfile') => 'UserProfile'
 */
export function toPascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (_, c) => c.toUpperCase())
}

/**
 * Convert string to camelCase
 * @example toCamelCase('user-profile') => 'userProfile'
 * @example toCamelCase('UserProfile') => 'userProfile'
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (_, c) => c.toLowerCase())
}

/**
 * Convert string to kebab-case
 * @example toKebabCase('userProfile') => 'user-profile'
 * @example toKebabCase('UserProfile') => 'user-profile'
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/**
 * Convert string to snake_case
 * @example toSnakeCase('userProfile') => 'user_profile'
 * @example toSnakeCase('UserProfile') => 'user_profile'
 */
export function toSnakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}
