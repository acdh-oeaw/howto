import { useLocale } from '@/i18n/useLocale'

// TODO: put in /config
const url = {
  en: 'https://www.oeaw.ac.at/acdh',
  de: 'https://www.oeaw.ac.at/de/acdh',
}

/**
 * Page footer.
 */
export function PageFooter(): JSX.Element {
  const { locale } = useLocale()

  return (
    <footer className="py-8 px-4 flex justify-end">
      <small>
        &copy; <a href={url[locale]}>ACDH-CH</a> 2021
      </small>
    </footer>
  )
}
