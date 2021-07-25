import { Svg as RssIcon } from '@/assets/icons/rss.svg'
import { Icon } from '@/common/Icon'
import { useSiteMetadata } from '@/metadata/useSiteMetadata'
import { feedFileName } from '~/config/site.config'

/**
 * Page footer.
 */
export function PageFooter(): JSX.Element {
  const { creator } = useSiteMetadata()

  return (
    <footer className="flex items-center justify-between px-4 py-8 space-x-8">
      <small>
        <span>&copy; </span>
        {creator != null ? (
          <a
            href={creator.website}
            target="_blank"
            rel="noopener noreferrer"
            className="transition rounded focus:outline-none hover:text-primary-600 focus-visible:ring focus-visible:ring-primary-600"
          >
            {creator.shortName ?? creator.name}
          </a>
        ) : null}
        <span> {new Date().getFullYear()}</span>
      </small>
      <small>
        <a
          href={'/' + feedFileName}
          className="flex items-center space-x-1 transition rounded focus:outline-none hover:text-primary-600 focus-visible:ring focus-visible:ring-primary-600"
        >
          <Icon icon={RssIcon} className="flex-shrink-0 w-5 h-5" />
          <span>RSS Feed</span>
        </a>
      </small>
    </footer>
  )
}
