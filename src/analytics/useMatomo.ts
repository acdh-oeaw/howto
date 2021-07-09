import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'

/**
 * Registers page views at Matomo analytics.
 */
export function useMatomo(): void {
  const router = useRouter()
  const previousUrl = useRef(router.asPath)

  useEffect(() => {
    function registerPageView(url: string) {
      const matomo = (window as typeof window & { _paq?: Array<unknown> })._paq
      if (matomo != null) {
        matomo.push(['setReferrerUrl', previousUrl.current])
        matomo.push(['setCustomUrl', url])
        matomo.push(['setDocumentTitle', document.title])
        matomo.push(['trackPageView'])
      }
      previousUrl.current = url
    }

    router.events.on('routeChangeComplete', registerPageView)

    return () => {
      router.events.off('routeChangeComplete', registerPageView)
    }
  }, [router.events])
}
