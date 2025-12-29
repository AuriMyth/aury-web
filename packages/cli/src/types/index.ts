export interface InitOptions {
  projectName?: string
  template?: string
  pm?: 'npm' | 'pnpm' | 'yarn' | 'bun'
  components?: 'minimal' | 'standard' | 'full'
  skipComponents?: boolean
  skipGit?: boolean
  skipInstall?: boolean
}

export interface ThemeConfig {
  name: string
  displayName: string
  description: string
  author: string
  version: string
}

export interface ProjectConfig {
  theme: string
  version: string
  components: string[]
  createdAt: string
}
