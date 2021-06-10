import type { Locale } from '@/i18n/i18n.config'
import { createUrl } from '@/utils/createUrl'

/**
 * Creates URL to fetch imprint from ACDH imprint service
 *
 * @see https://fundament.acdh.oeaw.ac.at/imprint-service
 */
export function createImprintUrl(locale: Locale): URL {
  return createUrl({
    baseUrl: 'https://shared.acdh.oeaw.ac.at',
    path: '/acdh-common-assets/api/imprint.php',
    query: {
      serviceID: 6848,
      outputLang: locale,
    },
  })
}
