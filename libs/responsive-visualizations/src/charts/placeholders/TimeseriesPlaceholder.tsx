import cx from 'classnames'

import styles from './placeholders.module.css'

export default function TimeseriesPlaceholder({
  animate = true,
  children = null,
}: {
  animate?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className={styles.relative}>
      <div
        style={{ display: 'flex', height: '95%', marginBottom: 0 }}
        className={cx(styles.spaceBetween, styles.column, styles.marginV)}
      >
        <div style={{ marginLeft: '2rem' }} className={styles.flex}>
          <div
            style={{ width: '2rem' }}
            className={cx(styles.block, styles.XS, { [styles.animate]: animate })}
          />
          <div
            className={cx(styles.block, styles.grow, styles.line, { [styles.animate]: animate })}
          />
        </div>
        <div style={{ marginLeft: '2rem' }} className={styles.flex}>
          <div
            style={{ width: '2rem' }}
            className={cx(styles.block, styles.XS, { [styles.animate]: animate })}
          />
          <div
            className={cx(styles.block, styles.grow, styles.line, { [styles.animate]: animate })}
          />
        </div>
        <div style={{ marginLeft: '2rem' }} className={styles.flex}>
          <div
            style={{ width: '2rem' }}
            className={cx(styles.block, styles.XS, { [styles.animate]: animate })}
          />
          <div
            className={cx(styles.block, styles.grow, styles.line, { [styles.animate]: animate })}
          />
        </div>
        <div style={{ marginLeft: '2rem' }} className={styles.flex}>
          <div
            style={{ width: '2rem' }}
            className={cx(styles.block, styles.XS, { [styles.animate]: animate })}
          />
          <div
            className={cx(styles.block, styles.grow, styles.line, { [styles.animate]: animate })}
          />
        </div>
        <div style={{ marginLeft: '2rem' }} className={styles.flex}>
          <div
            style={{ width: '2rem' }}
            className={cx(styles.block, styles.XS, { [styles.animate]: animate })}
          />
          <div
            className={cx(styles.block, styles.grow, styles.line, { [styles.animate]: animate })}
          />
        </div>
      </div>
      <div
        style={{ marginLeft: '3rem', height: '5%' }}
        className={cx(styles.flex, styles.spaceBetween)}
      >
        <div
          style={{ width: '5rem' }}
          className={cx(styles.block, styles.S, { [styles.animate]: animate })}
        />
        <div
          style={{ width: '5rem' }}
          className={cx(styles.block, styles.S, { [styles.animate]: animate })}
        />
        <div
          style={{ width: '5rem' }}
          className={cx(styles.block, styles.S, { [styles.animate]: animate })}
        />
        <div
          style={{ width: '5rem' }}
          className={cx(styles.block, styles.S, { [styles.animate]: animate })}
        />
        <div
          style={{ width: '5rem' }}
          className={cx(styles.block, styles.S, { [styles.animate]: animate })}
        />
      </div>
      {children && <div className={styles.children}>{children}</div>}
    </div>
  )
}
