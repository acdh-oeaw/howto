import Link from 'next/link'
import type { LinkProps } from 'next/link'

export interface PaginationProps {
  page: number
  pages: number
  href: (page: number) => LinkProps['href']
  label?: string
}

/**
 * Links to previous and next page of items.
 */
export function Pagination(props: PaginationProps): JSX.Element | null {
  const { page, pages, label, href } = props

  const hasPrevPage = page > 1
  const hasNextPage = page < pages

  if (!hasPrevPage && !hasNextPage) return null

  return (
    <nav aria-label={label} className="flex items-center justify-between my-12">
      <div>
        {hasPrevPage ? (
          <Link href={href(page - 1)}>
            <a
              className="p-2 transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
              rel="prev"
            >
              &larr; Previous Page
            </a>
          </Link>
        ) : null}
      </div>
      <div>
        {hasNextPage ? (
          <Link href={href(page + 1)}>
            <a
              className="p-2 transition rounded hover:text-primary-600 focus:outline-none focus-visible:ring focus-visible:ring-primary-600"
              rel="next"
            >
              Next Page &rarr;
            </a>
          </Link>
        ) : null}
      </div>
    </nav>
  )
}
