import type React from 'react'
import cx from 'classnames'

import styles from './Card.module.css'

export interface CardProps {
  title?: string
  image?: { url: string; alt?: string }
  className?: string
  children?: React.ReactNode
  testId?: string
  loading?: boolean
}

export function Card({
  title,
  image,
  className,
  children,
  testId,
  loading,
}: CardProps) {
  if (loading) {
    return (
      <article
        className={cx(styles.card, className)}
        data-testid={testId}
        aria-busy
        aria-hidden="true"
      >
        <div className={cx(styles.media, styles.placeholder)} />
        <div className={styles.titlePlaceholder}>
          <span className={cx(styles.line, styles.placeholder)} />
          <span
            className={cx(styles.line, styles.lineShort, styles.placeholder)}
          />
        </div>
        {children}
      </article>
    )
  }

  return (
    <article className={cx(styles.card, className)} data-testid={testId}>
      <div className={styles.media}>
        {image && (
          <img className={styles.image} src={image.url} alt={image.alt ?? ''} />
        )}
      </div>
      <h3 className={styles.title}>{title}</h3>
      {children}
    </article>
  )
}
