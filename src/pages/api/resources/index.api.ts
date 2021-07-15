import type { NextApiRequest, NextApiResponse } from 'next'

import { getPostPreviews } from '@/cms/api/posts.api'

const locale = 'en'

const cache = new Map()
const resourcesCacheKey = 'resources'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  if (!cache.has(resourcesCacheKey)) {
    cache.set(resourcesCacheKey, getPostPreviews(locale))
  }

  const resources = await cache.get(resourcesCacheKey)

  response.json({ resources })
}
