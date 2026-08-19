export const getIsBrowser = () => typeof window !== 'undefined'

export function getLocalStorage(): Storage | undefined {
  if (!getIsBrowser()) {
    return undefined
  }
  try {
    return window.localStorage
  } catch {
    //  Reading `window.localStorage` itself throws in some browsers (blocked storage)
    return undefined
  }
}

export function getLocalStorageItem(key: string): string | null {
  try {
    return getLocalStorage()?.getItem(key) ?? null
  } catch {
    return null
  }
}

export function setLocalStorageItem(key: string, value: string): void {
  try {
    getLocalStorage()?.setItem(key, value)
  } catch {
    // disabled
  }
}

export function removeLocalStorageItem(key: string): void {
  try {
    getLocalStorage()?.removeItem(key)
  } catch {
    // disabled
  }
}

export const getSafeElementById = (domId: string) => {
  return getIsBrowser() ? document.getElementById(domId || '') : null
}

export const getCSSVarValue = (property: string) => {
  if (getIsBrowser()) {
    return window.getComputedStyle(document.body).getPropertyValue(property)
  }
  return ''
}
