import { type ComponentProps, useMemo } from 'react'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

import MarkdownIframe from 'features/_map/content-panel/MarkdownIframe'
import MarkdownImage from 'features/_map/content-panel/MarkdownImage'
import MarkdownLink from 'features/_map/content-panel/MarkdownLink'

type ContentMarkdownProps = { children?: string | null }

const ContentMarkdown = ({ children }: ContentMarkdownProps) => {
  const components = useMemo(
    () => ({
      a: MarkdownLink,
      img: MarkdownImage,
      iframe: MarkdownIframe,
      // ponytail: inline style instead of a css module, it's the only rule this wrapper needs
      table: (props: ComponentProps<'table'>) => (
        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <table {...props} />
        </div>
      ),
    }),
    []
  )

  if (!children) return null

  return (
    <Markdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </Markdown>
  )
}

export default ContentMarkdown
