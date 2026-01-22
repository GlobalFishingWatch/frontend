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
