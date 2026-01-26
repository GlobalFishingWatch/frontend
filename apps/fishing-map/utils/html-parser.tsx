import type { DOMNode } from 'html-react-parser'

export const options = {
  replace: (domNode: DOMNode) => {
    // Check if the node is a Text node and has a parent
    // For fixing google translate crash https://martijnhols.nl/blog/everything-about-google-translate-crashing-react
    if (domNode.type === 'text' && domNode.data.trim().length > 0) {
      return <span>{domNode.data}</span>
    }
  },
}
