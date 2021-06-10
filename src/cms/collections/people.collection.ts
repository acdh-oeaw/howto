import type { CmsCollection } from 'netlify-cms-core'

import * as validation from '@/cms/utils/validation'

/**
 * People collection.
 */
export const collection: CmsCollection = {
  name: 'people',
  label: 'People',
  label_singular: 'Person',
  description: '',
  folder: 'content/people',
  path: '{{slug}}',
  // TODO: move to folders (to be able to colocate images)
  // path: '{{slug}}/index',
  identifier_field: 'lastName',
  format: 'yml',
  create: true,
  delete: false,
  slug: '{{lastName}}-{{firstName}}',
  summary: '{{firstName}} {{lastName}}',
  media_folder: '../../{{media_folder}}/people',
  public_folder: '{{public_folder}}/people',
  // TODO:
  // media_folder: '', // set `images` folder on widget level
  // public_folder: '', // set `images` folder on widget level
  preview_path: 'people/{{slug}}',
  sortable_fields: ['commit_date', 'lastName'],
  fields: [
    {
      name: 'firstName',
      label: 'First name',
      hint: '',
    },
    {
      name: 'lastName',
      label: 'Last name',
      hint: '',
    },
    {
      name: 'title',
      label: 'Title',
      hint: '',
      required: false,
    },
    {
      name: 'description',
      label: 'Description',
      hint: '',
      required: false,
      widget: 'text',
    },
    {
      name: 'avatar',
      label: 'Image',
      hint: '',
      required: false,
      widget: 'image',
      media_folder: 'images',
      public_folder: 'images',
    },
    {
      name: 'email',
      label: 'Email',
      hint: '',
      required: false,
      pattern: [validation.isEmailLike, 'Must be a valid Email address'],
    },
    {
      name: 'twitter',
      label: 'Twitter handle',
      hint: '',
      required: false,
      pattern: [validation.isTwitterHandle, 'Must start with @'],
    },
    {
      name: 'website',
      label: 'Website',
      hint: '',
      required: false,
      pattern: [validation.isUrl, 'Must be a valid URL'],
    },
    {
      name: 'orcid',
      label: 'ORCID',
      hint: '',
      required: false,
    },
  ],
}
