import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-center mb-2">
            Welcome to {{PROJECT_NAME}}
          </CardTitle>
          <CardDescription className="text-center text-lg">
            A modern React application powered by Vite, TanStack Router, and Tailwind CSS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">⚡ Vite</h3>
              <p className="text-sm text-muted-foreground">Lightning-fast HMR and builds</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🚦 TanStack Router</h3>
              <p className="text-sm text-muted-foreground">Type-safe routing solution</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold mb-2">🎨 Tailwind CSS</h3>
              <p className="text-sm text-muted-foreground">Utility-first styling</p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Button>Get Started</Button>
            <Button variant="outline">Documentation</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
