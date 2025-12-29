import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Route as RouteIcon, Palette } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Radial glow background */}
      <div className="radial-glow radial-glow-lg absolute top-1/4 left-1/2 -translate-x-1/2" />
      
      {/* Hero Section */}
      <section className="section-padding relative">
        <div className="container-narrow">
          <div className="grid-asymmetric-hero items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              {/* Section Label */}
              <div className="section-label">
                <span className="dot dot-pulse" />
                <span>Welcome</span>
              </div>
              
              {/* Headline */}
              <h1 className="hero-headline">
                Build something{' '}
                <span className="gradient-text gradient-underline">amazing</span>
              </h1>
              
              {/* Description */}
              <p className="text-xl text-muted-foreground max-w-lg text-balance">
                A modern React application powered by Vite, TanStack Router, 
                and Tailwind CSS. Start building your next great idea.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">
                  Get Started
                  <ArrowRight className="w-4 h-4 arrow" />
                </button>
                <button className="btn-secondary">
                  Documentation
                </button>
              </div>
            </div>
            
            {/* Right: Visual */}
            <div className="relative hidden lg:block">
              <div className="relative w-80 h-80 mx-auto">
                {/* Rotating ring */}
                <div className="absolute inset-0 dashed-ring animate-rotate-slow" />
                
                {/* Floating cards */}
                <div className="absolute top-8 left-8 card-minimal p-4 animate-float shadow-accent">
                  <div className="icon-gradient mb-3">
                    <Zap className="w-5 h-5" />
                  </div>
                  <p className="font-medium">Lightning Fast</p>
                </div>
                
                <div className="absolute bottom-8 right-8 card-minimal p-4 animate-float-delayed shadow-accent">
                  <div className="icon-gradient mb-3">
                    <RouteIcon className="w-5 h-5" />
                  </div>
                  <p className="font-medium">Type-Safe</p>
                </div>
                
                {/* Center icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="icon-gradient icon-gradient-lg shadow-accent-lg">
                    <Palette className="w-8 h-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="section-padding section-inverted dot-pattern">
        <div className="container-narrow">
          <div className="text-center mb-16">
            <div className="section-label mx-auto mb-6 border-white/20 bg-white/5">
              <span className="dot" />
              <span className="text-white/80">Features</span>
            </div>
            <h2 className="section-headline">
              Everything you need
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {/* Feature 1 */}
            <div className="card-elevated bg-white/5 border-white/10 hover:bg-white/10">
              <div className="icon-gradient mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Vite</h3>
              <p className="text-white/70">
                Lightning-fast HMR and optimized builds for the best developer experience.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="card-elevated bg-white/5 border-white/10 hover:bg-white/10">
              <div className="icon-gradient mb-4">
                <RouteIcon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold mb-2">TanStack Router</h3>
              <p className="text-white/70">
                Type-safe routing with file-based routes and powerful data loading.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="card-elevated bg-white/5 border-white/10 hover:bg-white/10">
              <div className="icon-gradient mb-4">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Tailwind CSS</h3>
              <p className="text-white/70">
                Utility-first CSS framework for rapid UI development.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-narrow text-center">
          <h2 className="section-headline mb-6">
            Ready to <span className="gradient-text">start building</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Check out the documentation to learn more about the stack and best practices.
          </p>
          <button className="btn-primary">
            Read the Docs
            <ArrowRight className="w-4 h-4 arrow" />
          </button>
        </div>
      </section>
    </div>
  )
}
