import { useSiteMetadata } from '@/metadata/useSiteMetadata'

/**
 * Page footer.
 */
export function PageFooter(): JSX.Element {
  const { creator } = useSiteMetadata()

  return (
    <footer className="flex justify-end px-4 py-8">
      <small>
        <span>&copy; </span>
        {creator != null ? (
          <a href={creator.website} target="_blank" rel="noopener noreferrer">
            {creator.shortName ?? creator.name}
          </a>
        ) : null}
        <span> {new Date().getFullYear()}</span>
      </small>
    </footer>
  )
}
