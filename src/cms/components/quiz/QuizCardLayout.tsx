import type { ReactNode } from 'react'

import { getChildElements } from '@/cms/components/quiz/getChildElements'
import { QuizControls } from '@/cms/components/quiz/QuizControls'
import { isQuizQuestion } from '@/cms/components/quiz/QuizQuestion'

export interface QuizCardLayoutProps {
  children?: ReactNode
  component?: JSX.Element
  onValidate: () => void
}

/**
 * Quiz card layout.
 */
export function QuizCardLayout(props: QuizCardLayoutProps): JSX.Element {
  const childElements = getChildElements(props.children)
  const question = childElements.filter(isQuizQuestion)

  return (
    <div className="flex flex-col p-8 space-y-8 rounded shadow-md">
      {question}
      {props.component}
      <QuizControls onValidate={props.onValidate} />
    </div>
  )
}
