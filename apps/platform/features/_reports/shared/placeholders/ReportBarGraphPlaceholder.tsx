import cx from 'classnames'

import styles from './placeholders.module.css'

export function ReportBarGraphPlaceholder({
  animate = true,
  children,
  numberOfElements = 6,
}: {
  animate?: boolean
  children?: React.ReactNode
  numberOfElements?: 5 | 6
}) {
  return (
    <div className={styles.relative}>
      <div
        style={{ width: '100%' }}
        className={cx(styles.flex, styles.spaceAround, styles.end, styles.marginBottom)}
      >
        <div
          style={{ height: 260, borderRadius: 0 }}
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
        <div
          style={{ height: 160, borderRadius: 0 }}
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
        <div
          style={{ height: 100, borderRadius: 0 }}
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
        <div
          style={{ height: 50, borderRadius: 0 }}
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
        <div
          style={{ height: 10, borderRadius: 0 }}
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
        {numberOfElements === 6 && (
          <div
            style={{ height: 150, borderRadius: 0 }}
            className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
          />
        )}
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
        {numberOfElements === 6 && (
          <div
            className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
          />
        )}
      </div>
      {children && <div className={cx(styles.cover, styles.center)}>{children}</div>}
    </div>
  )
}
