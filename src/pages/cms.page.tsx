import dynamic from 'next/dynamic'
import { Fragment, memo } from 'react'

import { Metadata } from '@/metadata/Metadata'

/**
 * Lazy-loads CMS on the client, because Netlify CMS cannot be server-rendered.
 */
const Cms = dynamic(
  async () => {
    const { nanoid } = await import('nanoid')
    /**
     * We cannot use the ESM build because `netlify-cms-app` imports global css,
     * which is disallowed by Next.js.
     */
    const { default: Cms } = await import('netlify-cms-app')
    const { config } = await import('@/cms/cms.config')
    const { collection: posts } = await import('@/cms/collections/posts.collection')
    const { collection: courses } = await import('@/cms/collections/courses.collection')
    const { ResourcePreview } = await import('@/cms/previews/ResourcePreview')
    const { CoursePreview } = await import('@/cms/previews/CoursePreview')
    const { downloadWidget } = await import('@/cms/widgets/Download')
    const { figureEditorWidget } = await import('@/cms/widgets/Figure')
    const { sideNoteEditorWidget } = await import('@/cms/widgets/SideNote')
    const { videoEditorWidget } = await import('@/cms/widgets/Video')
    const { quizEditorWidget } = await import('@/cms/widgets/Quiz')
    const { tabsEditorWidget } = await import('@/cms/widgets/Tabs')
    const { default: withResourceLinks } = await import('@stefanprobst/remark-resource-links')

    Cms.init({ config })

    /**
     * Generate UUIDs for collections.
     */
    Cms.registerEventListener({
      name: 'preSave',
      handler({ entry }) {
        const collections = [posts.name, courses.name]

        const data = entry.get('data')

        if (!collections.includes(entry.get('collection'))) {
          return data
        }

        if (data.get('uuid') == null) {
          return data.set('uuid', nanoid())
        }

        return data
      },
    })

    /**
     * Register preview styles.
     *
     * These are created in a `prebuild` script with `postcss-cli`.
     */
    Cms.registerPreviewStyle('/assets/css/tailwind.css')
    Cms.registerPreviewStyle('/assets/css/index.css')

    /**
     * Register preview templates for collections.
     */
    Cms.registerPreviewTemplate(posts.name, memo(ResourcePreview))
    Cms.registerPreviewTemplate(courses.name, memo(CoursePreview))

    /**
     * Register richtext editor widgets.
     */
    Cms.registerEditorComponent(downloadWidget)
    Cms.registerEditorComponent(figureEditorWidget)
    Cms.registerEditorComponent(sideNoteEditorWidget)
    Cms.registerEditorComponent(videoEditorWidget)
    Cms.registerEditorComponent(quizEditorWidget)
    Cms.registerEditorComponent(tabsEditorWidget)

    /**
     * Register plugins to the richtext editor widget to (i) avoid saving
     * autolinks, and (ii) enforce serialisation that is closer to `prettier`'s
     * format.
     */
    Cms.registerRemarkPlugin(withResourceLinks)
    Cms.registerRemarkPlugin({
      settings: {
        bullet: '-',
        emphasis: '_',
      },
      plugins: [],
    })

    return function () {
      return null
    }
  },
  {
    ssr: false,
    loading: function Loading(props) {
      const { error, pastDelay, retry, timedOut } = props

      const message =
        error != null ? (
          <div>
            Failed to load CMS! <button onClick={retry}>Retry</button>
          </div>
        ) : timedOut === true ? (
          <div>
            Taking a long time to load CMS&hellip; <button onClick={retry}>Retry</button>
          </div>
        ) : pastDelay === true ? (
          <div>Loading CMS&hellip;</div>
        ) : null

      return <div className="grid min-h-screen place-items-center">{message}</div>
    },
  },
)

/**
 * CMS page.
 */
export default function CmsPage(): JSX.Element {
  return (
    <Fragment>
      <Metadata noindex nofollow title="CMS" />
      <div id="nc-root" />
      <style jsx global>
        {`
          /* Temporary workaround to stop tailwind reset bleeding into richtext editor. */
          /* Should be fixed upstream: Netlify CMS richtext editor should explicitly set styles.
             and not rely on browser defaults. */
          #nc-root .cms-editor-visual div[data-slate-editor='true'] ul {
            list-style: disc;
          }
          #nc-root .cms-editor-visual div[data-slate-editor='true'] ol {
            list-style: decimal;
          }
          #nc-root .cms-editor-visual div[data-slate-editor='true'] h1,
          #nc-root .cms-editor-visual div[data-slate-editor='true'] h2,
          #nc-root .cms-editor-visual div[data-slate-editor='true'] h3,
          #nc-root .cms-editor-visual div[data-slate-editor='true'] h4,
          #nc-root .cms-editor-visual div[data-slate-editor='true'] h5 {
            margin-bottom: 1rem;
            line-height: 1.125;
          }
        `}
      </style>
      <Cms />
    </Fragment>
  )
}

CmsPage.Layout = Fragment

// @refresh reset
