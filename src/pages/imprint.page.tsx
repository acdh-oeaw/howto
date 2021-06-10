import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'

import { PageContent } from '@/common/PageContent'
import { PageTitle } from '@/common/PageTitle'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { getImprint } from '@/imprint/getImprint'
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

  return (
    <PageContent className="max-w-80ch w-full mx-auto p-8">
      <PageTitle>Imprint</PageTitle>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: imprintHtml }}
      />
    </PageContent>
  )
}
