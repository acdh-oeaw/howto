import Head from 'next/head'

import type { IsoDateString } from '@/utils/ts/aliases'

export interface DublinCoreProps {
  title: string
  date: IsoDateString
  authors: Array<string>
  contributors?: Array<string>
  lang: string
  abstract: string
  licence: string
  tags: Array<string>
  siteTitle: string
}

/**
 * Adds DublinCore metadata.
 *
 * @see https://www.dublincore.org/specifications/dublin-core/dc-html/
 */
export function DublinCore(props: DublinCoreProps): JSX.Element {
  const {
    title,
    date,
    authors,
    contributors,
    lang,
    abstract,
    licence,
    tags,
    siteTitle,
  } = props

  return (
    <Head>
      <link rel="schema.DCTERMS" href="http://purl.org/dc/terms/" />
      <link rel="schema.DC" href="http://purl.org/dc/elements/1.1/" />

      <meta name="DC.title" content={title} />
      {authors.map((author, index) => {
        return <meta key={index} name="DC.creator" content={author} />
      })}
      {contributors != null
        ? contributors.map((contributor, index) => {
            return (
              <meta key={index} name="DC.contributor" content={contributor} />
            )
          })
        : null}
      {tags.map((tag, index) => {
        return <meta key={index} name="DC.subject" content={tag} />
      })}
      {/* DC.rights */}
      <meta name="DCTERMS.license" content={licence} />
      <meta name="DC.language" content={lang} />
      <meta name="DCTERMS.issued" content={date} />
      {/* DC.description */}
      <meta name="DCTERMS.abstract" content={abstract} />
      <meta name="DC.publisher" content={siteTitle} />
      {/* <meta name="DC.type" content="Text" /> */}
    </Head>
  )
}
