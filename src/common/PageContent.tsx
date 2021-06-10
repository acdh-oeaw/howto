import type { ReactNode } from 'react'

export interface PageContentProps {
  children: ReactNode
  className?: string
}

/**
 * Wrapper for main page content.
 */
export function PageContent(props: PageContentProps): JSX.Element {
  const { children, className } = props

  return (
    <main id="main" tabIndex={-1} className={className}>
      {children}
    </main>
  )
}
