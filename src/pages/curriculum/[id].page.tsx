import type {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from 'next'
import Link from 'next/link'
import type { ParsedUrlQuery } from 'querystring'
import { Fragment } from 'react'

import DocumentIcon from '@/assets/icons/document-text.svg?symbol'
import type { Course as CourseData, CoursePreview } from '@/cms/api/courses.api'
import { getCourseById, getCourseFilePath, getCourseIds } from '@/cms/api/courses.api'
import { getCoursePreviewsByTagId } from '@/cms/queries/courses.queries'
import { getLastUpdatedTimestamp } from '@/cms/utils/getLastUpdatedTimestamp'
import { pickRandom } from '@/cms/utils/pickRandom'
import { Icon } from '@/common/Icon'
import { PageContent } from '@/common/PageContent'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { useI18n } from '@/i18n/useI18n'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'
import { routes } from '@/navigation/routes.config'
import type { IsoDateString } from '@/utils/ts/aliases'
import { Course, CourseHeader } from '@/views/Course'

const RELATED_COURSES_COUNT = 4

export interface CoursePageParams extends ParsedUrlQuery {
  id: string
}

export interface CoursePageProps {
  dictionary: Dictionary
  course: CourseData
  related: Array<CoursePreview>
  lastUpdatedAt: IsoDateString | null
}

/**
 * Creates page for every course.
 */
export async function getStaticPaths(
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult<CoursePageParams>> {
  const { locales } = getLocale(context)

  const paths = (
    await Promise.all(
      locales.map(async (locale) => {
        const ids = await getCourseIds(locale)

        return ids.map((id) => {
          return {
            params: { id },
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
 * Provides course content and metadata, and translations for course page.
 */
export async function getStaticProps(
  context: GetStaticPropsContext<CoursePageParams>,
): Promise<GetStaticPropsResult<CoursePageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const params = context.params as CoursePageParams
  const id = params.id

  const course = await getCourseById(id, locale)

  const coursesWithSharedTags = (
    await Promise.all(
      course.data.metadata.tags.map((tag) => {
        return getCoursePreviewsByTagId(tag.id, locale)
      }),
    )
  )
    .flat()
    .filter((course) => {
      return course.id !== id
    })
  const related = pickRandom(coursesWithSharedTags, RELATED_COURSES_COUNT)

  const lastUpdatedAt = await getLastUpdatedTimestamp(getCourseFilePath(id, locale))

  return {
    props: {
      dictionary,
      course,
      related,
      lastUpdatedAt,
    },
  }
}

/**
 * Course page.
 */
export default function CoursePage(props: CoursePageProps): JSX.Element {
  const { course, related, lastUpdatedAt } = props
  const { metadata } = course.data

  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  // TODO: metadata
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
      <PageContent className="bg-brand-black text-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 p-8 py-24 xs:py-48">
          <aside />
          <div className="min-w-0">
            <article className="grid space-y-12">
              <CourseHeader course={course} lastUpdatedAt={lastUpdatedAt} />
              <Course course={course} lastUpdatedAt={lastUpdatedAt} />
              <RelatedCourses courses={related} />
            </article>
          </div>
        </div>
      </PageContent>
    </Fragment>
  )
}

interface RelatedCoursesProps {
  courses: Array<CoursePreview>
}

/**
 * List of related courses.
 */
function RelatedCourses(props: RelatedCoursesProps) {
  const { courses } = props

  const { t } = useI18n()

  if (courses.length === 0) return null

  return (
    <nav className="mx-auto my-12 w-full max-w-80ch space-y-3 border-t border-neutral-200 py-12">
      <h2 className="text-2xl font-bold">{t('common.relatedCourses')}</h2>
      <ul className="flex flex-col space-y-4">
        {props.courses.map((course) => {
          return (
            <li key={course.id}>
              <Link
                className="flex items-center space-x-1.5 underline"
                href={routes.course({ id: course.id })}
              >
                <Icon icon={DocumentIcon} className="h-6 w-6 shrink-0" />
                <span>{course.title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
