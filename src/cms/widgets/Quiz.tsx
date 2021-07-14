import type { EditorComponentOptions } from 'netlify-cms-core'
import remark from 'remark'
import withFootnotes from 'remark-footnotes'
import withGitHubMarkdown from 'remark-gfm'
import type { Node } from 'unist'
import visit from 'unist-util-visit'
import type { VFile } from 'vfile'
import { remarkMarkAndUnravel as withUnraveledJsxChildren } from 'xdm/lib/plugin/remark-mark-and-unravel.js'
import { remarkMdx as withMdx } from 'xdm/lib/plugin/remark-mdx.js'

function withQuizCards() {
  return transformer

  function transformer(tree: Node, file: VFile) {
    const cards: Array<any> = []

    ;(file.data as any).cards = cards

    visit(tree, 'mdxJsxFlowElement', onMdx)

    function onMdx(node: Node) {
      switch (node.name) {
        case 'Quiz.Card': {
          cards.push({})
          break
        }
        case 'Quiz.Question': {
          const last = cards[cards.length - 1]
          last.question = processor.stringify({
            type: 'root',
            children: node.children,
          })
          break
        }
        case 'Quiz.MultipleChoice': {
          const last = cards[cards.length - 1]
          last.name = 'MultipleChoice'
          last.type = 'MultipleChoice'
          last.question = ''
          last.options = []
          break
        }
        case 'Quiz.MultipleChoice.Option': {
          const last = cards[cards.length - 1]
          last.options.push({
            option: processor.stringify({
              type: 'root',
              children: node.children,
            }),
            // @ts-expect-error Attributes exist.
            isCorrect: node.attributes.some(
              (attribute: any) =>
                attribute.name === 'isCorrect' && attribute.value !== false,
            ),
          })
          break
        }
        case 'Quiz.XmlCodeEditor': {
          const last = cards[cards.length - 1]
          last.name = 'XmlCodeEditor'
          last.type = 'XmlCodeEditor'
          last.question = ''

          const code =
            // @ts-expect-error Attributes exist.
            node.attributes.find(
              (attribute: any) => attribute.name === 'code',
            ) ?? ''
          const solution =
            // @ts-expect-error Attributes exist.
            node.attributes.find(
              (attribute: any) => attribute.name === 'solution',
            ) ?? ''

          last.code = code
          last.solution = solution
          last.validate = 'input'
          break
        }
      }
    }
  }
}

const processor = remark()
  .use({
    settings: {
      bullet: '-',
      emphasis: '_',
      fences: true,
      incrementListMarker: true,
      listItemIndent: 'one',
      resourceLink: true,
      rule: '-',
      strong: '*',
    },
  })
  .use(withMdx)
  .use(withUnraveledJsxChildren)
  .use(withGitHubMarkdown)
  .use(withFootnotes)
  .use(withQuizCards)

/**
 * Netlify CMS richtext editor widget for Quiz component.
 */
export const quizEditorWidget: EditorComponentOptions = {
  id: 'Quiz',
  label: 'Quiz',
  fields: [
    {
      name: 'cards',
      label: 'Cards',
      // @ts-expect-error Missing in upstream type.
      label_singular: 'Card',
      widget: 'list',
      types: [
        {
          name: 'MultipleChoice',
          type: 'MultipleChoice',
          label: 'Multiple Choice',
          widget: 'object',
          fields: [
            {
              name: 'question',
              label: 'Question',
              widget: 'markdown',
              editor_components: ['image', 'code-block'],
              modes: ['raw'],
            },
            {
              name: 'options',
              label: 'Options',
              label_singular: 'Option',
              widget: 'list',
              min: 1,
              fields: [
                {
                  name: 'option',
                  label: 'Option',
                  widget: 'markdown',
                  editor_components: ['image', 'code-block'],
                  modes: ['raw'],
                },
                {
                  name: 'isCorrect',
                  label: 'Is correct answer?',
                  widget: 'boolean',
                },
              ],
            },
          ],
        },
        {
          name: 'XmlCodeEditor',
          type: 'XmlCodeEditor',
          label: 'XML Code Editor',
          widget: 'object',
          fields: [
            {
              name: 'question',
              label: 'Question',
              widget: 'markdown',
              editor_components: ['image', 'code-block'],
              modes: ['raw'],
            },
            {
              name: 'code',
              label: 'Code',
              widget: 'code',
              default_language: 'xml',
              allow_language_selection: false,
              output_code_only: true,
              default: '<xml></xml>',
            },
            {
              name: 'solution',
              label: 'Solution',
              widget: 'code',
              default_language: 'xml',
              allow_language_selection: false,
              output_code_only: true,
              default: '<xml></xml>',
            },
            {
              name: 'validate',
              label: 'Validate',
              widget: 'select',
              options: [
                { value: 'input', label: 'Input' },
                { value: 'selection', label: 'Selection' },
              ],
            },
          ],
        },
      ],
    },
  ],
  pattern: /^<Quiz>\n([^]*?)\n<\/Quiz>/,
  fromBlock(match) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const children = match[1]!

    const ast = processor.parse(children)
    const file = { data: {} }
    processor.runSync(ast, file)
    // @ts-expect-error Cards are mutated in the transformer.
    const cards = file.data.cards

    return {
      cards,
    }
  },
  toBlock(data) {
    const cards = data.cards ?? []

    const ast = {
      type: 'root',
      children: [
        {
          type: 'mdxJsxFlowElement',
          name: 'Quiz',
          children: cards.map((card: any) => {
            const children: Array<any> = []

            switch (card.type) {
              case 'MultipleChoice': {
                children.push({
                  type: 'mdxJsxFlowElement',
                  name: `Quiz.${card.type}`,
                  children: [
                    {
                      type: 'mdxJsxFlowElement',
                      name: 'Quiz.Question',
                      children: [processor.parse(card.question)],
                    },
                    ...(card.options?.map((option: any) => {
                      return {
                        type: 'mdxJsxFlowElement',
                        name: 'Quiz.MultipleChoice.Option',
                        children: [processor.parse(option.option)],
                        attributes:
                          option.isCorrect === true
                            ? [
                                {
                                  type: 'mdxJsxAttribute',
                                  name: 'isCorrect',
                                  value: null,
                                },
                              ]
                            : [],
                      }
                    }) ?? []),
                  ],
                })

                break
              }
              case 'XmlCodeEditor': {
                const attributes: Array<any> = []

                if (card.code != null) {
                  attributes.push({
                    type: 'mdxJsxAttribute',
                    name: 'code',
                    value: card.code,
                  })
                }
                if (card.solution != null) {
                  attributes.push({
                    type: 'mdxJsxAttribute',
                    name: 'solution',
                    value: card.solution,
                  })
                }
                if (card.validate != null) {
                  attributes.push({
                    type: 'mdxJsxAttribute',
                    name: 'validate',
                    value: card.validate,
                  })
                }

                children.push({
                  type: 'mdxJsxFlowElement',
                  name: `Quiz.${card.type}`,
                  attributes,
                  children: [
                    {
                      type: 'mdxJsxFlowElement',
                      name: 'Quiz.Question',
                      children: [processor.parse(card.question)],
                    },
                  ],
                })

                break
              }
            }

            return {
              type: 'mdxJsxFlowElement',
              name: 'Quiz.Card',
              children,
            }
          }),
        },
      ],
    }

    return String(processor.stringify(ast))
  },
  /**
   * This is only used in `getWidgetFor` (which we don't use).
   */
  toPreview() {
    return `Quiz`
  },
}
