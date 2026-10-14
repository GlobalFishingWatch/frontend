import { createHighlighter } from '@tanstack/highlight/core'
import { html } from '@tanstack/highlight/languages/html'
import { plaintext } from '@tanstack/highlight/languages/plaintext'
import { createTanStackMarkdownHighlighter } from '@tanstack/highlight/markdown'
import type { CodeHighlighter } from '@tanstack/markdown'

// import { css } from '@tanstack/highlight/languages/css'
// import { diff } from '@tanstack/highlight/languages/diff'
// import { js } from '@tanstack/highlight/languages/js'
// import { json } from '@tanstack/highlight/languages/json'
// import { jsx } from '@tanstack/highlight/languages/jsx'
// import { python } from '@tanstack/highlight/languages/python'
// import { shell } from '@tanstack/highlight/languages/shell'
// import { sql } from '@tanstack/highlight/languages/sql'
// import { ts } from '@tanstack/highlight/languages/ts'
// import { tsx } from '@tanstack/highlight/languages/tsx'
// import { yaml } from '@tanstack/highlight/languages/yaml'

const highlighter = createHighlighter({
  languages: [
    plaintext,
    html,
    // json,
    // js,
    // ts,
    // tsx,
    // jsx,
    // css,
    // shell,
    // sql,
    // python,
    // yaml,
    // diff,
  ],
})

export const highlightMarkdownCode: CodeHighlighter = createTanStackMarkdownHighlighter(highlighter)
