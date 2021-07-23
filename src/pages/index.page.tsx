import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Fragment } from 'react'

import { PageContent } from '@/common/PageContent'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { useI18n } from '@/i18n/useI18n'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'
import Mdx, { metadata } from '~/content/pages/home.mdx'

export interface HomePageMetadata extends Record<string, unknown> {
  title: string
  subtitle: string
}

export interface HomePageProps {
  dictionary: Dictionary
}

/**
 * Provides translations.
 */
export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<HomePageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  return {
    props: {
      dictionary,
    },
  }
}

/**
 * Home page.
 */
export default function HomePage(_props: HomePageProps): JSX.Element {
  const { title, subtitle } = metadata as HomePageMetadata

  const { t } = useI18n()
  const canonicalUrl = useCanonicalUrl()
  const languageAlternates = useAlternateUrls()

  return (
    <Fragment>
      <Metadata
        title={t('common.page.home')}
        canonicalUrl={canonicalUrl}
        languageAlternates={languageAlternates}
      />
      <PageContent className="text-neutral-100 bg-gradient-to-br from-neutral-800 to-neutral-900">
        <div className="grid items-center w-full h-full p-8 mx-auto max-w-80ch">
          <div className="flex flex-col-reverse">
            <h1
              className="text-6xl font-black tracking-tighter xs:text-7xl md:text-8xl"
              style={{ lineHeight: 0.8 }}
            >
              {title}
            </h1>
            <h2 className="mb-4 text-sm font-semibold tracking-tight uppercase xs:text-lg text-neutral-400">
              {subtitle}
            </h2>
          </div>
          <div>
            <Mdx />
          </div>
        </div>
      </PageContent>
    </Fragment>
  )
}
