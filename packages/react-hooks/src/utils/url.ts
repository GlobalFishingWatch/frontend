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
