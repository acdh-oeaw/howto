import type { CmsCollection, CmsConfig } from 'netlify-cms-core'

import { collection as courses } from '@/cms/collections/courses.collection'
import { collection as licences } from '@/cms/collections/licences.collection'
import { collection as pages } from '@/cms/collections/pages.collection'
import { collection as people } from '@/cms/collections/people.collection'
import { collection as posts } from '@/cms/collections/posts.collection'
import { collection as tags } from '@/cms/collections/tags.collection'
import { url } from '~/config/site.config'

/**
 * CMS collections.
 */
export const collections: Record<string, CmsCollection> = {
  posts,
  people,
  tags,
  courses,
  licences,
  pages,
}

/**
 * Netlify CMS config.
 *
 * @see https://www.netlifycms.org/docs/configuration-options/
 * @see https://www.netlifycms.org/docs/beta-features/
 */
export const config: CmsConfig = {
  site_url: url,
  logo_url: '/assets/images/logo-with-text.svg',
  load_config_file: false,
  local_backend:
    process.env.NEXT_PUBLIC_LOCAL_CMS_URL === undefined ||
    process.env.NEXT_PUBLIC_LOCAL_CMS_URL === ''
      ? false
      : {
          url: process.env.NEXT_PUBLIC_LOCAL_CMS_URL,
        },
  backend: {
    name: 'github',
    repo: process.env.NEXT_PUBLIC_GIT_REPO ?? 'acdh-oeaw/howto',
    branch: process.env.NEXT_PUBLIC_GIT_BRANCH ?? 'main',
    base_url: url,
    auth_endpoint: 'api/auth/github',
    auth_scope: 'public_repo',
    squash_merges: true,
    commit_messages: {
      create: 'content(cms): create {{collection}} "{{slug}}"',
      update: 'content(cms): update {{collection}} "{{slug}}"',
      delete: 'content(cms): delete {{collection}} "{{slug}}"',
      uploadMedia: 'content(cms): upload "{{path}}"',
      deleteMedia: 'content(cms): delete "{{path}}"',
      openAuthoring: '{{message}}',
    },
  },
  publish_mode: 'editorial_workflow',
  show_preview_links: false,
  media_folder: 'public/assets/cms/images',
  public_folder: '/assets/cms/images',
  editor: { preview: false },
  collections: Object.values(collections),
}
