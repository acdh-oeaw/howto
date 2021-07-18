import Image from 'next/image'
import Link from 'next/link'

import type { CoursePreview } from '@/cms/api/courses.api'
import { getFullName } from '@/cms/utils/getFullName'
import { useI18n } from '@/i18n/useI18n'
import { routes } from '@/navigation/routes.config'

const MAX_AUTHORS = 3

export interface CoursesListProps {
  courses: Array<CoursePreview>
}

/**
 * Lists one page of courses.
 */
export function CoursesList(props: CoursesListProps): JSX.Element {
  const { courses } = props

  return (
    <ul className="flex flex-col w-full max-w-screen-md mx-auto divide-y">
      {courses.map((course) => {
        return (
          <li key={course.id}>
            <CoursePreviewCard course={course} />
          </li>
        )
      })}
    </ul>
  )
}

interface CoursePreviewCardProps {
  course: CoursesListProps['courses'][number]
}

/**
 * Course preview.
 */
function CoursePreviewCard(props: CoursePreviewCardProps): JSX.Element {
  const { course } = props
  const { id, title, editors: authors, abstract } = course // FIXME: editors / authors

  const { t } = useI18n()

  const href = routes.course({ id })

  return (
    <article className="flex flex-col py-12 space-y-6">
      <div className="flex flex-col space-y-5">
        <h2 className="text-2xl font-semibold">
          <Link href={href}>
            <a className="transition hover:text-primary-600">{title}</a>
          </Link>
        </h2>
        <div className="leading-7 text-neutral-500">{abstract}</div>
      </div>
      <footer className="flex items-center justify-between">
        <dl>
          {Array.isArray(authors) && authors.length > 0 ? (
            <div>
              <dt className="sr-only">{t('common.authors')}</dt>
              <dd>
                <ul className="flex items-center space-x-1">
                  {authors.slice(0, MAX_AUTHORS).map((author) => {
                    return (
                      <li key={author.id}>
                        <span className="sr-only">{getFullName(author)}</span>
                        {author.avatar !== undefined ? (
                          <Image
                            src={author.avatar}
                            alt=""
                            className="object-cover w-8 h-8 rounded-full"
                            layout="fixed"
                            width={32}
                            height={32}
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
          <a className="transition hover:text-primary-600">
            {t('common.readMore')} &rarr;
          </a>
        </Link>
      </footer>
    </article>
  )
}
