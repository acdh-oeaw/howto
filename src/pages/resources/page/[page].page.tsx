import type { ParsedUrlQuery } from 'querystring'

import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { Fragment } from 'react'

import type { PostPreview } from '@/cms/api/posts.api'
import { getPostPreviews, getPostIds } from '@/cms/api/posts.api'
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
  page: string
}

export interface ResourcesPageProps {
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
            params: { page: String(page) },
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
  const page = Number(params.page)

  const postPreviews = await getPostPreviews(locale)
  const sortedResources: Array<PostPreview> = postPreviews.sort((a, b) =>
    a.date > b.date ? -1 : 1,
  )

  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const resources = paginate(sortedResources, pageSize)[page - 1]!

  return {
    props: {
      dictionary,
      resources,
    },
  }
}

/**
 * Resources page.
 */
export default function ResourcesPage(props: ResourcesPageProps): JSX.Element {
  const { resources } = props

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
      <PageContent className="flex flex-col w-full max-w-screen-xl px-10 py-16 mx-auto space-y-10">
        <PageTitle>{t('common.posts')}</PageTitle>
        <ResourcesList resources={resources.items} />
        <Pagination
          page={resources.page}
          pages={resources.pages}
          href={(page) => routes.resources({ page })}
        />
      </PageContent>
    </Fragment>
  )
}
