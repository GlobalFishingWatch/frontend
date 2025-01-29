import cx from 'classnames'

import styles from './placeholders.module.css'

export function BarChartPlaceholder({
  animate = true,
  children,
}: {
  animate?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className={styles.relative}>
      <div
        style={{ width: '100%', height: '90%' }}
        className={cx(styles.flex, styles.spaceAround, styles.end, styles.marginBottom)}
      >
        <div
          style={{ height: '90%', borderRadius: 0 }}
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
        <div
          style={{ height: '65%', borderRadius: 0 }}
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
        <div
          style={{ height: '50%', borderRadius: 0 }}
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
        <div
          style={{ height: '20%', borderRadius: 0 }}
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
        <div
          style={{ height: '8%', borderRadius: 0 }}
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
      </div>
      <div style={{ width: '100%' }} className={cx(styles.flex, styles.spaceAround)}>
        <div
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
        <div
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
        <div
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
        <div
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
        <div
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
      </div>
      {children && <div className={cx(styles.cover, styles.center)}>{children}</div>}
    </div>
  )
}
