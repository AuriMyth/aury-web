import { Github, Twitter } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-primary/30 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-xs text-muted-foreground font-mono">
            <span className="text-primary">$</span> echo "© {currentYear} AURY_WEB"
            <span className="terminal-cursor" />
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>

          {/* Version */}
          <div className="text-xs text-muted-foreground font-mono">
            v0.1.0 <span className="text-primary">//</span> CYBERPUNK_EDITION
          </div>
        </div>

        {/* Decorative Line */}
        <div className="cyber-divider mt-8" />
        
        {/* ASCII Art Footer */}
        <div className="mt-4 text-center text-[10px] text-muted-foreground/50 font-mono leading-tight hidden md:block">
          <pre>{`
╔══════════════════════════════════════════════════════════════════╗
║  POWERED BY REACT 19 · VITE 6 · TANSTACK · TAILWIND CSS v4      ║
╚══════════════════════════════════════════════════════════════════╝
          `}</pre>
        </div>
      </div>
    </footer>
  )
}
