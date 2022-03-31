import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import Link from 'next/link'
import { Fragment } from 'react'

import { PageContent } from '@/common/PageContent'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { useI18n } from '@/i18n/useI18n'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'
import { routes } from '@/navigation/routes.config'
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
  const { title } = metadata as HomePageMetadata

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
        <div className="flex flex-col max-w-6xl gap-16 p-8 py-24 mx-auto xs:py-48">
          <div className="flex flex-col-reverse">
            <h1 className="text-5xl font-black tracking-tighter 2xs:text-6xl xs:text-7xl md:text-8xl">
              {title}
            </h1>

            {/* <h2 className="mb-4 text-sm font-semibold tracking-tight uppercase xs:text-lg text-neutral-400">
              {subtitle}
            </h2> */}
          </div>

          <div className="grid flex-1 gap-4 text-2xl font-medium text-neutral-400">
            <Mdx />
          </div>

          <div className="">
            <Link href={routes.resources({ kind: 'posts' })}>
              <a className="inline-flex px-12 py-4 text-base font-medium tracking-wide text-white uppercase transition rounded xs:text-lg bg-primary-600 hover:bg-primary-700 focus:outline-none focus-visible:ring focus-visible:ring-primary-600">
                {t('common.browse')}
              </a>
            </Link>
          </div>
        </div>
      </PageContent>
    </Fragment>
  )
}
