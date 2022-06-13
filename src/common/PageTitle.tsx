import type { ReactNode } from 'react'

export interface PageTitleProps {
  children: ReactNode
}

/**
 * Page title.
 */
export function PageTitle(props: PageTitleProps): JSX.Element {
  const { children } = props

  return (
    <h1 className="text-5xl font-black tracking-tighter 2xs:text-6xl xs:text-7xl">
      {children}
    </h1>
  )
}
