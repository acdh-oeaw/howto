/** @typedef {import('@/i18n/i18n.config').Locale} Locale */
/** @typedef {import('next').NextConfig & {i18n?: {locales: Array<Locale>; defaultLocale: Locale}}} NextConfig */
/** @typedef {import('webpack').Configuration} WebpackConfig} */

/** @type {NextConfig} */
const config = {
  eslint: {
    dirs: ['.'],
    ignoreDuringBuilds: true,
  },
  experimental: {
    esmExternals: true,
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
      {
        source: '/assets/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, immutable, max-age=31536000',
          },
        ],
      },
    ]
  },
  async redirects() {
    const redirects = require('./redirects.resources.json')
    return Object.entries(redirects).map(([uuid, id]) => {
      return {
        source: `/id/${uuid}`,
        destination: `/resource/posts/${id}`,
        permanent: false,
      }
    })
  },
  async rewrites() {
    return [
      { source: '/resources/:type', destination: '/resources/:type/page/1' },
      { source: '/curricula', destination: '/curricula/page/1' },
      { source: '/authors', destination: '/authors/page/1' },
      { source: '/author/:id', destination: '/author/:id/page/1' },
      { source: '/tags', destination: '/tags/page/1' },
      { source: '/tag/:id', destination: '/tag/:id/page/1' },
    ]
  },
}

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [
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
  function (nextConfig = {}) {
    return {
      ...nextConfig,
      /** @type {(config: WebpackConfig, options: any) => WebpackConfig} */
      webpack(config, options) {
        /* @ts-expect-error */
        config.module.rules.push({
          test: /\.mdx?$/,
          use: [
            options.defaultLoaders.babel,
            {
              loader: require.resolve('xdm/webpack.cjs'),
              options: {
                remarkPlugins: [
                  require('remark-gfm'),
                  require('remark-frontmatter'),
                  [
                    require('remark-mdx-frontmatter').remarkMdxFrontmatter,
                    { name: 'metadata' },
                  ],
                ],
              },
            },
          ],
        })

        if (typeof nextConfig.webpack === 'function') {
          return nextConfig.webpack(config, options)
        }

        return config
      },
    }
  },
]

module.exports = plugins.reduce((config, plugin) => {
  return plugin(config)
}, config)
