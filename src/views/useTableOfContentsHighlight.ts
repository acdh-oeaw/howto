import { useEffect, useState } from 'react'

import { headingAnchorClassName } from '@/mdx/config'

/**
 * Highlights table of contents entry corresponding to current scroll position.
 */
export function useTableOfContentsHighlight(): string | undefined {
  const [firstHeadingInViewport, setFirstHeadingInViewport] = useState<string>()

  const topOffset = 0

  useEffect(() => {
    function getFirstHeadingInViewport() {
      const headings = Array.from(
        document.getElementsByClassName(headingAnchorClassName),
      )

      const firstHeadingInViewport =
        headings.find((heading) => {
          return heading.getBoundingClientRect().top >= topOffset
        }) ?? headings[headings.length - 1]

      setFirstHeadingInViewport(firstHeadingInViewport?.id)
    }

    getFirstHeadingInViewport()

    document.addEventListener('resize', getFirstHeadingInViewport, {
      passive: true,
    })
    document.addEventListener('scroll', getFirstHeadingInViewport, {
      passive: true,
    })

    return () => {
      document.removeEventListener('resize', getFirstHeadingInViewport)
      document.removeEventListener('scroll', getFirstHeadingInViewport)
    }
  }, [])

  return firstHeadingInViewport
}
