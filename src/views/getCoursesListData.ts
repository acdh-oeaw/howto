import type { CoursePreview } from '@/cms/api/courses.api'

export interface CoursesListItem
  extends Pick<CoursePreview, 'id' | 'title' | 'abstract'> {
  editors?: Array<
    Pick<
      Exclude<CoursePreview['editors'], undefined>[number],
      'id' | 'firstName' | 'lastName'
    >
  >
}

export type CoursesListData = Array<CoursesListItem>

/**
 * Returns minimal data necessary for courses list view.
 */
export function getCoursesListData(
  courses: Array<CoursePreview>,
): CoursesListData {
  return courses.map((course) => {
    const courseData = {
      id: course.id,
      title: course.shortTitle ?? course.title,
      abstract: course.abstract,
      editors:
        course.editors?.map((editor) => {
          const editorData = {
            id: editor.id,
            firstName: editor.firstName,
            lastName: editor.lastName,
          }
          return editorData
        }) ?? [],
    }
    return courseData
  })
}
