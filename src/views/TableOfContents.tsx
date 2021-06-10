// import { Svg as ChevronIcon } from '@/assets/icons/chevron.svg'
// import { Icon } from '@/common/Icon'
import type { Toc } from '@stefanprobst/rehype-extract-toc'
import cx from 'clsx'
import Link from 'next/link'

import { useTableOfContentsHighlight } from '@/views/useTableOfContentsHighlight'

export interface TableOfContentsProps {
  /**
   * Table of contents.
   */
  toc: Toc
  /**
   * Optional heading. Should be wrapped in an appropriate heading element.
   */
  title?: JSX.Element
  /**
   * Label for the `nav` element. Defaults to "Table of contents".
   */
  'aria-label'?: string
  className?: string
}

/**
 * Table of contents.
 */
export function TableOfContents(props: TableOfContentsProps): JSX.Element {
  const highlightedHeadingId = useTableOfContentsHighlight()
  const title = props.title ?? null
  const label = props['aria-label'] ?? 'Table of contents'

  return (
    <nav aria-label={label} className={props.className}>
      {title}
      <TableOfContentsLevel
        headings={props.toc}
        highlightedHeadingId={highlightedHeadingId}
      />
    </nav>
  )
}

interface TableOfContentsLevelProps {
  /**
   * Table of contents branch.
   */
  headings: Toc | undefined
  /**
   * Id of top heading in viewport.
   */
  highlightedHeadingId: string | undefined
  depth?: number
}

/**
 * Table of contents level.
 */
function TableOfContentsLevel(
  props: TableOfContentsLevelProps,
): JSX.Element | null {
  if (!Array.isArray(props.headings) || props.headings.length === 0) {
    return null
  }

  const depth = props.depth ?? 0

  return (
    <ol className="space-y-1.5" style={{ marginLeft: depth * 8 }}>
      {props.headings.map((heading, index) => {
        const isHighlighted = heading.id === props.highlightedHeadingId

        return (
          <li key={index} className="space-y-1.5">
            {heading.id !== undefined ? (
              <Link href={{ hash: heading.id }}>
                <a
                  className={cx(
                    'flex transition hover:text-primary-600 relative focus:outline-none rounded focus-visible:ring focus-visible:ring-primary-600',
                    isHighlighted ? 'font-bold pointer-events-none' : undefined,
                  )}
                >
                  {isHighlighted
                    ? // <Icon
                      //   icon={ChevronIcon}
                      //   className="absolute w-3.5 transform -rotate-90 right-full h-full mr-1"
                      // />
                      null
                    : null}
                  {heading.value}
                </a>
              </Link>
            ) : (
              <span>{heading.value}</span>
            )}
            <TableOfContentsLevel
              headings={heading.children}
              highlightedHeadingId={props.highlightedHeadingId}
              depth={depth + 1}
            />
          </li>
        )
      })}
    </ol>
  )
}
