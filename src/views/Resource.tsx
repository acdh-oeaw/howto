import Image from 'next/image'
import Link from 'next/link'

import ClockIcon from '@/assets/icons/clock.svg?symbol'
import AvatarIcon from '@/assets/icons/user.svg?symbol'
import type { Post as PostData } from '@/cms/api/posts.api'
import { Quiz } from '@/cms/components/quiz/Quiz'
import { getFullName } from '@/cms/utils/getFullName'
import { Icon } from '@/common/Icon'
import { ImageLink } from '@/common/ImageLink'
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
    <div className="mx-auto w-full max-w-80ch space-y-16">
      <div className="prose prose-sm max-w-none sm:prose sm:max-w-none">
        {featuredImage != null ? <ResponsiveImage src={featuredImage} alt="" priority /> : null}
        <Mdx
          code={resource.code}
          components={{
            img: ImageLink,
            Image: ResponsiveImage,
            Quiz,
          }}
        />
      </div>
      <footer>
        {lastUpdatedAt != null ? (
          <p className="text-right text-sm text-neutral-500">
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
            className="flex items-center justify-end space-x-1.5 text-sm text-neutral-500"
          >
            <span className="text-right">{t('common.suggestChangesToResource')}</span>
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
    <header className="mx-auto grid w-full max-w-6xl gap-8 py-12 px-8">
      <dl className="min-w-0">
        {tags.length > 0 ? (
          <div className="">
            <dt className="sr-only inline">{t('common.tags')}:</dt>
            <dd className="inline">
              <ul className="inline text-xs font-bold uppercase tracking-wide text-brand-black">
                {tags.map((tag, index) => {
                  return (
                    <li key={tag.id} className="inline">
                      <Link
                        className="transition hover:text-neutral-100 focus:outline-none focus-visible:ring focus-visible:ring-brand-light-blue"
                        href={routes.tag({ id: tag.id })}
                      >
                        <span className={index !== 0 ? 'ml-1' : undefined}>{tag.name}</span>
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
      <dl className="grid min-w-0 grid-cols-2 items-center border-y border-neutral-200 py-4 text-sm font-medium text-neutral-100">
        <div className="min-w-0 space-y-1">
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
                              className="h-10 w-10 rounded-full object-cover"
                              width={40}
                              height={40}
                            />
                          ) : (
                            <Icon
                              icon={AvatarIcon}
                              className="h-8 w-8 shrink-0 rounded-full object-cover"
                            />
                          )}
                          <Link
                            className="transition hover:text-white"
                            href={routes.author({ id: author.id })}
                          >
                            {getFullName(author)}
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
                <Icon icon={ClockIcon} className="h-4 w-4 shrink-0" />
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
