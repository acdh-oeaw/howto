import Script from 'next/script'

/**
 * Initializes Matomo analytics.
 */
export function Matomo(): JSX.Element | null {
  if (
    process.env.NEXT_PUBLIC_MATOMO_BASE_URL === undefined ||
    process.env.NEXT_PUBLIC_MATOMO_ID === undefined
  ) {
    return null
  }

  return (
    <Script
      dangerouslySetInnerHTML={{
        __html: `
        var _paq = window._paq = window._paq || [];
        _paq.push(['disableCookies']);
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        _paq.push(['enableHeartBeatTimer']);
        (function() {
          var u="${process.env.NEXT_PUBLIC_MATOMO_BASE_URL}";
          _paq.push(['setTrackerUrl', u+'matomo.php']);
          _paq.push(['setSiteId', '${process.env.NEXT_PUBLIC_MATOMO_ID}']);
          var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
          g.type='text/javascript'; g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
        })();`,
      }}
    />
  )
}
