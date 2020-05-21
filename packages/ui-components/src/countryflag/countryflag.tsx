import React from 'react'
import countryflag from 'countryflag'

interface CountryFlag {
  iso: string
  svg?: boolean
  svgBorder?: boolean
  size?: string
  className?: string
  margin?: {
    left: string
    right: string
  }
}

const CountryFlag: React.FC<CountryFlag> = (props) => {
  const {
    iso,
    svg = false,
    svgBorder = false,
    className = '',
    size = '1em',
    margin = {
      left: '0.1em',
      right: '0.2em',
    },
  } = props

  if (!iso) {
    console.error(' Country flag iso (iso 3) or iso2 code is required')
    return null
  }
  let flag = null
  try {
    flag = countryflag(iso)
  } catch (e) {
    console.warn('Country flag error, incorrect iso code for:', iso)
  }
  if (!flag) return null

  return svg === true || flag.emoji === null ? (
    <img
      style={{
        height: size,
        marginRight: margin.right,
        marginLeft: margin.left,
        ...(svgBorder && {
          outline: '1px solid var(--color-border-light, rgba(22, 63, 137, 0.15))',
        }),
      }}
      className={className}
      alt={flag.name}
      src={flag.svg}
    />
  ) : (
    <span className={className} style={{ fontSize: size }} role="img" aria-label={flag.name}>
      {flag.emoji}
    </span>
  )
}

export default CountryFlag
