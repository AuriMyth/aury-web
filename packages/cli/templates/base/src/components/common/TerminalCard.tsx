import { Terminal, Minus, X, Square } from 'lucide-react'
import type { ReactNode } from 'react'

type TerminalCardProps = {
  title?: string
  children: ReactNode
  className?: string
}

/**
 * 终端风格卡片组件
 * 
 * @example
 * <TerminalCard title="system.log">
 *   <p>Initializing...</p>
 *   <p className="text-primary">Done!</p>
 * </TerminalCard>
 */
export function TerminalCard({ title = 'terminal', children, className = '' }: TerminalCardProps) {
  return (
    <div className={`cyber-card chamfer overflow-hidden ${className}`}>
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-primary/10 border-b border-primary/30">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-primary/20 rounded transition-colors">
            <Minus className="h-3 w-3 text-muted-foreground" />
          </button>
          <button className="p-1 hover:bg-primary/20 rounded transition-colors">
            <Square className="h-3 w-3 text-muted-foreground" />
          </button>
          <button className="p-1 hover:bg-destructive/20 rounded transition-colors">
            <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 font-mono text-sm leading-relaxed">
        <div className="text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  )
}
