import type { ImageProps, StaticImageData } from 'next/image'
import Image from 'next/image'

interface ResponsiveImageProps extends ImageProps {
  sizes?: string
  /** @default 'link' */
  variant?: 'image' | 'link'
}

/**
 * Renders a responsive image in a content column.
 */
export function ResponsiveImage(props: ResponsiveImageProps): JSX.Element {
  const { sizes = '800px', variant = 'link' } = props

  const isUnoptimized =
    typeof props.src === 'string' && (props.width == null || props.height == null)

  const href = typeof props.src === 'string' ? props.src : (props.src as StaticImageData).src

  if (variant === 'image') {
    return <Image sizes={sizes} {...props} alt={props.alt} unoptimized={isUnoptimized} />
  }

  return (
    <a href={href} target="_blank" rel="noreferrer">
      <Image sizes={sizes} {...props} alt={props.alt} unoptimized={isUnoptimized} />
    </a>
  )
}
