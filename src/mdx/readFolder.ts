import { promises as fs } from 'fs'

import type { FolderPath } from '@/utils/ts/aliases'

/**
 * Reads folder contents and returns file names without extension.
 */
export async function readFolder(
  folderPath: FolderPath,
): Promise<Array<string>> {
  const fileNames = await fs.readdir(folderPath)
  const ids = fileNames

  return ids
}
