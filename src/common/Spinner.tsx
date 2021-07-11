import { useProgressBar } from '@react-aria/progress'
import type { SVGProps } from 'react'

export interface SpinnerProps {
  className?: string
}

/**
 * Loading spinner.
 */
export function Spinner(props: SpinnerProps): JSX.Element {
  const { progressBarProps } = useProgressBar({
    isIndeterminate: true,
  })

  const center = 16
  const strokeWidth = 4
  const r = 16 - strokeWidth
  const c = 2 * r * Math.PI
  const offset = c - (1 / 4) * c

  return (
    <svg
      {...(progressBarProps as SVGProps<SVGSVGElement>)}
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="none"
      strokeWidth={strokeWidth}
      className={props.className}
    >
      <circle
        role="presentation"
        cx={center}
        cy={center}
        r={r}
        stroke="currentColor"
        opacity={0.25}
      />
      <circle
        role="presentation"
        cx={center}
        cy={center}
        r={r}
        stroke="currentColor"
        strokeDasharray={c}
        strokeDashoffset={offset}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          begin="0s"
          dur="1s"
          from="0 16 16"
          to="360 16 16"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}
