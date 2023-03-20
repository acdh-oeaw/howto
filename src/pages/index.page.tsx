import type { GetStaticPropsContext, GetStaticPropsResult } from 'next'
import Link from 'next/link'
import { Fragment } from 'react'

import type { PostPreview } from '@/cms/api/posts.api'
import { getPostPreviews } from '@/cms/api/posts.api'
import { PageContent } from '@/common/PageContent'
import { getLocale } from '@/i18n/getLocale'
import type { Dictionary } from '@/i18n/loadDictionary'
import { loadDictionary } from '@/i18n/loadDictionary'
import { useI18n } from '@/i18n/useI18n'
import { Metadata } from '@/metadata/Metadata'
import { useAlternateUrls } from '@/metadata/useAlternateUrls'
import { useCanonicalUrl } from '@/metadata/useCanonicalUrl'
import { routes } from '@/navigation/routes.config'
import { ResourcesList } from '@/views/ResourcesList'

const texts = {
  en: 'Welcome to ACDH-CH Learning Resources. This website gathers interactive learning material, practical HowTo articles and best practices on a wide range of Digital Humanities topics, methododologies and infrastructures. These resources can be used for self-guided learning as well as for teaching in higher education. It is part of our mission to actively transfer knowledge from ongoing research into the wider Digital Humanities Community as well as to educate a new generation of humanities researchers with digital methods.',
  de: 'Willkommen bei den ACDH-CH Lernressourcen. Hier finden Sie interaktives Lernmaterial, praktische HowTo-Artikel und Best Practices Beispiele zu einem breiten Spektrum von Themen, Methoden und Infrastrukturen aus den Digital Humanities. Diese Ressourcen können sowohl für das selbstgesteuerte Lernen als auch für die Lehre im Hochschulbereich genutzt werden. Es ist Teil unserer Mission, Wissen aus der laufenden Forschung aktiv in die breitere Digital Humanities Community zu transferieren und damit eine neue Generation von Geisteswissenschaftlern in der Nutzung von digitalen Methoden auszubilden.',
}

export interface HomePageMetadata extends Record<string, unknown> {
  title: string
  subtitle: string
}

export interface HomePageProps {
  dictionary: Dictionary
  locale: 'de' | 'en'
  posts: Array<PostPreview>
  text: string
}

/**
 * Provides translations.
 */
export async function getStaticProps(
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<HomePageProps>> {
  const { locale } = getLocale(context)

  const dictionary = await loadDictionary(locale, ['common'])
  const posts = (await getPostPreviews(locale)).slice(0, 4)
  const text = texts[locale]

  return {
    props: {
      dictionary,
      locale,
      posts,
      text,
    },
  }
}

/**
 * Home page.
 */
export default function HomePage(props: HomePageProps): JSX.Element {
  const { locale, posts, text } = props

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
      <PageContent className="bg-brand-black text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 p-8 py-24 xs:py-48">
          <div className="flex flex-col-reverse">
            <h1 className="text-5xl font-black tracking-tighter 2xs:text-6xl xs:text-7xl">
              {locale === 'de' ? (
                <Fragment>
                  <span className="text-brand-light-blue">Teilen</span> und{' '}
                  <span className="text-brand-light-blue">erweitern</span> Sie Ihr Wissen im Bereich{' '}
                  <span className="text-brand-turquoise">Digital Humanities</span>
                </Fragment>
              ) : (
                <Fragment>
                  <span className="text-brand-light-blue">Share</span> and{' '}
                  <span className="text-brand-light-blue">expand</span> your knowledge in{' '}
                  <span className="text-brand-turquoise">Digital Humanities</span>
                </Fragment>
              )}
            </h1>
          </div>

          <div className="grid flex-1 gap-4 text-xl font-medium leading-relaxed text-neutral-300">
            {text}
          </div>

          <section className="my-12 grid gap-12">
            <div className="flex items-center justify-between border-b py-3">
              <h2 className="text-2xl font-bold text-neutral-100">{t(['common', 'new-posts'])}</h2>
              <Link
                className="inline-flex items-center rounded bg-brand-blue px-6 py-2 font-medium text-brand-black transition hover:bg-brand-light-blue focus:bg-brand-light-blue"
                href={routes.resources({ kind: 'posts' })}
              >
                  {t(['common', 'see-all-posts'])}
              </Link>
            </div>
            <ResourcesList posts={posts} />
          </section>
        </div>
      </PageContent>
    </Fragment>
  )
}
