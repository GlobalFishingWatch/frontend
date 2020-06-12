export function isUrlAbsolute(url: string) {
  if (!url) {
    throw new Error('Url absolute check needs a proper url')
  }
  if (url.indexOf('//') === 0) {
    return true
  } // URL is protocol-relative (= absolute)
  if (url.indexOf('://') === -1) {
    return false
  } // URL has no protocol (= relative)
  if (url.indexOf('.') === -1) {
    return false
  } // URL does not contain a dot, i.e. no TLD (= relative, possibly REST)
  if (url.indexOf('/') === -1) {
    return false
  } // URL does not contain a single slash (= relative)
  if (url.indexOf(':') > url.indexOf('/')) {
    return false
  } // The first colon comes after the first slash (= relative)
  if (url.indexOf('://') < url.indexOf('.')) {
    return true
  } // Protocol is defined before first dot (= absolute)
  return false // Anything else must be relative
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
