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
  resource({ type, id }: { type: string; id: string }) {
    return { pathname: `/resource/${type}/${id}` }
  },
  resources({ type, page = 1 }: { type: string; page?: number }) {
    return { pathname: `/resources/${type}/page/${page}` }
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
