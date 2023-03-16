import type { FC, ReactElement, ReactNode } from 'react'

import LightBulbIcon from '@/assets/icons/light-bulb.svg?symbol'
import LightningBoltIcon from '@/assets/icons/lightning-bolt.svg?symbol'
import type { QuizCardStatus } from '@/cms/components/quiz/Quiz'
import { Icon } from '@/common/Icon'

const icons: Record<QuizCardStatus, FC | null> = {
  correct: LightBulbIcon,
  incorrect: LightningBoltIcon,
  unanswered: null,
}

export interface QuizMessageProps {
  children?: ReactNode
  type: QuizCardStatus
}

/**
 * Quiz message.
 */
export function QuizMessage(props: QuizMessageProps): JSX.Element | null {
  const icon = icons[props.type]

  return (
    <div className="flex items-start space-x-2 border-t border-neutral-200 text-neutral-500">
      {icon != null ? (
        <Icon icon={icon} className="flex-shrink-0 w-6 h-6 mt-2" />
      ) : null}
      <div className="flex flex-col mt-2.5 space-y-2 text-sm">
        {props.children}
      </div>
    </div>
  )
}

/**
 * Type guard for QuizMessage component.
 */
export function isQuizMessage(
  component: JSX.Element,
): component is ReactElement<QuizMessageProps> {
  return component.type === QuizMessage
}
