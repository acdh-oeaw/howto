/**
 * Pick n random items from array.
 */
export function pickRandom<T extends { id: string }>(
  items: Array<T>,
  n: number,
): Array<T> {
  const picked = new Map<string, T>()

  if (items.length <= n) {
    items.forEach((item) => {
      picked.set(item.id, item)
    })
  } else {
    while (picked.size < n) {
      /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
      const item = items[Math.floor(Math.random() * items.length)]!
      picked.set(item.id, item)
    }
  }

  return Array.from(picked.values())
}
