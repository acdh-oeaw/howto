import type { ReactNode } from 'react'
import { Fragment } from 'react'

import { PageFooter } from '@/common/PageFooter'
import { PageHeader } from '@/common/PageHeader'
import { SkipLink } from '@/common/SkipLink'

export interface PageLayoutProps {
  children: ReactNode
}

/**
 * Default page layout.
 */
export function PageLayout(props: PageLayoutProps): JSX.Element {
  const { children } = props

  return (
    <Fragment>
      <SkipLink />
      <div className="grid min-h-screen grid-rows-page-layout">
        <PageHeader />
        {children}
        <PageFooter />
      </div>
    </Fragment>
  )
}
