import { type ComponentProps, type ReactNode } from 'react'
import { streamingMarkdownExtension } from '@tanstack/markdown/extensions/streaming'
import { Markdown, type MarkdownComponents } from '@tanstack/markdown/react'
import cx from 'classnames'

import { highlightMarkdownCode } from 'features/_map/content-panel/markdown-highlighter'
import MarkdownIframe from 'features/_map/content-panel/MarkdownIframe'
import MarkdownImage from 'features/_map/content-panel/MarkdownImage'
import MarkdownLink from 'features/_map/content-panel/MarkdownLink'
import type { UserGuideSlug } from 'features/cms/loaders/user-guide.types'
import { findSectionForSlug } from 'features/help/userGuide.utils'
import UserGuideLink from 'features/help/UserGuideLink'

import './ContentMarkdown.css'
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

const ChatMarkdownLink = (props: ComponentProps<typeof MarkdownLink>) => {
  const slug = props.href?.startsWith('#') ? props.href.slice(1) : undefined
  if (slug && findSectionForSlug(slug)) {
    return (
      <UserGuideLink
        slug={slug as UserGuideSlug}
        fallbackArticleLabel={props.children as ReactNode}
      />
    )
  }
  return <MarkdownLink {...props} />
}

const chatComponents = { ...components, a: ChatMarkdownLink } satisfies MarkdownComponents

const ContentMarkdown = ({ children, variant = 'default' }: ContentMarkdownProps) => {
  if (!children) return null

  const isChat = variant === 'chat'

  return (
    <div
      className={cx('content-markdown', 'notranslate', { 'content-markdown-prose': !isChat })}
      translate="no"
    >
      <Markdown
        components={isChat ? chatComponents : components}
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
