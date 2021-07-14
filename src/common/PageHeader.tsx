import Link from 'next/link'

import { useI18n } from '@/i18n/useI18n'
import { useLocale } from '@/i18n/useLocale'
import { navigation } from '@/navigation/navigation.config'

/**
 * Page header.
 */
export function PageHeader(): JSX.Element {
  const { t } = useI18n()

  return (
    <header className="flex items-center justify-between px-8 py-4">
      <Link href={navigation.home.href}>
        <a aria-label={t('common.page.home')}>
          <img
            src="/assets/images/logo.svg"
            alt=""
            className="inline-block h-10"
            height="40"
            width="36"
          />
        </a>
      </Link>
      <PageNavigation />
    </header>
  )
}

/**
 * Main page navigation.
 */
function PageNavigation() {
  const { t } = useI18n()

  return (
    <nav className="flex items-center space-x-8">
      <ul className="flex items-center space-x-8 text-sm font-medium">
        {Object.entries(navigation).map(([route, { href }]) => {
          return (
            <li key={route}>
              <Link href={href}>
                <a>{t(`common.page.${route}`)}</a>
              </Link>
            </li>
          )
        })}
      </ul>
      <LanguageSwitcher />
    </nav>
  )
}

/**
 * Toggles UI language.
 */
function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const { t } = useI18n()

  const languageAlternate = locale === 'de' ? 'en' : 'de'

  function toggleLocale() {
    setLocale(languageAlternate)
  }

  return (
    <button
      onClick={toggleLocale}
      className="p-1.5 text-neutral-100 rounded focus:outline-none bg-neutral-800 text-xs font-medium hover:bg-neutral-700 transition"
    >
      <span className="sr-only">
        {t('common.switchLanguage', {
          language: t(`common.language.${languageAlternate}`),
        })}
      </span>
      <span className="uppercase">{languageAlternate}</span>
    </button>
  )
}
