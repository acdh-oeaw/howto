import Image from 'next/image'
import Link from 'next/link'

import type { PostPreview } from '@/cms/api/posts.api'
import { getFullName } from '@/cms/utils/getFullName'
import { useI18n } from '@/i18n/useI18n'
import { routes } from '@/navigation/routes.config'

const MAX_AUTHORS = 3

interface ResourcesListProps {
  posts: Array<PostPreview>
}

/**
 * Lists one page of posts.
 */
export function ResourcesList(props: ResourcesListProps): JSX.Element {
  const { posts } = props

  const { t } = useI18n()

  return (
    <ul className="grid gap-16 md:grid-cols-2">
      {posts.map((post) => {
        const href = routes.resource({ kind: 'posts', id: post.id })
        const authors = post.authors

        return (
          <li key={post.id}>
            <article className="grid gap-6">
              <div className="relative h-36 overflow-hidden rounded bg-gradient-to-r from-brand-blue to-brand-turquoise">
                {typeof post.featuredImage === 'string' && post.featuredImage.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.featuredImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : typeof post.featuredImage === 'object' ? (
                  <Image
                    src={post.featuredImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <h3 className="text-xl font-bold text-brand-light-blue transition hover:text-neutral-100">
                <Link href={href}>{post.title}</Link>
              </h3>
              <p className="text-base leading-relaxed text-neutral-300">{post.abstract}</p>
              <footer className="flex items-center justify-between">
                <dl>
                  {Array.isArray(authors) && authors.length > 0 ? (
                    <div>
                      <dt className="sr-only">{t('common.authors')}</dt>
                      <dd>
                        <ul className="flex items-center space-x-1">
                          {authors.slice(0, MAX_AUTHORS).map((author) => {
                            const name = getFullName(author)

                            return (
                              <li key={author.id}>
                                <span className="sr-only">{name}</span>
                                {author.avatar !== undefined ? (
                                  <Image
                                    src={author.avatar}
                                    alt=""
                                    className="h-10 w-10 rounded-full object-cover"
                                    width={40}
                                    height={40}
                                    title={name}
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
                <Link
                  className="justify-self-end text-base font-medium text-brand-light-blue transition hover:text-neutral-100"
                  href={href}
                >
                  {t('common.readMore')} &rarr;
                </Link>
              </footer>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
