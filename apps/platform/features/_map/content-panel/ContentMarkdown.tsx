import { type ComponentProps } from 'react'
import { streamingMarkdownExtension } from '@tanstack/markdown/extensions/streaming'
import { Markdown, type MarkdownComponents } from '@tanstack/markdown/react'

import { highlightMarkdownCode } from 'features/_map/content-panel/markdown-highlighter'
import MarkdownIframe from 'features/_map/content-panel/MarkdownIframe'
import MarkdownImage from 'features/_map/content-panel/MarkdownImage'
import MarkdownLink from 'features/_map/content-panel/MarkdownLink'

import './ContentMarkdownHighlight.css'

type ContentMarkdownProps = {
  children?: string | null
  variant?: 'default' | 'chat'
}

const chatExtensions = [streamingMarkdownExtension()]

const components = {
  a: MarkdownLink,
  img: MarkdownImage,
  iframe: MarkdownIframe,
  table: (props: ComponentProps<'table'>) => (
    <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
      <table {...props} />
    </div>
  ),
} satisfies MarkdownComponents

const ContentMarkdown = ({ children, variant = 'default' }: ContentMarkdownProps) => {
  if (!children) return null

  const isChat = variant === 'chat'

  return (
    <div className="content-markdown">
      <Markdown
        components={components}
        highlighter={highlightMarkdownCode}
        allowHtml={!isChat}
        extensions={isChat ? chatExtensions : undefined}
        frontmatter={!isChat}
        headingIds={!isChat}
      >
        {children}
      </Markdown>
    </div>
  )
}

export default ContentMarkdown
