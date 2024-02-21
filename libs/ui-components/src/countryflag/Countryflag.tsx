import React from 'react'
// import countryflag from 'countryflag'
// import styles from './Countryflag.module.css'

interface CountryFlag {
  iso: string
  svg?: boolean
  svgBorder?: boolean
  className?: string
  margin?: {
    left: string
    right: string
  }
}

export function CountryFlag(props: CountryFlag) {
  // const {
  //   iso,
  //   svg = false,
  //   svgBorder = false,
  //   className = '',
  //   margin = {
  //     left: '0.1em',
  //     right: '0.2em',
  //   },
  // } = props
  // if (!iso) {
  //   console.error(' Country flag iso (iso 3) or iso2 code is required')
  //   return null
  // }
  // let flag = null
  // try {
  //   flag = countryflag(iso)
  // } catch (e: any) {
  //   console.warn('Country flag error, incorrect iso code for:', iso)
  // }
  // if (!flag) return null
  // return svg === true || flag.emoji === null ? (
  //   <img
  //     style={{
  //       marginRight: margin.right,
  //       marginLeft: margin.left,
  //       ...(svgBorder && {
  //         outline: '1px solid var(--color-border-light, rgba(22, 63, 137, 0.15))',
  //       }),
  //     }}
  //     className={`${styles.img} ${className}`}
  //     alt={flag.name}
  //     src={flag.svg}
  //   />
  // ) : (
  //   <span className={`${styles.span} ${className}`} role="img" aria-label={flag.name}>
  //     {flag.emoji}
  //   </span>
  // )
}
