import { routes } from '@/navigation/routes.config'

/**
 * Links for navigation menu.
 */
export const navigation = {
  home: {
    href: routes.home(),
  },
  posts: {
    href: routes.resources({ type: 'posts' }),
  },
  // tags: {
  //   href: routes.tags(),
  // },
  imprint: {
    href: routes.imprint(),
  },
} as const
