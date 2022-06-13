import type { ParsedUrlQuery } from 'querystring'

import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { Fragment } from 'react'

import { getPersonById, getPersonIds } from '@/cms/api/people.api'
import type { Person as PersonData } from '@/cms/api/people.api'
import type { PostPreview } from '@/cms/api/posts.api'
import { getPostPreviewsByAuthorId } from '@/cms/queries/posts.queries'
import { getFullName } from '@/cms/utils/getFullName'
import type { Page } from '@/cms/utils/paginate'
import { getPageRange, paginate } from '@/cms/utils/paginate'
import { LeadIn } from '@/common/LeadIn'
import { PageContent } from '@/common/PageContent'
import { PageTitle } from '@/common/PageTitle'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { useI18n } from '@/i18n/useI18n'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'
import { routes } from '@/navigation/routes.config'
import { Pagination } from '@/views/Pagination'
import { ResourcesList } from '@/views/ResourcesList'

const pageSize = 12

export interface AuthorPageParams extends ParsedUrlQuery {
  id: string
  page: string
}

export interface AuthorPageProps {
  dictionary: Dictionary
  author: PersonData
  resources: Page<PostPreview>
}

/**
 * Creates page for every author.
 */
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<AuthorPageParams>> {
  const { locales } = getLocale(context)

  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const ids = await getPersonIds(locale)
        return (
          await Promise.all(
            ids.map(async (id) => {
              const posts = await getPostPreviewsByAuthorId(id, locale)

              const pages = getPageRange(posts, pageSize)
              return pages.map((page) => {
                return {
                  params: { id, page: String(page) },
                  locale,
                }
              })
            }),
          )
        ).flat()
      }),
    )
  ).flat()

  return {
    paths,
    fallback: false,
  }
}

/**
 * Provides author metadata, metadata for posts authorged with that author and
 * translations for author page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext<AuthorPageParams>,
): Promise<GetStaticPropsResult<AuthorPageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const params = context.params as AuthorPageParams
  const id = params.id
  const page = Number(params.page)

  const author = await getPersonById(id, locale)

  const postPreviews = await getPostPreviewsByAuthorId(id, locale)
  const sortedResources: Array<PostPreview> = postPreviews.sort((a, b) => {
    return a.date > b.date ? -1 : 1
  })

  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const resources = paginate(sortedResources, pageSize)[page - 1]!

  return {
    props: {
      dictionary,
      author,
      resources,
    },
  }
}

/**
 * Author page.
 */
export default function AuthorPage(props: AuthorPageProps): JSX.Element {
  const { author, resources: posts } = props

  const { t } = useI18n()
  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  const fullName = getFullName(author)

  return (
    <Fragment>
      <Metadata
        title={fullName}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <PageContent className="text-white bg-brand-black">
        <div className="flex flex-col max-w-6xl gap-12 p-8 py-24 mx-auto xs:py-48">
          <PageTitle>{fullName}</PageTitle>
          <LeadIn>{author.description}</LeadIn>
          <section className="space-y-5">
            <h2 className="sr-only">{t('common.resources')}</h2>
            <ResourcesList posts={posts.items} />
            <Pagination
              page={posts.page}
              pages={posts.pages}
              href={(page) => {
                return routes.author({ id: author.id, resourcePage: page })
              }}
            />
          </section>
        </div>
      </PageContent>
    </Fragment>
  )
}
