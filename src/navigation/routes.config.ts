import type { ResourceKind } from '@/cms/api/resources.api'

/**
 * Named routes.
 */
export const routes = {
  home() {
    return { pathname: '/' }
  },
  cms() {
    return { pathname: '/cms' }
  },
  imprint() {
    return { pathname: '/imprint' }
  },
  resource({ kind, id }: { kind: ResourceKind; id: string }) {
    return { pathname: `/resource/${kind}/${id}` }
  },
  resources({ kind, page = 1 }: { kind: ResourceKind; page?: number }) {
    return { pathname: `/resources/${kind}/page/${page}` }
  },
  author({ id, resourcePage = 1 }: { id: string; resourcePage?: number }) {
    return { pathname: `/author/${id}/page/${resourcePage}` }
  },
  authors({ page = 1 }: { page?: number } = {}) {
    return { pathname: `/authors/page/${page}` }
  },
  tag({ id, resourcePage = 1 }: { id: string; resourcePage?: number }) {
    return { pathname: `/tag/${id}/page/${resourcePage}` }
  },
  tags({ page = 1 }: { page?: number } = {}) {
    return { pathname: `/tags/page/${page}` }
  },
} as const
