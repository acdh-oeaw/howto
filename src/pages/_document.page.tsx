import NextDocument, { Html, Head, Main, NextScript } from 'next/document'

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
            href="/assets/fonts/Inter-roman.var-subset.woff2?v=3.18"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/assets/fonts/Inter-italic.var-subset.woff2?v=3.18"
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
