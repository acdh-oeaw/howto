import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import { Fragment } from 'react'

import { PageContent } from '@/common/PageContent'
import { PageTitle } from '@/common/PageTitle'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { useI18n } from '@/i18n/useI18n'
import { getImprint } from '@/imprint/getImprint'
import { Metadata } from '@/metadata/Metadata'
import type { HtmlString } from '@/utils/ts/aliases'

export interface ImprintPageProps {
  dictionary: Dictionary
  imprintHtml: HtmlString
}

/**
 * Provides translations and imprint html.
 */
export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<ImprintPageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])

  const imprintHtml = await getImprint(locale)

  return {
    props: {
      dictionary,
      imprintHtml,
    },
  }
}

/**
 * Imprint page.
 */
export default function ImprintPage(props: ImprintPageProps): JSX.Element {
  const { imprintHtml } = props

  const { t } = useI18n()

  return (
    <Fragment>
      <Metadata noindex nofollow title={t('common.page.imprint')} />
      <PageContent className="flex flex-col w-full px-10 py-16 mx-auto space-y-10 max-w-80ch">
        <PageTitle>{t('common.imprint')}</PageTitle>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: imprintHtml }}
        />
      </PageContent>
    </Fragment>
  )
}
