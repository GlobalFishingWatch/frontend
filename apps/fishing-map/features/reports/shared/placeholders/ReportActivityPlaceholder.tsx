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
        style={{
          display: 'flex',
          height: '29rem',
          marginBottom: 0,
          position: 'relative',
          overflow: 'hidden',
        }}
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
        {/* Sinusoidal line graph overlay */}
        <svg
          className={cx(styles.waveGraph, { [styles.animateWave]: animate })}
          style={{
            position: 'absolute',
            top: 0,
            left: '5rem',
            right: 0,
            height: '100%',
            pointerEvents: 'none',
          }}
          preserveAspectRatio="none"
          viewBox="5 0 1440 260"
        >
          <path
            d="M0,256L24,229.3C48,203,96,149,144,138.7C192,128,240,160,288,149.3C336,139,384,85,432,96C480,107,528,181,576,176C624,171,672,85,720,80C768,75,816,149,864,154.7C912,160,960,96,1008,90.7C1056,85,1104,139,1152,160C1200,181,1248,171,1296,154.7C1344,139,1392,117,1416,106.7L1440,96L1440,320L1416,320C1392,320,1344,320,1296,320C1248,320,1200,320,1152,320C1104,320,1056,320,1008,320C960,320,912,320,864,320C816,320,768,320,720,320C672,320,624,320,576,320C528,320,480,320,432,320C384,320,336,320,288,320C240,320,192,320,144,320C96,320,48,320,24,320L0,320Z"
            fill="none"
            stroke="rgba(var(--primary-blue-rgb), 0.6)"
            strokeWidth="1.8"
            className={styles.wavePath}
          />
        </svg>
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
