/** @typedef {import('@/i18n/i18n.config').Locale} Locale */
/** @typedef {import('next').NextConfig & {i18n?: {locales: Array<Locale>; defaultLocale: Locale}}} NextConfig */

import { readFile } from 'node:fs/promises'
import * as path from 'node:path'

import createMdxPlugin from '@next/mdx'
import createSvgPlugin from '@stefanprobst/next-svg'
import withFrontmatter from 'remark-frontmatter'
import withGfm from 'remark-gfm'
import withMdxFrontmatter from 'remark-mdx-frontmatter'

const isProductionDeploy = process.env.NEXT_PUBLIC_BASE_URL === 'https://howto.acdh.oeaw.ac.at'

/** @type {NextConfig} */
const config = {
  eslint: {
    dirs: ['.'],
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
  },
  async headers() {
    const headers = [
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

    /** Disallow indexing by search engines. */
    if (!isProductionDeploy) {
      headers.push({
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      })
    }

    return headers
  },
  output: 'standalone',
  pageExtensions: ['page.tsx', 'api.ts'],
  poweredByHeader: false,
  async redirects() {
    try {
      const resourcesRedirects = JSON.parse(
        await readFile(path.join(process.cwd(), './redirects.resources.json'), {
          encoding: 'utf-8',
        }),
      )
      const coursesRedirects = JSON.parse(
        await readFile(path.join(process.cwd(), './redirects.courses.json'), {
          encoding: 'utf-8',
        }),
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
  typescript: {
    ignoreBuildErrors: true,
  },
}

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [
  createSvgPlugin(),
  createMdxPlugin({
    options: {
      remarkPlugins: [withFrontmatter, [withMdxFrontmatter, { name: 'metadata' }], withGfm],
    },
  }),
]

export default plugins.reduce((config, plugin) => {
  return plugin(config)
}, config)
