export const getSafeElementById = (domId: string) => {
  return typeof window !== 'undefined' ? document.getElementById(domId || '') : null
}

export const getCSSVarValue = (property: string) => {
  if (typeof window !== 'undefined') {
    return window.getComputedStyle(document.body).getPropertyValue(property)
  }
  return ''
}
