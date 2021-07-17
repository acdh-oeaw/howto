import Image from 'next/image'
import Link from 'next/link'

import type { PostPreview } from '@/cms/api/posts.api'
import { getFullName } from '@/cms/utils/getFullName'
import { useI18n } from '@/i18n/useI18n'
import { routes } from '@/navigation/routes.config'

const MAX_AUTHORS = 3

export interface ResourcesListProps {
  resources: Array<PostPreview>
}

/**
 * Lists one page of resources.
 */
export function ResourcesList(props: ResourcesListProps): JSX.Element {
  const { resources } = props

  return (
    <ul className="flex flex-col w-full max-w-screen-md mx-auto divide-y">
      {resources.map((resource) => {
        return (
          <li key={resource.id}>
            <ResourcePreviewCard resource={resource} />
          </li>
        )
      })}
    </ul>
  )
}

interface ResourcePreviewCardProps {
  resource: ResourcesListProps['resources'][number]
}

/**
 * Resource preview.
 */
function ResourcePreviewCard(props: ResourcePreviewCardProps): JSX.Element {
  const { resource } = props
  const { id, title, authors, abstract } = resource

  const { t } = useI18n()

  const href = routes.resource({ kind: 'posts', id })

  return (
    <article className="flex flex-col py-12 space-y-6">
      <div className="flex flex-col space-y-5">
        <h2 className="text-2xl font-semibold">
          <Link href={href}>
            <a className="transition hover:text-primary-600">{title}</a>
          </Link>
        </h2>
        <div className="leading-7 text-neutral-500">{abstract}</div>
      </div>
      <footer className="flex items-center justify-between">
        <dl>
          {Array.isArray(authors) && authors.length > 0 ? (
            <div>
              <dt className="sr-only">{t('common.authors')}</dt>
              <dd>
                <ul className="flex items-center space-x-1">
                  {authors.slice(0, MAX_AUTHORS).map((author) => {
                    return (
                      <li key={author.id}>
                        <span className="sr-only">{getFullName(author)}</span>
                        {author.avatar !== undefined ? (
                          <Image
                            src={author.avatar}
                            alt=""
                            className="object-cover w-8 h-8 rounded-full"
                            layout="fixed"
                            width={32}
                            height={32}
                          />
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>
        <Link href={href}>
          <a className="transition hover:text-primary-600">
            {t('common.readMore')} &rarr;
          </a>
        </Link>
      </footer>
    </article>
  )
}
