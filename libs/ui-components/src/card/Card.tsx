import type React from 'react'
import cx from 'classnames'

import styles from './Card.module.css'

export type CardTitleTag = 'h2' | 'h3' | 'h4' | 'span'

export interface CardProps {
  title: string
  subtitle?: string
  image?: { url: string; alt?: string }
  titleTag?: CardTitleTag
  className?: string
  children?: React.ReactNode
  testId?: string
}

export function Card({
  title,
  subtitle,
  image,
  titleTag: TitleTag = 'h3',
  className,
  children,
  testId,
}: CardProps) {
  return (
    <article className={cx(styles.card, className)} data-testid={testId}>
      <div className={styles.media}>
        {image && <img className={styles.image} src={image.url} alt={image.alt ?? ''} />}
      </div>
      <TitleTag className={styles.title}>{title}</TitleTag>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {children}
    </article>
  )
}
