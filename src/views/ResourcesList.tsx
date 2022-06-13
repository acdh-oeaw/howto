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
    <ul className="grid md:grid-cols-2 gap-16">
      {posts.map((post) => {
        const href = routes.resource({ kind: 'posts', id: post.id })
        const authors = post.authors

        return (
          <li key={post.id}>
            <article className="grid gap-6">
              <div className="rounded bg-gradient-to-r from-brand-blue to-brand-turquoise h-36 relative">
                {typeof post.featuredImage === 'string' &&
                post.featuredImage.length > 0 ? (
                  <img src={post.featuredImage} alt="" />
                ) : null}
              </div>
              <h3 className="text-xl font-bold text-brand-light-blue hover:text-neutral-100 transition">
                <Link href={href}>
                  <a>{post.title}</a>
                </Link>
              </h3>
              <p className="text-neutral-300 text-base leading-relaxed">
                {post.abstract}
              </p>
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
                                    className="w-10 h-10 rounded-full"
                                    layout="fixed"
                                    width={40}
                                    height={40}
                                    objectFit="cover"
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
                <Link href={href}>
                  <a className="font-medium text-base justify-self-end text-brand-light-blue hover:text-neutral-100 transition">
                    {t('common.readMore')} &rarr;
                  </a>
                </Link>
              </footer>
            </article>
          </li>
        )
      })}
    </ul>
  )
}
