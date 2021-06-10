import type { ReactNode } from 'react'

import { PageFooter } from '@/common/PageFooter'
import { PageHeader } from '@/common/PageHeader'

export interface PageLayoutProps {
  children: ReactNode
}

/**
 * Default page layout.
 */
export function PageLayout(props: PageLayoutProps): JSX.Element {
  const { children } = props

  return (
    <div className="min-h-screen grid grid-rows-page-layout">
      <PageHeader />
      {children}
      <PageFooter />
    </div>
  )
}
