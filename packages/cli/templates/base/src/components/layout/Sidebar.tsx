import { Link } from '@tanstack/react-router'
import { Home, FileText, Settings, Users, Database, ChevronRight, Terminal } from 'lucide-react'
import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'

type SidebarItem = {
  icon: LucideIcon
  label: string
  href: string
}

const sidebarItems: SidebarItem[] = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'Users', href: '/users' },
  { icon: Database, label: 'Data', href: '/data' },
  { icon: FileText, label: 'Docs', href: '/docs' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

type SidebarProps = {
  collapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  return (
    <aside
      className={`
        fixed left-0 top-16 bottom-0 z-40
        border-r border-primary/30 bg-background/80 backdrop-blur-md
        transition-all duration-300 ease-out
        ${collapsed ? 'w-16' : 'w-64'}
      `}
    >
      {/* Header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-primary/20">
        {!collapsed && (
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">
            Navigation
          </span>
        )}
        <button
          onClick={onToggle}
          className="p-1 text-muted-foreground hover:text-primary transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform ${collapsed ? '' : 'rotate-180'}`}
          />
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="p-2 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isHovered = hoveredItem === item.href

          return (
            <Link
              key={item.href}
              to={item.href}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-sm
                text-sm font-medium text-muted-foreground
                transition-all duration-200
                hover:text-primary hover:bg-primary/10
                ${isHovered ? 'neon-border' : ''}
              `}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 uppercase tracking-wider text-xs">
                    {item.label}
                  </span>
                  {isHovered && (
                    <span className="text-primary text-xs">{'>'}</span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary/20">
          <div className="cyber-card p-3">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="text-xs font-mono text-muted-foreground">
                SYSTEM STATUS
              </span>
            </div>
            <div className="space-y-1 text-[10px] font-mono text-muted-foreground/70">
              <div className="flex justify-between">
                <span>CPU:</span>
                <span className="text-primary">12%</span>
              </div>
              <div className="flex justify-between">
                <span>MEM:</span>
                <span className="text-accent">48%</span>
              </div>
              <div className="flex justify-between">
                <span>NET:</span>
                <span className="text-secondary">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
