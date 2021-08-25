import { useButton } from '@react-aria/button'
import type { AriaButtonProps } from '@react-types/button'
import cx from 'clsx'
import { useRef } from 'react'

import { usePreview } from '@/cms/previews/Preview.context'

export interface ActionButtonProps extends AriaButtonProps {
  variant?: 'error' | 'success'
}

/**
 * Action button.
 */
export function ActionButton(props: ActionButtonProps): JSX.Element {
  const { isPreview } = usePreview()
  const isDisabled = props.isDisabled === true
  const variant = props.variant

  const buttonRef = useRef<HTMLButtonElement>(null)
  const handlers =
    isPreview === true
      ? {
          /**
           * FIXME: Needs investigation why `onPress` does not work inside the CMS preview `iframe`.
           */
          onClick: props.onPress,
          onPress: undefined,
        }
      : {}
  const { buttonProps } = useButton(
    {
      ...props,
      ...handlers,
    },
    buttonRef,
  )

  return (
    <button
      className={cx(
        'self-end px-2 py-1 text-sm font-medium transition rounded cursor-default',
        isDisabled
          ? 'text-neutral-400 bg-neutral-100 pointer-events-none'
          : variant === 'error'
          ? 'text-red-800 bg-red-100 hover:bg-red-200'
          : variant === 'success'
          ? 'text-green-800 bg-green-100 hover:bg-green-200'
          : 'text-blue-800 bg-blue-100 hover:bg-blue-200',
      )}
      {...buttonProps}
      ref={buttonRef}
    >
      {props.children}
    </button>
  )
}
