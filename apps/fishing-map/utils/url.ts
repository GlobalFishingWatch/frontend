import { getIsBrowser } from 'utils/dom'

export const getUrlViewstateNumericParam = (key: string) => {
  if (!getIsBrowser()) return null
  const urlParam = new URLSearchParams(window.location.search).get(key)
  return urlParam ? parseFloat(urlParam) : null
}
