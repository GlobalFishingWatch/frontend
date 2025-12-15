import cx from 'classnames'

import styles from './placeholders.module.css'

export default function ReportActivityPlaceholder({
  showHeader = true,
  loading = false,
  animate = true,
  children = null,
}: {
  showHeader?: boolean
  loading?: boolean
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
        {loading && (
          <svg
            className={cx(styles.waveGraph, styles.children, { [styles.animateWave]: animate })}
            style={{
              height: '100%',
              width: '100%',
              pointerEvents: 'none',
            }}
            viewBox="0 0 1040 320"
          >
            <path
              fill="none"
              stroke="rgba(var(--primary-blue-rgb), 0.6)"
              strokeWidth="1.8"
              className={styles.wavePath}
              d="M0,288L9.6,256C19.2,224,38,160,58,117.3C76.8,75,96,53,115,64C134.4,75,154,117,173,133.3C192,149,211,139,230,160C249.6,181,269,235,288,229.3C307.2,224,326,160,346,160C364.8,160,384,224,403,213.3C422.4,203,442,117,461,69.3C480,21,499,11,518,58.7C537.6,107,557,213,576,245.3C595.2,277,614,235,634,202.7C652.8,171,672,149,691,128C710.4,107,730,85,749,69.3C768,53,787,43,806,37.3C825.6,32,845,32,864,69.3C883.2,107,902,181,922,208C940.8,235,960,213,979,218.7C998.4,224,1018,256,1037,250.7C1056,245,1075,203,1094,197.3C1113.6,192,1133,224,1152,224C1171.2,224,1190,192,1210,176C1228.8,160,1248,160,1267,144C1286.4,128,1306,96,1325,85.3C1344,75,1363,85,1382,122.7C1401.6,160,1421,224,1430,256L1440,288"
            ></path>
          </svg>
        )}
      </div>
      {children && <div className={styles.children}>{children}</div>}
      {/* Sinusoidal line graph overlay */}
    </div>
  )
}
