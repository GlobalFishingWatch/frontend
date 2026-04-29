import { Fragment } from 'react'

export const getHighlightedText = (
  text: string,
  highlight: string | string[] = '',
  styles: {
    readonly [key: string]: string
  }
) => {
  const highlightTerms = (Array.isArray(highlight) ? highlight : [highlight])
    .map((term) => term.trim())
    .filter(Boolean)

  if (highlightTerms.length === 0) return text

  const regEscape = (v: string) => v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')

  const uniqueHighlightTerms = Array.from(
    new Map(highlightTerms.map((term) => [term.toLowerCase(), term])).values()
  ).sort((a, b) => b.length - a.length)

  const escapedAlternation = uniqueHighlightTerms.map(regEscape).join('|')
  if (escapedAlternation === '') return text

  const highlightRegex = new RegExp(`(${escapedAlternation})`, 'ig')
  const textParts = text.split(highlightRegex)

  return textParts.map((part, index) => {
    const isMatch = index % 2 === 1
    return (
      <Fragment key={index}>
        {isMatch ? <span className={styles.highlighted}>{part}</span> : part}
      </Fragment>
    )
  })
}

export const getSearchPreview = (body: string = '', query: string) => {
  const q = query.toLowerCase()
  const idx = body.toLowerCase().indexOf(q)
  if (idx === -1) return body.substring(0, 80)
  const start = Math.max(0, idx - 40)
  const end = Math.min(body.length, idx + query.length + 40)
  return (start > 0 ? '…' : '') + body.substring(start, end) + (end < body.length ? '…' : '')
}
