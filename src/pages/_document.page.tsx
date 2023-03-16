import NextDocument, { Head, Html, Main, NextScript } from 'next/document'

/**
 * Shared document wrapper.
 */
export default class Document extends NextDocument {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link
            rel="preload"
            href="/assets/fonts/inter-var-latin.woff2?v=3.19"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
