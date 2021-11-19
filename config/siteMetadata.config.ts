import type { Locale } from '@/i18n/i18n.config'
import { defaultLocale } from '@/i18n/i18n.config'
import { createUrl } from '@/utils/createUrl'
import { url } from '~/config/site.config'

export interface SiteMetadata {
  url: string
  title: string
  shortTitle?: string
  description: string
  favicon: {
    src: string
    maskable?: boolean
  }
  image: {
    src: string
    publicPath: string
    alt: string
  }
  twitter?: string
  creator?: {
    name: string
    shortName?: string
    affiliation?: string
    website: string
    address?: {
      street: string
      zip: string
      city: string
    }
    image?: {
      src: string
      publicPath: string
      alt: string
    }
    phone?: string
    email?: string
    twitter?: string
  }
}

/**
 * Site metadata for all supported locales.
 */
export const siteMetadata: Record<Locale, SiteMetadata> = {
  en: {
    url: String(createUrl({ pathname: '/', locale: 'en', baseUrl: url })),
    title: 'ACDH-CH Howto',
    shortTitle: 'ACDH-CH Howto',
    description: 'Digital Humanities learning resources.',
    favicon: {
      src: 'public/assets/images/logo-maskable.svg',
      maskable: true,
    },
    image: {
      src: 'public/assets/images/logo-with-text.svg',
      publicPath: String(
        createUrl({
          pathname: '/open-graph.webp',
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          locale: 'en' === defaultLocale ? undefined : 'en',
          baseUrl: url,
        }),
      ),
      alt: '',
    },
    twitter: 'ACDH_OeAW',
    creator: {
      name: 'Austrian Centre for Digital Humanities and Cultural Heritage',
      shortName: 'ACDH-CH',
      website: 'https://www.oeaw.ac.at/acdh/acdh-ch-home',
    },
  },
  de: {
    url: String(createUrl({ pathname: '/', locale: 'de', baseUrl: url })),
    title: 'ACDH-CH Howto',
    shortTitle: 'ACDH-CH Howto',
    description: 'Digital Humanities Lernmaterialien.',
    favicon: {
      src: 'public/assets/images/logo-maskable.svg',
      maskable: true,
    },
    image: {
      src: 'public/assets/images/logo-with-text.svg',
      publicPath: String(
        createUrl({
          pathname: '/open-graph.webp',
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          locale: 'de' === defaultLocale ? undefined : 'de',
          baseUrl: url,
        }),
      ),
      alt: '',
    },
    twitter: 'ACDH_OeAW',
    creator: {
      name: 'Austrian Centre for Digital Humanities and Cultural Heritage',
      shortName: 'ACDH-CH',
      website: 'https://www.oeaw.ac.at/de/acdh/acdh-ch-home',
    },
  },
} as const
