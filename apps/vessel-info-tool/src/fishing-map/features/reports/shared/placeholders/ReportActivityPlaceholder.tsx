import cx from 'classnames'

import styles from './placeholders.module.css'

export default function ReportActivityPlaceholder({
  showHeader = true,
  animate = true,
  children = null,
}: {
  showHeader?: boolean
  animate?: boolean
  children?: React.ReactNode
}) {
  return (
    <div style={{ height: showHeader ? '34rem' : '30rem' }} className={styles.relative}>
      {/* header */}
      {showHeader && (
        <div className={cx(styles.flex, styles.spaceBetween)}>
          <div
            style={{ maxWidth: '10rem' }}
            className={cx(styles.block, styles.grow, { [styles.animate]: animate })}
          />
          <div
            style={{ maxWidth: '15rem' }}
            className={cx(styles.block, styles.grow, { [styles.animate]: animate })}
          />
        </div>
      )}
      {/* graph */}
      <div
        style={{ display: 'flex', height: '29rem', marginBottom: 0 }}
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
      <div style={{ marginLeft: '3rem' }} className={cx(styles.flex, styles.spaceBetween)}>
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
