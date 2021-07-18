import type { CmsCollection } from 'netlify-cms-core'

/**
 * Courses collection.
 */
export const collection: CmsCollection = {
  name: 'courses',
  label: 'Curricula',
  label_singular: 'Curriculum',
  description: '',
  folder: 'content/courses',
  path: '{{slug}}/index',
  format: 'frontmatter',
  extension: 'mdx',
  create: true,
  delete: false,
  slug: '{{slug}}',
  media_folder: 'images',
  public_folder: 'images',
  preview_path: 'courses/{{slug}}',
  editor: { preview: true },
  sortable_fields: ['commit_date', 'date', 'title', 'commit_author'],
  view_groups: [
    {
      label: 'Year',
      field: 'date',
      pattern: '\\d{4}',
    },
  ],
  fields: [
    {
      name: 'title',
      label: 'Title',
      hint: '',
    },
    {
      name: 'shortTitle',
      label: 'Short title',
      hint: '',
      required: false,
    },
    {
      name: 'lang',
      label: 'Language',
      hint: '',
      widget: 'select',
      options: [
        {
          label: 'English',
          value: 'en',
        },
        {
          label: 'Deutsch',
          value: 'de',
        },
      ],
      default: 'en',
    },
    {
      name: 'date',
      label: 'Publication date',
      hint: '',
      widget: 'datetime',
      date_format: 'DD/MM/YYYY',
      time_format: false,
      picker_utc: true,
      default: '',
    },
    {
      name: 'version',
      label: 'Version',
      hint: '',
      default: '1.0.0',
    },
    // {
    //   name: 'authors',
    //   label: 'Authors',
    //   hint: '',
    //   widget: 'relation',
    //   collection: 'people',
    //   multiple: true,
    //   value_field: '{{slug}}',
    //   search_fields: ['firstName', 'lastName'],
    //   display_fields: ['{{firstName}} {{lastName}}'],
    // },
    {
      name: 'editors',
      label: 'Editors',
      hint: '',
      required: false,
      widget: 'relation',
      collection: 'people',
      multiple: true,
      value_field: '{{slug}}',
      search_fields: ['firstName', 'lastName'],
      display_fields: ['{{firstName}} {{lastName}}'],
    },
    // {
    //   name: 'contributors',
    //   label: 'Contributors',
    //   hint: '',
    //   required: false,
    //   widget: 'relation',
    //   collection: 'people',
    //   multiple: true,
    //   value_field: '{{slug}}',
    //   search_fields: ['firstName', 'lastName'],
    //   display_fields: ['{{firstName}} {{lastName}}'],
    // },
    {
      name: 'tags',
      label: 'Tags',
      hint: '',
      widget: 'relation',
      collection: 'tags',
      multiple: true,
      value_field: '{{slug}}',
      search_fields: ['name'],
      display_fields: ['name'],
    },
    {
      name: 'featuredImage',
      label: 'Featured image',
      hint: '',
      required: false,
      widget: 'image',
    },
    {
      name: 'abstract',
      label: 'Abstract',
      hint: '',
      widget: 'text',
    },
    {
      name: 'body',
      label: 'Content',
      hint: '',
      widget: 'markdown',
      editor_components: [
        'image',
        'code-block',
        'Download',
        'Video',
        'SideNote',
      ],
    },
    // {
    //   name: 'licence',
    //   label: 'Licence',
    //   hint: '',
    //   widget: 'relation',
    //   collection: 'licences',
    //   value_field: '{{slug}}',
    //   search_fields: ['name'],
    //   display_fields: ['name'],
    //   default: 'ccby-4.0',
    // },
    // {
    //   name: 'toc',
    //   label: 'Show Table of Contents',
    //   hint: '',
    //   required: false,
    //   widget: 'boolean',
    //   default: false,
    // },
  ],
}
