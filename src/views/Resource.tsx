import Link from 'next/link'

import { Svg as AvatarIcon } from '@/assets/icons/user.svg'
import type { Post as PostData } from '@/cms/api/posts.api'
import { Quiz } from '@/cms/components/quiz/Quiz'
import { getFullName } from '@/cms/utils/getFullName'
import { Icon } from '@/common/Icon'
import { PageTitle } from '@/common/PageTitle'
import { useI18n } from '@/i18n/useI18n'
import { Mdx } from '@/mdx/Mdx'
import { routes } from '@/navigation/routes.config'
import { getDate } from '@/utils/getDate'
import type { IsoDateString } from '@/utils/ts/aliases'
import { EditLink } from '@/views/EditLink'

export interface ResourceProps {
  resource: PostData
  lastUpdatedAt: IsoDateString | null
  isPreview?: boolean
}

export function Resource(props: ResourceProps): JSX.Element {
  const { resource, lastUpdatedAt, isPreview } = props
  const { metadata } = resource.data
  const { title, date, authors, tags = [] } = metadata

  const { formatDate } = useI18n()

  const publishDate = getDate(date)

  return (
    <article className="w-full min-w-0 mx-auto space-y-16 max-w-80ch">
      <header className="space-y-10">
        <dl>
          {tags.length > 0 ? (
            <div className="">
              <dt className="inline sr-only">Tags:</dt>
              <dd className="inline">
                <ul className="inline text-xs font-bold tracking-wide uppercase text-primary-600">
                  {tags.map((tag, index) => {
                    return (
                      <li key={tag.id} className="inline">
                        <Link href={routes.tag({ id: tag.id })}>
                          <a className="transition hover:text-primary-700 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                            <span className={index !== 0 ? 'ml-1' : undefined}>
                              {tag.name}
                            </span>
                          </a>
                        </Link>
                        {index !== tags.length - 1 ? ', ' : null}
                      </li>
                    )
                  })}
                </ul>
              </dd>
            </div>
          ) : null}
        </dl>
        <PageTitle>{title}</PageTitle>
        <dl className="grid items-center grid-cols-2 py-4 text-sm border-t border-b text-neutral-500 border-neutral-200">
          <div className="space-y-1">
            {authors.length > 0 ? (
              <div>
                <dt className="sr-only">Authors</dt>
                <dd>
                  <ul className="space-y-2">
                    {authors.map((author) => {
                      return (
                        <li key={author.id}>
                          <div className="flex items-center space-x-2">
                            {author.avatar != null ? (
                              <img
                                src={author.avatar}
                                alt=""
                                loading="lazy"
                                className="object-cover w-8 h-8 rounded-full"
                              />
                            ) : (
                              <Icon
                                icon={AvatarIcon}
                                className="object-cover w-8 h-8 rounded-full"
                              />
                            )}
                            <span>{getFullName(author)}</span>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </dd>
              </div>
            ) : null}
          </div>
          <div className="space-y-1 text-right">
            {publishDate != null ? (
              <div>
                <dt className="sr-only">Publish date</dt>
                <dd>
                  <time dateTime={date}>
                    {formatDate(publishDate, undefined, {
                      dateStyle: 'long',
                    })}
                  </time>
                </dd>
              </div>
            ) : null}
          </div>
        </dl>
      </header>
      <div className="prose max-w-none">
        <Mdx code={resource.code} components={{ Quiz }} />
      </div>
      <footer>
        {lastUpdatedAt != null ? (
          <p className="text-sm text-right text-neutral-500">
            <span>Last updated: </span>
            <time dateTime={lastUpdatedAt}>
              {formatDate(new Date(lastUpdatedAt), undefined, {
                dateStyle: 'medium',
              })}
            </time>
          </p>
        ) : null}
        {isPreview !== true ? (
          <EditLink
            collection="posts"
            id={resource.id}
            className="text-sm flex justify-end items-center space-x-1.5 text-neutral-500"
          >
            <span className="text-right">Suggest changes to resource</span>
          </EditLink>
        ) : null}
      </footer>
    </article>
  )
}
