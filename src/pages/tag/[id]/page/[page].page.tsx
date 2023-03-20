import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import type { ParsedUrlQuery } from 'querystring'
import { Fragment } from 'react'

import type { PostPreview } from '@/cms/api/posts.api'
import type { Tag as TagData } from '@/cms/api/tags.api'
import { getTagById, getTagIds } from '@/cms/api/tags.api'
import { getPostPreviewsByTagId } from '@/cms/queries/posts.queries'
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

export interface TagPageParams extends ParsedUrlQuery {
  id: string
  page: string
}

export interface TagPageProps {
  dictionary: Dictionary
  tag: TagData
  resources: Page<PostPreview>
}

/**
 * Creates page for every tag.
 */
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<TagPageParams>> {
  const { locales } = getLocale(context)

  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const ids = await getTagIds(locale)
        return (
          await Promise.all(
            ids.map(async (id) => {
              const posts = await getPostPreviewsByTagId(id, locale)

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
 * Provides tag metadata, metadata for posts tagged with that tag and
 * translations for tag page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext<TagPageParams>,
): Promise<GetStaticPropsResult<TagPageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const params = context.params as TagPageParams
  const id = params.id

  const tag = await getTagById(id, locale)

  const page = Number(context.params?.page)
  const postPreviews = await getPostPreviewsByTagId(id, locale)
  const sortedResources: Array<PostPreview> = postPreviews.sort((a, b) => {
    return a.date > b.date ? -1 : 1
  })

  /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
  const resources = paginate(sortedResources, pageSize)[page - 1]!

  return {
    props: {
      dictionary,
      tag,
      resources,
    },
  }
}

/**
 * Tag page.
 */
export default function TagPage(props: TagPageProps): JSX.Element {
  const { tag, resources: posts } = props

  const { t } = useI18n()
  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  return (
    <Fragment>
      <Metadata
        title={tag.name}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <PageContent className="bg-brand-black text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 p-8 py-24 xs:py-48">
          <PageTitle>{tag.name}</PageTitle>
          <LeadIn>{tag.description}</LeadIn>
          <section className="space-y-5">
            <h2 className="sr-only">{t('common.resources')}</h2>
            <ResourcesList posts={posts.items} />
            <Pagination
              page={posts.page}
              pages={posts.pages}
              href={(page) => {
                return routes.tag({ id: tag.id, resourcePage: page })
              }}
            />
          </section>
        </div>
      </PageContent>
    </Fragment>
  )
}
