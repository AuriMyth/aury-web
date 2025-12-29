# {{PROJECT_NAME}}

A modern React application built with Aury Web.

## Tech Stack

- **React 19** - Latest React with improved performance
- **Vite 6** - Lightning-fast build tool
- **TanStack Router v1** - Type-safe file-based routing
- **TanStack Query v5** - Powerful data fetching
- **@aurimyth/web-core** - Backend integration utilities
- **Tailwind CSS v4** - Utility-first CSS with Lightning CSS
- **Shadcn UI** - Beautiful, accessible components
- **TypeScript 5.7+** - Full type safety
- **Cyberpunk Theme** - Neon colors, glitch effects, scanlines

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## @aurimyth/web-core

This project uses `@aurimyth/web-core` for seamless backend integration:

- **Automatic BaseResponse handling** - No manual unwrapping
- **Type-safe API calls** - Full TypeScript support
- **Built on TanStack Query** - Powerful caching and state management

### Quick Example

```typescript
import { useAuryApi } from '@aurimyth/web-core/hooks'

function UserList() {
  // Automatically handles BaseResponse { code, message, data }
  const { data, isLoading } = useAuryApi<User[]>('/users')
  
  return <div>{data?.map(user => ...)}</div>
}
```

See [AGENTS.md](./AGENTS.md) for complete development guide.

## Project Structure

```
src/
├── routes/          # File-based routing
├── components/
│   ├── ui/          # Shadcn UI components
│   ├── layout/      # Layout components
│   └── custom/      # Custom Cyberpunk components
├── hooks/           # Custom React hooks
├── stores/          # Zustand global state
├── lib/             # Utilities
└── types/           # TypeScript types
```

## Documentation

- **[AGENTS.md](./AGENTS.md)** - AI development guide
- **[aury_docs/](./aury_docs/)** - Detailed documentation

## License

MIT
