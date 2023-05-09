import cx from 'classnames'
import styles from './placeholders.module.css'

export default function ReportActivityPlaceholder({ showHeader = true }: { showHeader?: boolean }) {
  return (
    <div style={{ height: showHeader ? '34rem' : '30rem' }}>
      {/* header */}
      {showHeader && (
        <div className={cx(styles.flex, styles.spaceBetween)}>
          <div
            style={{ maxWidth: '10rem' }}
            className={cx(styles.block, styles.animate, styles.grow)}
          />
          <div
            style={{ maxWidth: '15rem' }}
            className={cx(styles.block, styles.animate, styles.grow)}
          />
        </div>
      )}
      {/* graph */}
      <div
        style={{ display: 'flex', height: '29rem', marginBottom: 0 }}
        className={cx(styles.spaceBetween, styles.column, styles.marginV)}
      >
        <div style={{ marginLeft: '2rem' }} className={styles.flex}>
          <div style={{ width: '2rem' }} className={cx(styles.block, styles.animate, styles.XS)} />
          <div className={cx(styles.block, styles.animate, styles.grow, styles.line)} />
        </div>
        <div style={{ marginLeft: '2rem' }} className={styles.flex}>
          <div style={{ width: '2rem' }} className={cx(styles.block, styles.animate, styles.XS)} />
          <div className={cx(styles.block, styles.animate, styles.grow, styles.line)} />
        </div>
        <div style={{ marginLeft: '2rem' }} className={styles.flex}>
          <div style={{ width: '2rem' }} className={cx(styles.block, styles.animate, styles.XS)} />
          <div className={cx(styles.block, styles.animate, styles.grow, styles.line)} />
        </div>
        <div style={{ marginLeft: '2rem' }} className={styles.flex}>
          <div style={{ width: '2rem' }} className={cx(styles.block, styles.animate, styles.XS)} />
          <div className={cx(styles.block, styles.animate, styles.grow, styles.line)} />
        </div>
        <div style={{ marginLeft: '2rem' }} className={styles.flex}>
          <div style={{ width: '2rem' }} className={cx(styles.block, styles.animate, styles.XS)} />
          <div className={cx(styles.block, styles.animate, styles.grow, styles.line)} />
        </div>
      </div>
      <div style={{ marginLeft: '3rem' }} className={cx(styles.flex, styles.spaceBetween)}>
        <div style={{ width: '5rem' }} className={cx(styles.block, styles.animate, styles.S)} />
        <div style={{ width: '5rem' }} className={cx(styles.block, styles.animate, styles.S)} />
        <div style={{ width: '5rem' }} className={cx(styles.block, styles.animate, styles.S)} />
        <div style={{ width: '5rem' }} className={cx(styles.block, styles.animate, styles.S)} />
        <div style={{ width: '5rem' }} className={cx(styles.block, styles.animate, styles.S)} />
      </div>
    </div>
  )
}
