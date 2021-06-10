import withSyntaxHighlighting from '@stefanprobst/rehype-shiki'
import type { PreviewTemplateComponentProps } from 'netlify-cms-core'
import { useState, useEffect } from 'react'
import withHeadingIds from 'rehype-slug'
import withFootnotes from 'remark-footnotes'
import withGitHubMarkdown from 'remark-gfm'
import { compile } from 'xdm'

import type { Post as PostData, PostFrontmatter } from '@/cms/api/posts.api'
import { getSyntaxHighlighter } from '@/cms/previews/getSyntaxHighlighter'
import { Preview } from '@/cms/previews/Preview'
import withHeadingLinks from '@/mdx/plugins/rehype-heading-links'
import withImageCaptions from '@/mdx/plugins/rehype-image-captions'
import withLazyLoadingImages from '@/mdx/plugins/rehype-lazy-loading-images'
import withNoReferrerLinks from '@/mdx/plugins/rehype-no-referrer-links'
import { useDebouncedState } from '@/utils/useDebouncedState'
import { Resource } from '@/views/Resource'

/**
 * CMS preview for resource.
 *
 * TODO: Don't recompile mdx when only metadata changes.
 * Need to entry.getIn(['data', 'body']) separately.
 */
export function ResourcePreview(
  props: PreviewTemplateComponentProps,
): JSX.Element {
  const entry = useDebouncedState(props.entry, 250)
  const fieldsMetaData = useDebouncedState(props.fieldsMetaData, 250)
  const [post, setPost] = useState<PostData | null | undefined>(undefined)

  useEffect(() => {
    function resolveRelation(path: Array<string>, id: string) {
      const metadata = fieldsMetaData.getIn([...path, id])
      if (metadata == null) return null
      return { id, ...metadata.toJS() }
    }

    let wasCanceled = false

    async function compileMdx() {
      try {
        const { body, ...partialFrontmatter } = entry.get('data').toJS()
        const frontmatter = partialFrontmatter as Partial<PostFrontmatter>

        const id = entry.get('slug')

        const authors = Array.isArray(frontmatter.authors)
          ? frontmatter.authors
              .map((id) => {
                return resolveRelation(['authors', 'people'], id)
              })
              .filter(Boolean)
          : []

        const contributors = Array.isArray(frontmatter.contributors)
          ? frontmatter.contributors
              .map((id) => {
                return resolveRelation(['contributors', 'people'], id)
              })
              .filter(Boolean)
          : []

        const editors = Array.isArray(frontmatter.editors)
          ? frontmatter.editors
              .map((id) => {
                return resolveRelation(['editors', 'people'], id)
              })
              .filter(Boolean)
          : []

        const tags = Array.isArray(frontmatter.tags)
          ? frontmatter.tags
              .map((id) => {
                return resolveRelation(['tags', 'tags'], id)
              })
              .filter(Boolean)
          : []

        const licence =
          frontmatter.licence != null
            ? resolveRelation(['licence', 'licences'], frontmatter.licence)
            : null

        const metadata = {
          ...frontmatter,
          authors,
          contributors,
          editors,
          tags,
          licence,
        }

        const highlighter = await getSyntaxHighlighter()

        const code = String(
          await compile(body, {
            outputFormat: 'function-body',
            useDynamicImport: false,
            remarkPlugins: [withGitHubMarkdown, withFootnotes],
            rehypePlugins: [
              [withSyntaxHighlighting, { highlighter }],
              withHeadingIds,
              // withExtractedTableOfContents,
              withHeadingLinks,
              withNoReferrerLinks,
              withLazyLoadingImages,
              withImageCaptions,
            ],
          }),
        )

        const post = {
          id,
          code,
          data: {
            metadata,
            toc: [],
          },
        } as PostData

        if (!wasCanceled) {
          setPost(post)
        }
      } catch (error) {
        console.error(error)
        setPost(null)
      }

      return () => {
        wasCanceled = true
      }
    }

    compileMdx()
  }, [entry, fieldsMetaData])

  return (
    <Preview {...props}>
      {post == null ? (
        post === undefined ? (
          <div>
            <p>Trying to render preview...</p>
          </div>
        ) : (
          <div>
            <p>Failed to render preview.</p>
            <p>
              This usually indicates a syntax error in the Markdown content.
            </p>
          </div>
        )
      ) : (
        <Resource resource={post} lastUpdatedAt={null} isPreview />
      )}
    </Preview>
  )
}
