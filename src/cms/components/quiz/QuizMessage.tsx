import type { ReactElement, ReactNode } from 'react'

import type { QuizCardStatus } from '@/cms/components/quiz/Quiz'
import { useQuiz } from '@/cms/components/quiz/Quiz'

export interface QuizMessageProps {
  children?: ReactNode
  type: QuizCardStatus
}

/**
 * Quiz message.
 */
export function QuizMessage(props: QuizMessageProps): JSX.Element | null {
  const quiz = useQuiz()

  if (props.type !== quiz.status) return null

  return <div className="flex flex-col space-y-2 text-sm">{props.children}</div>
}

/**
 * Type guard for QuizMessage component.
 */
export function isQuizMessage(
  component: JSX.Element,
): component is ReactElement<QuizMessageProps> {
  return component.type === QuizMessage
}
