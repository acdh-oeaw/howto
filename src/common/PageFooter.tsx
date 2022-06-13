import Link from 'next/link'

import { Svg as RssIcon } from '@/assets/icons/rss.svg'
import { Icon } from '@/common/Icon'
import { useI18n } from '@/i18n/useI18n'
import { useSiteMetadata } from '@/metadata/useSiteMetadata'
import { routes } from '@/navigation/routes.config'
import { feedFileName } from '~/config/site.config'

/**
 * Page footer.
 */
export function PageFooter(): JSX.Element {
  const { creator } = useSiteMetadata()
  const { t } = useI18n()

  return (
    <footer className="flex items-center justify-between px-4 py-8 space-x-8">
      <div className="flex gap-4 items-center">
        <small>
          <span>&copy; </span>
          {creator != null ? (
            <a
              href={creator.website}
              target="_blank"
              rel="noopener noreferrer"
              className="transition rounded focus:outline-none hover:text-brand-blue focus-visible:ring focus-visible:ring-brand-blue"
            >
              {creator.shortName ?? creator.name}
            </a>
          ) : null}
          <span> {new Date().getFullYear()}</span>
        </small>
        <small>
          <Link href={routes.imprint()}>
            <a className="transition rounded focus:outline-none hover:text-brand-blue focus-visible:ring focus-visible:ring-brand-blue">
              {t('common.page.imprint')}
            </a>
          </Link>
        </small>
      </div>
      <small>
        <a
          href={'/' + feedFileName}
          className="flex items-center space-x-1 transition rounded focus:outline-none hover:text-brand-blue focus-visible:ring focus-visible:ring-brand-blue"
        >
          <Icon icon={RssIcon} className="flex-shrink-0 w-5 h-5" />
          <span>RSS Feed</span>
        </a>
      </small>
    </footer>
  )
}
