import type { ComponentType } from 'react'

import { SideNote } from '@/cms/components/SideNote'
import { Video } from '@/cms/components/Video'

export type MdxComponentType =
  /** Layout wrapper. */
  | 'wrapper'
  /** CommonMark. */
  | 'a'
  | 'blockquote'
  | 'code'
  | 'em'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'hr'
  | 'img'
  | 'li'
  | 'ol'
  | 'p'
  | 'pre'
  | 'strong'
  | 'ul'
  /** GitHub markdown. */
  | 'del'
  | 'table'
  | 'tbody'
  | 'td'
  | 'th'
  | 'thead'
  | 'tr'

export type MdxComponentMap = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [name: string]: JSX.IntrinsicElements | ComponentType<any>
}

/**
 * Custom components allowed in mdx content.
 */
export const components: MdxComponentMap = {
  SideNote,
  Video,
}
