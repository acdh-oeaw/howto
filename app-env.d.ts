/// <reference types="@stefanprobst/next-svg" />

declare module '*.mdx' {
  import type { ComponentType } from 'react'

  const Component: ComponentType
  const metadata: Record<string, unknown>

  export { metadata }
  export default Component
}

declare module 'lqip' {
  export function base64(filePath: string): Promise<string>
}
