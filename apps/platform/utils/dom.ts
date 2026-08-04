export const getIsBrowser = () => typeof window !== 'undefined'

export const getSafeElementById = (domId: string) => {
  return getIsBrowser() ? document.getElementById(domId || '') : null
}

export const getCSSVarValue = (property: string) => {
  if (getIsBrowser()) {
    return window.getComputedStyle(document.body).getPropertyValue(property)
  }
  return ''
}
