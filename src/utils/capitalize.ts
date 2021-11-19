/**
 * Capitalizes a unicode string.
 */
export function capitalize(str: string): string {
  if (str === '') return str
  const first = String.fromCodePoint(
    str.codePointAt(0)
  )
  return first.toUpperCase() + str.slice(first.length)
}
