/** @typedef {import('@/i18n/i18n.config').Locale} Locale */
/** @typedef {Partial<import('next/dist/next-server/server/config-shared').NextConfig> & {i18n?: {locales: Array<Locale>; defaultLocale: Locale}}} NextConfig */

/** @type {NextConfig} */
const config = {
  eslint: {
    dirs: ['src'],
    ignoreDuringBuilds: true,
  },
  future: {
    strictPostcssConfiguration: true,
  },
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
  },
  pageExtensions: ['page.tsx', 'api.ts'],
  poweredByHeader: false,
  async headers() {
    return [
      /** Disallow indexing by search engines. */
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ]
  },
  /** @ts-expect-error Needed for `next-transpile-modules`. */
  webpack5: true,
}

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [
  require('next-transpile-modules')([
    'xdm',
    'unist-util-position-from-estree',
    'estree-util-build-jsx',
    'estree-util-is-identifier-name',
    'periscopic',
    'hast-util-to-estree',
    'comma-separated-tokens',
    'estree-util-attach-comments',
    'hast-util-whitespace',
    'property-information',
    'space-separated-tokens',
    'unist-util-position',
    'zwitch',
  ]),
  /** @ts-expect-error Missing module declaration. */
  require('@stefanprobst/next-svg')({
    svgo: {
      plugins: [
        { prefixIds: true },
        { removeDimensions: true },
        { removeViewBox: false },
      ],
    },
    svgr: {
      titleProp: true,
    },
  }),
]

module.exports = plugins.reduce((config, plugin) => {
  return plugin(config)
}, config)
