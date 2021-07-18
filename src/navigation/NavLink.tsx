import type { LinkProps } from 'next/link'
import Link from 'next/link'
import type { ReactElement } from 'react'
import { Children, cloneElement } from 'react'

import type { RouteMatcher } from '@/navigation/useCurrentRoute'
import { useCurrentRoute } from '@/navigation/useCurrentRoute'

export interface NavLinkProps extends LinkProps {
  children: ReactElement
  isMatching?: RouteMatcher
}

/**
 * Navigation link, sets `aria-current`.
 */
export function NavLink(props: NavLinkProps): JSX.Element {
  const { href, isMatching, children } = props

  const isCurrent = useCurrentRoute(href, isMatching)

  const anchorElement = Children.only(children)

  return (
    <Link href={href}>
      {isCurrent
        ? cloneElement(anchorElement, {
            'aria-current': 'page',
          })
        : anchorElement}
    </Link>
  )
}
