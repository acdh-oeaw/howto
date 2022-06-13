import Image from 'next/image'
import Link from 'next/link'

import { Svg as ClockIcon } from '@/assets/icons/clock.svg'
import { Svg as AvatarIcon } from '@/assets/icons/user.svg'
import type { Post as PostData } from '@/cms/api/posts.api'
import { Figure } from '@/cms/components/Figure'
import { Quiz } from '@/cms/components/quiz/Quiz'
import { Tabs } from '@/cms/components/Tabs'
import { getFullName } from '@/cms/utils/getFullName'
import { Icon } from '@/common/Icon'
import { PageTitle } from '@/common/PageTitle'
import { ResponsiveImage } from '@/common/ResponsiveImage'
import { useI18n } from '@/i18n/useI18n'
import { Mdx } from '@/mdx/Mdx'
import { routes } from '@/navigation/routes.config'
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
  const { featuredImage } = metadata

  const { t, formatDate } = useI18n()

  return (
    <div className="w-full mx-auto space-y-16 max-w-80ch">
      <div className="prose-sm prose max-w-none sm:prose sm:max-w-none">
        {featuredImage != null ? (
          <ResponsiveImage src={featuredImage} alt="" priority />
        ) : null}
        <Mdx
          code={resource.code}
          components={{ Figure, Image: ResponsiveImage, Quiz, Tabs }}
        />
      </div>
      <footer>
        {lastUpdatedAt != null ? (
          <p className="text-sm text-right text-neutral-500">
            <span>{t('common.lastUpdated')}: </span>
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
            <span className="text-right">
              {t('common.suggestChangesToResource')}
            </span>
          </EditLink>
        ) : null}
      </footer>
    </div>
  )
}

export interface ResourceHeaderProps {
  resource: PostData
  lastUpdatedAt: IsoDateString | null
  isPreview?: boolean
}

export function ResourceHeader(props: ResourceHeaderProps): JSX.Element {
  const { resource } = props
  const { metadata, timeToRead } = resource.data
  const { title, date: publishDate, authors, tags } = metadata

  const { t, formatDate, pluralize } = useI18n()

  return (
    <header className="max-w-6xl mx-auto grid gap-8 py-12 px-8">
      <dl>
        {tags.length > 0 ? (
          <div className="">
            <dt className="inline sr-only">{t('common.tags')}:</dt>
            <dd className="inline">
              <ul className="inline text-xs font-bold tracking-wide uppercase text-brand-black">
                {tags.map((tag, index) => {
                  return (
                    <li key={tag.id} className="inline">
                      <Link href={routes.tag({ id: tag.id })}>
                        <a className="transition hover:text-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-brand-light-blue">
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
      <dl className="grid items-center font-medium grid-cols-2 py-4 text-sm border-t border-b text-neutral-100 border-neutral-200">
        <div className="space-y-1">
          {authors.length > 0 ? (
            <div>
              <dt className="sr-only">{t('common.authors')}</dt>
              <dd>
                <ul className="space-y-2">
                  {authors.map((author) => {
                    return (
                      <li key={author.id}>
                        <div className="flex items-center space-x-2">
                          {author.avatar != null ? (
                            <Image
                              src={author.avatar}
                              alt=""
                              className="w-10 h-10 rounded-full"
                              layout="fixed"
                              width={40}
                              height={40}
                              objectFit="cover"
                            />
                          ) : (
                            <Icon
                              icon={AvatarIcon}
                              className="flex-shrink-0 object-cover w-8 h-8 rounded-full"
                            />
                          )}
                          <Link href={routes.author({ id: author.id })}>
                            <a className="hover:text-white transition">
                              {getFullName(author)}
                            </a>
                          </Link>
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
          <div>
            <dt className="sr-only">{t('common.publishDate')}</dt>
            <dd>
              <time dateTime={publishDate}>
                {formatDate(new Date(publishDate), undefined, {
                  dateStyle: 'long',
                })}
              </time>
            </dd>
          </div>
          <div>
            <dt className="sr-only">{t('common.timeToRead')}</dt>
            <dd>
              <div className="flex items-center justify-end space-x-1.5">
                <Icon icon={ClockIcon} className="flex-shrink-0 w-4 h-4" />
                {/*
                 * TODO: Change to `Intl.DurationFormat` when it lands.
                 *
                 * @see https://github.com/tc39/proposal-intl-duration-format
                 */}
                <span>
                  {timeToRead} {pluralize('common.minutes', timeToRead)}
                </span>
              </div>
            </dd>
          </div>
        </div>
      </dl>
    </header>
  )
}
