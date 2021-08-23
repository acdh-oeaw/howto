import { join } from 'path'

import * as YAML from 'js-yaml'
import type { VFile } from 'vfile'

import type { Locale } from '@/i18n/i18n.config'
import { readFile } from '@/mdx/readFile'
import { readFolder } from '@/mdx/readFolder'
import type { FilePath } from '@/utils/ts/aliases'

const tagsFolder = join(process.cwd(), 'content', 'tags')
const tagExtension = '.yml'

export interface TagId {
  /** Slug. */
  id: string
}

type ID = TagId['id']

export interface TagYaml {
  name: string
  description: string
}

export type TagData = TagYaml

export interface Tag extends TagId, TagData {}

/**
 * Returns all tag ids (slugs).
 */
export async function getTagIds(_locale: Locale): Promise<Array<string>> {
  const ids = await readFolder(tagsFolder, tagExtension)

  return ids
}

/**
 * Returns tag data.
 */
export async function getTagById(id: ID, locale: Locale): Promise<Tag> {
  const file = await getTagFile(id, locale)
  const data = await getTagData(file, locale)

  return { id, ...data }
}

/**
 * Returns data for all tags, sorted by name.
 */
export async function getTags(locale: Locale): Promise<Array<Tag>> {
  const ids = await getTagIds(locale)

  const data = await Promise.all(
    ids.map(async (id) => {
      return getTagById(id, locale)
    }),
  )

  data.sort((a, b) => {
    return a.name.localeCompare(b.name, locale)
  })

  return data
}

/**
 * Reads tag file.
 */
async function getTagFile(id: ID, locale: Locale): Promise<VFile> {
  const filePath = getTagFilePath(id, locale)
  const file = await readFile(filePath)

  return file
}

/**
 * Returns file path for tag.
 */
export function getTagFilePath(id: ID, _locale: Locale): FilePath {
  const filePath = join(tagsFolder, id + tagExtension)

  return filePath
}

/**
 * Returns tag data.
 */
async function getTagData(file: VFile, _locale: Locale): Promise<TagData> {
  const data = YAML.load(String(file), { schema: YAML.CORE_SCHEMA }) as TagData

  return data
}
