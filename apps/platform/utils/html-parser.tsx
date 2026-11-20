import type { DOMNode, HTMLReactParserOptions } from 'html-react-parser'
import parse, { domToReact, Element } from 'html-react-parser'

import type { IconType } from '@globalfishingwatch/ui-components/icon'
import { Icon } from '@globalfishingwatch/ui-components/icon'
import { Tooltip } from '@globalfishingwatch/ui-components/tooltip'

export const options: HTMLReactParserOptions = {
  replace: (domNode: DOMNode) => {
    // Check if the node is a Text node and has a parent
    // For fixing google translate crash https://martijnhols.nl/blog/everything-about-google-translate-crashing-react
    if (domNode.type === 'text' && domNode.data.trim().length > 0) {
      return <span>{domNode.data}</span>
    }
    // Lets translated HTML strings place a ui-components icon: <span data-icon="warning"></span>
    if (domNode instanceof Element && domNode.attribs['data-icon']) {
      const icon = domNode.attribs['data-icon'] as IconType
      return (
        <Icon
          icon={icon}
          type={icon === 'warning' ? 'warning' : 'default'}
          className={domNode.attribs.class}
        />
      )
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
