import { Fragment } from 'react'

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

interface HighlightedTextProps {
  text: string
  /** One search term or several, matched case-insensitively */
  highlight?: string | string[]
}

/** Wraps every match of `highlight` in `<mark>`, styled globally in base.css */
export function HighlightedText({ text, highlight = '' }: HighlightedTextProps) {
  const terms = (Array.isArray(highlight) ? highlight : [highlight])
    .map((term) => term.trim())
    .filter(Boolean)
  if (!text || !terms.length) return text

  // Longest first, so "fish" doesn't win over "fishing"
  const uniqueTerms = Array.from(
    new Map(terms.map((term) => [term.toLowerCase(), term])).values()
  ).sort((a, b) => b.length - a.length)

  // A capture group keeps the matches in split's output, at the odd indexes
  const parts = text.split(new RegExp(`(${uniqueTerms.map(escapeRegExp).join('|')})`, 'ig'))
  return parts.map((part, index) =>
    index % 2 === 1 ? <mark key={index}>{part}</mark> : <Fragment key={index}>{part}</Fragment>
  )
}
