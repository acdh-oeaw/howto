import cx from 'clsx'
import type { ReactNode } from 'react'

import { mainContentId } from '@/common/SkipLink'

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
    <main
      id={mainContentId}
      tabIndex={-1}
      className={cx(
        className,
        'focus:outline-none focus-visible:ring-inset focus-visible:ring focus-visible:ring-brand-blue',
      )}
    >
      {children}
    </main>
  )
}
