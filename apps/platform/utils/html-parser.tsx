import type { DOMNode, HTMLReactParserOptions } from 'html-react-parser'
import parse, { domToReact, Element } from 'html-react-parser'

import { Tooltip } from '@globalfishingwatch/ui-components/tooltip'

export const options: HTMLReactParserOptions = {
  replace: (domNode: DOMNode) => {
    // Check if the node is a Text node and has a parent
    // For fixing google translate crash https://martijnhols.nl/blog/everything-about-google-translate-crashing-react
    if (domNode.type === 'text' && domNode.data.trim().length > 0) {
      return <span>{domNode.data}</span>
    }
    if (domNode instanceof Element && domNode.attribs['data-tooltip']) {
      return (
        <Tooltip content={domNode.attribs['data-tooltip']}>
          <span style={{ cursor: 'help' }}>
            {domToReact(domNode.children as DOMNode[], options)}
          </span>
        </Tooltip>
      )
    }
  },
}

export const htmlSafeParse = (html: string | undefined) => {
  return typeof html === 'string' ? parse(html, options) : html
}
