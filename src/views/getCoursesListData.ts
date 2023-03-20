import type { CoursePreview } from '@/cms/api/courses.api'

export interface CoursesListItem extends Pick<CoursePreview, 'abstract' | 'id' | 'title'> {
  editors?: Array<
    Pick<Exclude<CoursePreview['editors'], undefined>[number], 'firstName' | 'id' | 'lastName'>
  >
}

export type CoursesListData = Array<CoursesListItem>

/**
 * Returns minimal data necessary for courses list view.
 */
export function getCoursesListData(courses: Array<CoursePreview>): CoursesListData {
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
