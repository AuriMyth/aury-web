import type { ButtonHTMLAttributes, ReactNode } from 'react'

type NeonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'accent' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

const variantStyles = {
  primary: 'border-primary text-primary hover:bg-primary hover:text-primary-foreground hover:shadow-[0_0_20px_var(--primary)]',
  secondary: 'border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground hover:shadow-[0_0_20px_var(--secondary)]',
  accent: 'border-accent text-accent hover:bg-accent hover:text-accent-foreground hover:shadow-[0_0_20px_var(--accent)]',
  destructive: 'border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground hover:shadow-[0_0_20px_var(--destructive)]',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

/**
 * 霓虹风格按钮组件
 * 
 * @example
 * <NeonButton variant="primary" size="lg">
 *   CONNECT
 * </NeonButton>
 */
export function NeonButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}: NeonButtonProps) {
  return (
    <button
      className={`
        cyber-btn chamfer-sm
        border-2 bg-transparent
        font-mono uppercase tracking-widest
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
