import type { ParsedUrlQuery } from 'querystring'

import { JsonLd } from '@stefanprobst/next-page-metadata'
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import { Fragment } from 'react'

import { getPostById, getPostFilePath, getPostIds } from '@/cms/api/posts.api'
import type { Post as PostData } from '@/cms/api/posts.api'
import { getLastUpdatedTimestamp } from '@/cms/utils/getLastUpdatedTimestamp'
import { PageContent } from '@/common/PageContent'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'
import type { IsoDateString } from '@/utils/ts/aliases'
// import { FloatingTableOfContentsButton } from '@/views/FloatingTableOfContentsButton'
import { Resource } from '@/views/Resource'
import { TableOfContents } from '@/views/TableOfContents'

export interface ResourcePageParams extends ParsedUrlQuery {
  type: string
  id: string
}

export interface ResourcePageProps {
  dictionary: Dictionary
  resource: PostData
  lastUpdatedAt: IsoDateString | null
}

/**
 * Creates page for every resource.
 */
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<ResourcePageParams>> {
  const { locales } = getLocale(context)

  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const ids = await getPostIds(locale)

        return ids.map((id) => {
          return {
            params: { type: 'posts', id },
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
 * Provides resource content and metadata, and translations for resource page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext<ResourcePageParams>,
): Promise<GetStaticPropsResult<ResourcePageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const { id } = context.params as ResourcePageParams

  const resource = await getPostById(id, locale)

  const lastUpdatedAt = await getLastUpdatedTimestamp(
    getPostFilePath(id, locale),
  )

  return {
    props: {
      dictionary,
      resource,
      lastUpdatedAt,
    },
  }
}

/**
 * Resource page.
 */
export default function ResourcePage(props: ResourcePageProps): JSX.Element {
  const { resource, lastUpdatedAt } = props
  const { metadata, toc } = resource.data

  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  return (
    <Fragment>
      <Metadata
        title={metadata.title}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <JsonLd
        // TODO:
        schema={{
          '@type': 'Article',
        }}
      />
      <PageContent className="grid w-full max-w-screen-lg px-10 py-16 mx-auto space-y-10 2xl:space-y-0 2xl:grid-cols-content-columns 2xl:gap-x-10 2xl:max-w-none">
        <aside />
        <Resource resource={resource} lastUpdatedAt={lastUpdatedAt} />
        {metadata.toc === true && toc.length > 0 ? (
          <Fragment>
            <aside className="sticky top-0 hidden max-w-xs max-h-screen px-8 py-8 overflow-y-auto text-sm 2xl:block text-neutral-500">
              <TableOfContents
                toc={toc}
                title={
                  <h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">{`Table of contents`}</h2>
                }
                className="space-y-2"
              />
            </aside>
            {/* <FloatingTableOfContentsButton toc={toc} /> */}
          </Fragment>
        ) : null}
      </PageContent>
    </Fragment>
  )
}
