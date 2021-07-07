import { randomBytes } from 'crypto'

import type { NextApiRequest, NextApiResponse } from 'next'

import { url as baseUrl } from '~/config/site.config'

/**
 * Initiates GitHub OAuth2 auth code flow.
 */
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
): Promise<void> {
  const { provider, scope } = request.query

  if (
    provider === undefined ||
    Array.isArray(provider) ||
    provider !== 'github' ||
    process.env.GITHUB_ID === undefined ||
    scope === undefined ||
    Array.isArray(scope)
  ) {
    return response.status(400).end()
  }

  const redirectUri = new URL('/api/auth/callback', baseUrl)
  const state = randomBytes(64).toString('hex')

  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', process.env.GITHUB_ID)
  url.searchParams.set('redirect_uri', String(redirectUri))
  url.searchParams.set('scope', scope)
  url.searchParams.set('state', state)

  response.redirect(302, String(url))
}
