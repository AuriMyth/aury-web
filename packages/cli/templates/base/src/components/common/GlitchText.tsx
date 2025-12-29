type GlitchTextProps = {
  text: string
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
}

/**
 * 故障效果文字组件
 * 
 * @example
 * <GlitchText text="SYSTEM ERROR" as="h1" className="text-4xl" />
 */
export function GlitchText({ 
  text, 
  className = '', 
  as: Component = 'span' 
}: GlitchTextProps) {
  return (
    <Component 
      className={`glitch uppercase tracking-widest ${className}`}
      data-text={text}
    >
      {text}
    </Component>
  )
}
