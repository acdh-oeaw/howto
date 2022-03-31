import type { ReactNode } from 'react'

export interface FigureProps {
  src: string
  alt?: string
  children?: ReactNode
}

export function Figure(props: FigureProps): JSX.Element {
  const { src, alt = '', children: caption } = props

  return (
    <figure className="flex flex-col">
      <img src={src} alt={alt} loading="lazy" sizes="800px" />
      {caption != null ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}
