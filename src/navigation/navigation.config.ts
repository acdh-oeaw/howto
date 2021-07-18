import { routes } from '@/navigation/routes.config'

/**
 * Links for navigation menu.
 */
export const navigation = {
  home: {
    href: routes.home(),
  },
  posts: {
    href: routes.resources({ kind: 'posts' }),
  },
  courses: {
    href: routes.courses(),
  },
  tags: {
    href: routes.tags(),
  },
  authors: {
    href: routes.authors(),
  },
  imprint: {
    href: routes.imprint(),
  },
} as const
