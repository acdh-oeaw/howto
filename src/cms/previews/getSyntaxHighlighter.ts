import type { Highlighter } from 'shiki'

/**
 * Returns shiki highlighter intance which works in the browser.
 */
export async function getSyntaxHighlighter(): Promise<Highlighter> {
  const { getHighlighter, setCDN, setOnigasmWASM } = await import(
    /* @ts-expect-error Missing module declaration. */
    'shiki/dist/index.browser.mjs'
  )
  setOnigasmWASM('https://unpkg.com/shiki@0.9.4/dist/onigasm.wasm')
  setCDN('https://unpkg.com/shiki@0.9.4/')
  const highlighter = await getHighlighter({
    theme: 'poimandres',
    // theme: 'material-palenight',
    langs: supportedLanguages,
  })

  return highlighter
}

const supportedLanguages = [
  'css',
  'diff',
  'docker',
  'graphql',
  'java',
  'javascript',
  'js',
  'json',
  'jsx',
  'julia',
  'latex',
  'tex',
  'markdown',
  'md',
  'mdx',
  'perl',
  'php',
  'python',
  'py',
  'r',
  'shell',
  'bash',
  'sh',
  'sparql',
  'sql',
  'ssh-config',
  'svelte',
  'toml',
  'tsx',
  'turtle',
  'typescript',
  'ts',
  'vue',
  'wasm',
  'xml',
  'xsl',
  'yaml',
]
