// Fix to solve svg without proper styles in html2canvas
// https://github.com/niklasvh/html2canvas/issues/1380#issuecomment-361611523
const TRANSFORM_PROPERTIES = ['fill', 'color', 'font-size', 'stroke', 'font', 'opacity']

function recurseElementChildren(node: SVGSVGElement | HTMLElement) {
  if (!node.style) return
  const styles = getComputedStyle(node)
  for (const transformProperty of TRANSFORM_PROPERTIES) {
    node.style[transformProperty as any] = styles[transformProperty as any]
  }
  for (const child of Array.from(node.childNodes)) {
    recurseElementChildren(child as SVGSVGElement)
  }
}

export const setInlineStyles = (targetElem: HTMLElement) => {
  const svgElems = Array.from(targetElem.getElementsByTagName('svg'))

  for (const svgElement of svgElems) {
    recurseElementChildren(svgElement)
  }
}

export const cleantInlineStyles = (targetElem: HTMLElement) => {
  const svgElems = Array.from(targetElem.getElementsByTagName('svg'))

  function recurseElementChildren(node: SVGSVGElement | HTMLElement) {
    if (!node.style) return
    for (const transformProperty of TRANSFORM_PROPERTIES) {
      node.style.removeProperty(transformProperty as any)
    }
    for (const child of Array.from(node.childNodes)) {
      recurseElementChildren(child as SVGSVGElement)
    }
  }

  for (const svgElement of svgElems) {
    recurseElementChildren(svgElement)
  }
}

export const getCSSVarValue = (property: string) => {
  if (typeof window !== 'undefined') {
    return window.getComputedStyle(document.body).getPropertyValue(property)
  }
  return ''
}
