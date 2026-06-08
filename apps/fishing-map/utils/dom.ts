export const getCSSVarValue = (property: string) => {
  if (typeof window !== 'undefined') {
    return window.getComputedStyle(document.body).getPropertyValue(property)
  }
  return ''
}
