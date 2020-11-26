// Fix to solve svg without proper styles in html2canvas
// https://github.com/niklasvh/html2canvas/issues/1380#issuecomment-361611523
const setInlineStyles = (targetElem: HTMLElement) => {
  const transformProperties = ['fill', 'color', 'font-size', 'stroke', 'font', 'opacity']

  const svgElems = Array.from(targetElem.getElementsByTagName('svg'))

  for (const svgElement of svgElems) {
    recurseElementChildren(svgElement)
  }

  function recurseElementChildren(node: SVGSVGElement | HTMLElement) {
    if (!node.style) return

    const styles = getComputedStyle(node)

    for (const transformProperty of transformProperties) {
      node.style[transformProperty as any] = styles[transformProperty as any]
    }

    for (const child of Array.from(node.childNodes)) {
      recurseElementChildren(child as SVGSVGElement)
    }
  }
}

export default setInlineStyles
