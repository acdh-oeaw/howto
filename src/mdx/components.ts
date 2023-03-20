import type { ComponentType } from 'react'

import { Download } from '@/cms/components/Download'
import { Figure } from '@/cms/components/Figure'
import { SideNote } from '@/cms/components/SideNote'
import { Tabs, Tab } from '@/cms/components/Tabs'
import { Video } from '@/cms/components/Video'

export type MdxComponentType =
  /** Layout wrapper. */
  // eslint-disable-next-line @typescript-eslint/sort-type-union-intersection-members
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
  [name: string]: ComponentType<any> | JSX.IntrinsicElements
}

/**
 * Custom components allowed in mdx content.
 */
export const components: MdxComponentMap = {
  Download,
  SideNote,
  Video,
  Figure,
  Tabs,
  Tab,
}
