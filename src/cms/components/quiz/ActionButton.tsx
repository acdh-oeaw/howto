import cx from 'clsx'
import type { ReactNode } from 'react'

export interface ActionButtonProps {
  children: ReactNode
  isDisabled?: boolean
  onClick: JSX.IntrinsicElements['button']['onClick']
  variant?: 'error' | 'success'
}

/**
 * Action button.
 */
export function ActionButton(props: ActionButtonProps): JSX.Element {
  const isDisabled = props.isDisabled === true
  const variant = props.variant

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
      disabled={isDisabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  )
}
