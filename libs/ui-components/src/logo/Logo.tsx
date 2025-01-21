import React from 'react'
import cx from 'classnames'

import styles from './Logo.module.css'

export enum SubBrands {
  MarineManager = 'Marine Manager',
  CarrierVessels = 'Carrier Vessels',
  PortLabeler = 'Port Labeler'
}

export type LogoTypes = 'default' | 'invert'

interface LogoProps {
  type?: LogoTypes
  subBrand?: SubBrands
  className?: string
}

export function Logo(props: LogoProps) {
  const { type = 'default', subBrand = '', className } = props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="20 0 220 60"
      width="200"
      height="60"
      className={cx(styles.container, className)}
      aria-label={`Global Fishing Watch ${subBrand}`}
    >
      <g fill="none" fillRule="evenodd" aria-hidden="true" focusable="false">
        <path
          fill="#8ABBC7"
          d="M23.1 27.83c-.08.16-2.25 4.5.57 8.76.83 1.25 1.76 2.24 4.1 3.8 3.38 2.26 7.42 6.16 8.4 8.45.1.21.36.59-.06.83-.73.41-1.75.31-2.16.25l-.12-.02c-4.75-.88-14.5-5-13.8-13.8.18-2.21.98-4.87 3.07-8.27zm9.92-8.64c.7-.08 2.98-.15 3.08.08.07.17-.83.5-.87.52-5.22 1.98-6.97 3.16-7.22 3.3-3.3 2.01-4.71 4.35-4.82 4.57 1.48-3.1 5.2-7.93 9.83-8.47z"
        />
        <path
          fill="#E84427"
          d="M40.45 19.2l.64 1.16a17.1 17.1 0 011.52 3.94c.27 1.1.39 2.23.31 3.37a9.39 9.39 0 01-1.72 4.84 12.9 12.9 0 01-3.29 3.2 20.3 20.3 0 01-7.02 3.08c-.4.09-.8.16-1.2.19a3.39 3.39 0 01-1.3-.17c-.43-.17-.5-.43-.28-.83a13.43 13.43 0 012.53-3.4 35.39 35.39 0 015.48-4.56c.76-.53 1.5-1.06 2.15-1.7a8.5 8.5 0 002.55-4.63 8.37 8.37 0 00-.24-3.89l-.18-.59.05-.02zm.64 16.43c.5.03.64.28.4.72-.35.64-.9 1.04-1.6 1.21-.68.16-1.35.13-2.02-.02-.42-.09-.83-.23-1.24-.35l-.11-.06.12-.08c1.02-.53 2.07-.97 3.19-1.26.4-.1.83-.18 1.26-.16zM30.73 10.07c.92.2 1.75.61 2.54 1.11.87.56 1.65 1.21 2.4 1.92a29.78 29.78 0 014.2 5.18l.01.07-.18-.16a14.79 14.79 0 00-3.6-2.45c-1.01-.5-2.06-.9-3.11-1.3-.58-.23-1.16-.44-1.7-.75a1.82 1.82 0 01-.75-.76c-.15-.32-.07-.6.23-.78l.35-.18c-.28-.14-.53-.24-.75-.38-.2-.13-.38-.29-.55-.45a.77.77 0 01-.21-.64c.02-.24.13-.38.35-.46.26-.08.52-.03.77.03z"
        />
        <text className={cx(styles.mainBrand, styles[type])} x="52" y={subBrand ? '32' : '37'}>
          Global Fishing Watch
        </text>
        {subBrand && (
          <text className={styles.subBrand} x="52" y="44">
            {subBrand}
          </text>
        )}
      </g>
    </svg>
  )
}
