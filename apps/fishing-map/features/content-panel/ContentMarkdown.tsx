import { useMemo } from 'react'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import MarkdownLink from 'features/content-panel/MarkdownLink'

type ContentMarkdownProps = { children?: string | null }

const ContentMarkdown = ({ children }: ContentMarkdownProps) => {
  const components = useMemo(() => ({ a: MarkdownLink }), [])

  if (!children) return null

  return (
    <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </Markdown>
  )
}

export default ContentMarkdown
