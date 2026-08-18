import { getIsBrowser } from 'utils/dom'

export const getUrlViewstateNumericParam = (key: string) => {
  if (!getIsBrowser()) return null
  const urlParam = new URLSearchParams(window.location.search).get(key)
  if (!urlParam) {
    return null
  }
  const value = parseFloat(urlParam)
  return Number.isFinite(value) ? value : null
}
