export function isUrlAbsolute(url: string) {
  if (!url) {
    throw new Error('Url absolute check needs a proper url')
  }
  return url.indexOf('http://') === 0 || url.indexOf('https://') === 0
}

export function getURLParameterByName(paramName: string, url: string = window.location.href) {
  const name = paramName.replace(/[[\]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export function removeUrlParameterByName(paramName: string) {
  if (!paramName) return
  const regex = new RegExp(`[?&]${paramName}=[^&]+`, 'g')
  if (window.history.replaceState) {
    window.history.replaceState(
      null,
      '',
      window.location.pathname +
        window.location.search.replace(regex, '').replace(/^&/, '?') +
        window.location.hash
    )
  }
}

export const ACCESS_TOKEN_STRING = 'access-token'

export function getAccessTokenFromUrl() {
  return getURLParameterByName(ACCESS_TOKEN_STRING)
}

export function removeAccessTokenFromUrl() {
  return removeUrlParameterByName(ACCESS_TOKEN_STRING)
}
