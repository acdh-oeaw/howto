import 'tailwindcss/tailwind.css'
import '@/styles/index.css'

import ErrorBoundary from '@stefanprobst/next-error-boundary'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import type { ComponentType } from 'react'
import { Fragment } from 'react'

import { Matomo } from '@/analytics/Matomo'
import { useMatomo } from '@/analytics/useMatomo'
import { Favicons } from '@/assets/Favicons'
import { WebManifest } from '@/assets/WebManifest'
import { PageLayout } from '@/common/PageLayout'
import { Providers } from '@/common/Providers'
import { ClientError } from '@/error/ClientError'
import { Feed } from '@/metadata/Feed'
import { usePageLoadProgressIndicator } from '@/navigation/usePageLoadProgressIndicator'

/**
 * Shared application shell.
 */
export default function App(props: AppProps): JSX.Element {
  const { Component, pageProps, router } = props

  const Layout =
    (Component as typeof Component & { Layout?: ComponentType }).Layout ??
    PageLayout

  useMatomo()
  usePageLoadProgressIndicator()

  return (
    <Fragment>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Favicons />
      <WebManifest />
      <Feed />
      <Matomo />
      <ErrorBoundary fallback={ClientError} resetOnChange={[router.asPath]}>
        <Providers {...pageProps}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Providers>
      </ErrorBoundary>
    </Fragment>
  )
}
