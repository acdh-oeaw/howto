import type { ParsedUrlQuery } from 'querystring'

import { SchemaOrg as SchemaOrgMetadata } from '@stefanprobst/next-page-metadata'
import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import Link from 'next/link'
import { Fragment } from 'react'

import { Svg as AcademicCapIcon } from '@/assets/icons/academic-cap.svg'
import { Svg as DocumentIcon } from '@/assets/icons/document-text.svg'
import type { CoursePreview } from '@/cms/api/courses.api'
import { getPostById, getPostFilePath, getPostIds } from '@/cms/api/posts.api'
import type { Post as PostData, PostPreview } from '@/cms/api/posts.api'
import type { ResourceKind } from '@/cms/api/resources.api'
import { getCoursePreviewsByResourceId } from '@/cms/queries/courses.queries'
import { getPostPreviewsByTagId } from '@/cms/queries/posts.queries'
import { getFullName } from '@/cms/utils/getFullName'
import { getLastUpdatedTimestamp } from '@/cms/utils/getLastUpdatedTimestamp'
import { pickRandom } from '@/cms/utils/pickRandom'
import { Icon } from '@/common/Icon'
import { PageContent } from '@/common/PageContent'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { useI18n } from '@/i18n/useI18n'
import { DublinCore as DublinCoreMetadata } from '@/metadata/DublinCore'
import { Highwire as HighwireMetadata } from '@/metadata/Highwire'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'
import { useSiteMetadata } from '@/metadata/useSiteMetadata'
import { routes } from '@/navigation/routes.config'
import { createUrl } from '@/utils/createUrl'
import type { IsoDateString } from '@/utils/ts/aliases'
import { FloatingTableOfContents } from '@/views/FloatingTableOfContents'
import { Resource } from '@/views/Resource'
import { TableOfContents } from '@/views/TableOfContents'

const RELATED_RESOURCES_COUNT = 4

export interface ResourcePageParams extends ParsedUrlQuery {
  kind: ResourceKind
  id: string
}

export interface ResourcePageProps {
  dictionary: Dictionary
  resource: PostData
  related: Array<PostPreview>
  courses: Array<CoursePreview>
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
            params: { kind: 'posts' as const, id },
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

  const params = context.params as ResourcePageParams
  const id = params.id

  const resource = await getPostById(id, locale)

  const resourcesWithSharedTags = (
    await Promise.all(
      resource.data.metadata.tags.map((tag) => {
        return getPostPreviewsByTagId(tag.id, locale)
      }),
    )
  )
    .flat()
    .filter((resource) => {
      return resource.id !== id
    })
  const related = pickRandom(resourcesWithSharedTags, RELATED_RESOURCES_COUNT)

  const courses = await getCoursePreviewsByResourceId(id, locale)

  const lastUpdatedAt = await getLastUpdatedTimestamp(
    getPostFilePath(id, locale),
  )

  return {
    props: {
      dictionary,
      resource,
      related,
      courses,
      lastUpdatedAt,
    },
  }
}

/**
 * Resource page.
 */
export default function ResourcePage(props: ResourcePageProps): JSX.Element {
  const { resource, related, courses, lastUpdatedAt } = props
  const { metadata, toc } = resource.data

  const { t } = useI18n()
  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()
  const siteMetadata = useSiteMetadata()

  return (
    <Fragment>
      <Metadata
        title={metadata.title}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
        openGraph={{
          type: 'article',
        }}
      />
      <SchemaOrgMetadata
        schema={{
          /**
           * The best option would probably be `LearningResource`, which
           * unfortunately does not currently seem to be recognized by Google.
           *
           * @see https://developers.google.com/search/docs/advanced/structured-data/search-gallery
           */
          '@type': 'Course',
          url: canonicalUrl,
          headline: metadata.title,
          name: metadata.title,
          datePublished: metadata.date,
          abstract: metadata.abstract,
          description: metadata.abstract,
          inLanguage: metadata.lang,
          author: metadata.authors.map((author) => {
            return {
              '@type': 'Person',
              familyName: author.lastName,
              givenName: author.firstName,
            }
          }),
          editor: metadata.editors?.map((editor) => {
            return {
              '@type': 'Person',
              familyName: editor.lastName,
              givenName: editor.firstName,
            }
          }),
          contributor: metadata.contributors?.map((contributor) => {
            return {
              '@type': 'Person',
              familyName: contributor.lastName,
              givenName: contributor.firstName,
            }
          }),
          version: metadata.version,
          license: metadata.licence.url,
          image:
            typeof metadata.featuredImage === 'string'
              ? metadata.featuredImage
              : metadata.featuredImage?.src,
          keywords: metadata.tags.map((tag) => {
            return tag.name
          }),
          publisher: {
            '@type': 'Organization',
            name: siteMetadata.title,
            description: siteMetadata.description,
            url: siteMetadata.url,
            logo: siteMetadata.image.publicPath,
            sameAs:
              siteMetadata.twitter != null
                ? String(
                    createUrl({
                      pathname: siteMetadata.twitter,
                      baseUrl: 'https://twitter.com',
                    }),
                  )
                : undefined,
          },
        }}
      />
      <HighwireMetadata
        url={canonicalUrl}
        title={metadata.title}
        date={metadata.date}
        authors={metadata.authors.map((author) => {
          return getFullName(author)
        })}
        abstract={metadata.abstract}
        lang={metadata.lang}
        siteTitle={siteMetadata.title}
      />
      <DublinCoreMetadata
        title={metadata.title}
        date={metadata.date}
        authors={metadata.authors.map((author) => {
          return getFullName(author)
        })}
        abstract={metadata.abstract}
        lang={metadata.lang}
        licence={metadata.licence.name}
        tags={metadata.tags.map((tag) => {
          return tag.name
        })}
        siteTitle={siteMetadata.title}
      />
      <PageContent className="grid w-full max-w-screen-lg px-10 py-16 mx-auto space-y-10 2xl:space-y-0 2xl:grid-cols-content-columns 2xl:gap-x-10 2xl:max-w-none">
        <aside className="sticky top-0 hidden w-full max-w-xs max-h-screen px-8 py-8 overflow-y-auto text-sm text-neutral-500 2xl:flex 2xl:flex-col justify-self-end">
          <CourseLinks courses={courses} />
        </aside>
        <div className="min-w-0">
          <Resource resource={resource} lastUpdatedAt={lastUpdatedAt} />
          <RelatedResources resources={related} />
        </div>
        {metadata.toc === true && toc.length > 0 ? (
          <Fragment>
            <aside className="sticky top-0 hidden w-full max-w-xs max-h-screen px-8 py-8 overflow-y-auto text-sm text-neutral-500 2xl:flex 2xl:flex-col">
              <TableOfContents
                toc={toc}
                aria-labelledby="table-of-contents"
                title={
                  <h2
                    id="table-of-contents"
                    className="text-xs font-bold tracking-wide uppercase text-neutral-600"
                  >
                    {t('common.tableOfContents')}
                  </h2>
                }
                className="w-full space-y-2"
              />
            </aside>
            <aside className="2xl:hidden">
              <FloatingTableOfContents toc={toc} />
            </aside>
          </Fragment>
        ) : null}
      </PageContent>
    </Fragment>
  )
}

interface CourseLinksProps {
  courses: Array<CoursePreview>
}

/**
 * List of courses the resource is part of.
 */
function CourseLinks(props: CourseLinksProps) {
  const { courses } = props

  const { t } = useI18n()

  if (courses.length === 0) return null

  return (
    <nav aria-label={t('common.containedIn')} className="w-full space-y-2">
      <h2 className="text-xs font-bold tracking-wide uppercase text-neutral-600">
        {t('common.containedIn')}
      </h2>
      <ul className="space-y-2">
        {courses.map((course) => {
          return (
            <li key={course.id}>
              <Link href={routes.course({ id: course.id })}>
                <a className="flex items-center text-sm space-x-1.5 transition hover:text-primary-600 relative focus:outline-none rounded focus-visible:ring focus-visible:ring-primary-600">
                  <Icon
                    icon={AcademicCapIcon}
                    className="flex-shrink-0 w-4 h-4"
                  />
                  <span>{course.title}</span>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

interface RelatedResourcesProps {
  resources: Array<PostPreview>
}

/**
 * List of related resources.
 */
function RelatedResources(props: RelatedResourcesProps) {
  const { resources } = props

  const { t } = useI18n()

  if (resources.length === 0) return null

  return (
    <nav
      aria-label={t('common.relatedResources')}
      className="w-full py-12 mx-auto my-12 space-y-3 border-t border-neutral-200 max-w-80ch"
    >
      <h2 className="text-2xl font-bold">{t('common.relatedResources')}</h2>
      <ul className="flex flex-col space-y-4">
        {props.resources.map((resource) => {
          return (
            <li key={resource.id}>
              <Link
                href={routes.resource({ kind: resource.kind, id: resource.id })}
              >
                <a className="underline flex items-center space-x-1.5">
                  <Icon icon={DocumentIcon} className="flex-shrink-0 w-6 h-6" />
                  <span>{resource.title}</span>
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
