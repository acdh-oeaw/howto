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
    const { promises: fs } = require('fs')
    const path = require('path')

    try {
      const resourcesRedirects = JSON.parse(
        await fs.readFile(
          path.join(process.cwd(), './redirects.resources.json'),
          { encoding: 'utf-8' },
        ),
      )
      const coursesRedirects = JSON.parse(
        await fs.readFile(
          path.join(process.cwd(), './redirects.courses.json'),
          {
            encoding: 'utf-8',
          },
        ),
      )

      return [
        ...Object.entries(resourcesRedirects).map(([uuid, id]) => {
          return {
            source: `/id/${uuid}`,
            destination: `/resource/posts/${id}`,
            permanent: false,
          }
        }),
        ...Object.entries(coursesRedirects).map(([uuid, id]) => {
          return {
            source: `/id/${uuid}`,
            destination: `/curriculum/${id}`,
            permanent: false,
          }
        }),
      ]
    } catch {
      return []
    }
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
  webpack(
    /** @type {import('webpack').Configuration} */ config,
    /** @type {{ isServer: boolean; dev: boolean }} */ { isServer, dev },
  ) {
    if (!dev && isServer) {
      /** @type {any} */
      const createEntryPoints = config.entry
      config.entry = async function () {
        return {
          ...(await createEntryPoints()),
          /**
           * We run these scripts through webpack, because we cannot currently run
           * typescript scripts which require esm and tsconfig-paths, i.e. with
           * `node --experimental-specifier-resolution=node --loader ts-node/esm -r tsconfig-paths/register`.
           * In `package.json` scripts we invoke the compiled versions from the `.next/server` folder.
           */
          createFeed: './scripts/createFeed.ts',
          createRedirects: './scripts/createRedirects.ts',
          createSearchIndex: './scripts/createSearchIndex.ts',
          dumpMetadata: './scripts/dumpMetadata.ts',
        }
      }
    }
    return config
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
  /**
   * Because `next.config.js` cannot currently import ESM-only packages, we use
   * this plugin which depends on `xdm@1`.
   *
   * @see https://github.com/vercel/next.js/issues/9607
   */
  /** @ts-expect-error Missing module declaration. */
  require('@stefanprobst/next-mdx')({
    options: {
      remarkPlugins: [
        /** @ts-expect-error Missing module declaration. */
        ...require('@stefanprobst/next-mdx').defaults.remarkPlugins,
        [
          require('remark-mdx-frontmatter').remarkMdxFrontmatter,
          { name: 'metadata' },
        ],
      ],
    },
  }),
]

module.exports = plugins.reduce((config, plugin) => {
  return plugin(config)
}, config)
