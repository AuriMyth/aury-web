import { Link } from '@tanstack/react-router'
import { Menu, X, Terminal } from 'lucide-react'
import { useState } from 'react'

type NavItem = {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '/about' },
  { label: 'DOCS', href: '/docs' },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-primary/30 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <Terminal className="h-6 w-6 text-primary group-hover:animate-pulse" />
            <span className="text-lg font-bold uppercase tracking-widest text-cyber-gradient">
              AURY<span className="text-primary">_</span>WEB
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="px-4 py-2 text-sm font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-primary hover:bg-primary/10 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Status Indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <span className="status-online pl-4">SYSTEM ONLINE</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-primary/30 bg-background/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors chamfer-sm"
              >
                {'>'} {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
