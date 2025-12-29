import { createFileRoute } from '@tanstack/react-router'
import { Zap, Route as RouteIcon, Palette, Terminal } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center p-8 relative">
        {/* Decorative corner */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary opacity-50" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary opacity-50" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Terminal Header */}
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-primary/30 bg-card/50 chamfer-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-primary font-mono uppercase tracking-widest">
              System Online
            </span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-wider">
            <span className="glitch neon-glow text-primary" data-text="Welcome to">
              Welcome to
            </span>
            <br />
            <span className="text-cyber-gradient">
              {{PROJECT_NAME}}
            </span>
          </h1>
          
          {/* Cyber Divider */}
          <div className="cyber-divider max-w-md mx-auto" />
          
          {/* Description */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-mono">
            &gt; A modern React application powered by{' '}
            <span className="text-primary">Vite</span>,{' '}
            <span className="text-secondary">TanStack Router</span>, and{' '}
            <span className="text-accent">Tailwind CSS</span>
            <span className="terminal-cursor" />
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button className="cyber-btn chamfer-sm px-8 py-3 bg-primary text-primary-foreground neon-glow">
              Initialize
            </button>
            <button className="cyber-btn chamfer-sm px-8 py-3 border border-primary/50 text-primary hover:bg-primary/10">
              Documentation
            </button>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-24 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 text-xs uppercase tracking-widest text-primary border border-primary/30 bg-primary/5 chamfer-sm mb-4">
              Core Systems
            </span>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider">
              <span className="text-cyber-gradient">Tech Stack</span>
            </h2>
          </div>
          
          {/* Feature Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="cyber-card chamfer p-6 corner-decor group hover:border-primary/60 transition-colors">
              <div className="w-12 h-12 flex items-center justify-center bg-primary/20 text-primary mb-4 chamfer-sm group-hover:neon-glow transition-all">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider text-primary mb-2">
                Vite
              </h3>
              <p className="text-muted-foreground font-mono text-sm">
                Lightning-fast HMR and optimized builds. Next generation frontend tooling.
              </p>
              <div className="mt-4 text-xs text-primary/60 font-mono">
                [STATUS: ACTIVE]
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="cyber-card chamfer p-6 corner-decor group hover:border-secondary/60 transition-colors">
              <div className="w-12 h-12 flex items-center justify-center bg-secondary/20 text-secondary mb-4 chamfer-sm group-hover:neon-glow transition-all">
                <RouteIcon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider text-secondary mb-2">
                TanStack Router
              </h3>
              <p className="text-muted-foreground font-mono text-sm">
                Type-safe routing with file-based routes and powerful data loading.
              </p>
              <div className="mt-4 text-xs text-secondary/60 font-mono">
                [STATUS: ACTIVE]
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="cyber-card chamfer p-6 corner-decor group hover:border-accent/60 transition-colors">
              <div className="w-12 h-12 flex items-center justify-center bg-accent/20 text-accent mb-4 chamfer-sm group-hover:neon-glow transition-all">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-wider text-accent mb-2">
                Tailwind CSS
              </h3>
              <p className="text-muted-foreground font-mono text-sm">
                Utility-first CSS framework for rapid UI development.
              </p>
              <div className="mt-4 text-xs text-accent/60 font-mono">
                [STATUS: ACTIVE]
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 px-8 border-t border-primary/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="cyber-card chamfer p-12 relative overflow-hidden">
            {/* Background effect */}
            <div className="absolute inset-0 holographic opacity-5" />
            
            <div className="relative z-10">
              <Terminal className="w-12 h-12 text-primary mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-wider mb-4">
                Ready to <span className="text-cyber-gradient">hack the mainframe</span>?
              </h2>
              <p className="text-muted-foreground font-mono mb-8">
                Check out the documentation to learn more about the stack.
              </p>
              <button className="cyber-btn chamfer-sm px-8 py-3 bg-primary text-primary-foreground neon-glow pulse-border">
                Access Documentation
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-8 border-t border-primary/20">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground font-mono text-sm">
            <span className="text-primary">&lt;</span>
            Built with Aury Web
            <span className="text-primary">/&gt;</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
