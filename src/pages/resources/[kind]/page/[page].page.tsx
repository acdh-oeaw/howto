import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import type { ParsedUrlQuery } from 'querystring'
import { Fragment } from 'react'

import type { PostPreview } from '@/cms/api/posts.api'
import { getPostIds, getPostPreviews } from '@/cms/api/posts.api'
import type { ResourceKind } from '@/cms/api/resources.api'
import type { Page } from '@/cms/utils/paginate'
import { getPageRange, paginate } from '@/cms/utils/paginate'
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

export interface ResourcesPageParams extends ParsedUrlQuery {
  kind: ResourceKind
  page: string
}

export interface ResourcesPageProps {
  kind: ResourceKind
  dictionary: Dictionary
  resources: Page<PostPreview>
}

/**
 * Creates resources pages.
 */
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<ResourcesPageParams>> {
  const { locales } = getLocale(context)

  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const ids = await getPostIds(locale)
        const pages = getPageRange(ids, pageSize)

        return pages.map((page) => {
          return {
            params: { kind: 'posts' as const, page: String(page) },
            locale,
          }
        })
      }),
    )
  ).flat()

  return {
    paths,
    fallback: false,
  }
}

/**
 * Provides translations and metadata for resources page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext<ResourcesPageParams>,
): Promise<GetStaticPropsResult<ResourcesPageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const params = context.params as ResourcesPageParams
  const kind = params.kind
  const page = Number(params.page)

  const postPreviews = await getPostPreviews(locale)
  const sortedResources: Array<PostPreview> = postPreviews.sort((a, b) => {
    return a.date > b.date ? -1 : 1
  })

  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const resources = paginate(sortedResources, pageSize)[page - 1]!

  return {
    props: {
      kind,
      dictionary,
      resources,
    },
  }
}

/**
 * Resources page.
 */
export default function ResourcesPage(props: ResourcesPageProps): JSX.Element {
  const { resources, kind } = props

  const { t } = useI18n()
  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  return (
    <Fragment>
      <Metadata
        title={t('common.page.resources')}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <PageContent className="bg-brand-black text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 p-8 py-24 xs:py-48">
          <PageTitle>{t('common.posts')}</PageTitle>
          <ResourcesList posts={resources.items} />
          <Pagination
            page={resources.page}
            pages={resources.pages}
            href={(page) => {
              return routes.resources({ kind, page })
            }}
          />
        </div>
      </PageContent>
    </Fragment>
  )
}
