import React, { useMemo } from 'react'
import cx from 'classnames'

import styles from './placeholders.module.css'

const WAVE_PATHS = [
  'M0,0 L14.1,26.7 C28.2,53 56,107 85,133.3 C112.9,160 141,160 169,154.7 C197.6,149 226,139 254,138.7 C282.4,139 311,149 339,160 C367.1,171 395,181 424,186.7 C451.8,192 480,192 508,186.7 C536.5,181 565,171 593,170.7 C621.2,171 649,181 678,197.3 C705.9,213 734,235 762,245.3 C790.6,256 819,256 847,250.7 C875.3,245 904,235 932,208 C960,181 988,139 1016,128 C1044.7,117 1073,139 1101,122.7 C1129.4,107 1158,53 1186,58.7 C1214.1,64 1242,128 1271,133.3 C1298.8,139 1327,85 1355,85.3 C1383.5,85 1412,139 1426,165.3 L1440,192',
  'M0,96 L14.1,133.3 C28.2,171 56,245 85,277.3 C112.9,309 141,299 169,272 C197.6,245 226,203 254,208 C282.4,213 311,267 339,272 C367.1,277 395,235 424,197.3 C451.8,160 480,128 508,128 C536.5,128 565,160 593,186.7 C621.2,213 649,235 678,240 C705.9,245 734,235 762,197.3 C790.6,160 819,96 847,69.3 C875.3,43 904,53 932,74.7 C960,96 988,128 1016,154.7 C1044.7,181 1073,203 1101,181.3 C1129.4,160 1158,96 1186,74.7 C1214.1,53 1242,75 1271,90.7 C1298.8,107 1327,117 1355,117.3 C1383.5,117 1412,107 1426,101.3 L1440,96',
  'M0,224 L14.1,202.7 C28.2,181 56,139 85,122.7 C112.9,107 141,117 169,122.7 C197.6,128 226,128 254,149.3 C282.4,171 311,213 339,218.7 C367.1,224 395,192 424,154.7 C451.8,117 480,75 508,80 C536.5,85 565,139 593,181.3 C621.2,224 649,256 678,277.3 C705.9,299 734,309 762,304 C790.6,299 819,277 847,245.3 C875.3,213 904,171 932,170.7 C960,171 988,213 1016,218.7 C1044.7,224 1073,192 1101,149.3 C1129.4,107 1158,53 1186,80 C1214.1,107 1242,213 1271,256 C1298.8,299 1327,277 1355,256 C1383.5,235 1412,213 1426,202.7 L1440,192',
  'M0,32 L14.1,53.3 C28.2,75 56,117 85,154.7 C112.9,192 141,224 169,224 C197.6,224 226,192 254,149.3 C282.4,107 311,53 339,58.7 C367.1,64 395,128 424,176 C451.8,224 480,256 508,240 C536.5,224 565,160 593,117.3 C621.2,75 649,53 678,80 C705.9,107 734,181 762,181.3 C790.6,181 819,107 847,112 C875.3,117 904,203 932,245.3 C960,288 988,288 1016,266.7 C1044.7,245 1073,203 1101,192 C1129.4,181 1158,203 1186,186.7 C1214.1,171 1242,117 1271,112 C1298.8,107 1327,149 1355,165.3 C1383.5,181 1412,171 1426,165.3 L1440,160',
  'M0,160 L18.5,181.3 C36.9,203 74,245 111,229.3 C147.7,213 185,139 222,101.3 C258.5,64 295,64 332,85.3 C369.2,107 406,149 443,165.3 C480,181 517,171 554,160 C590.8,149 628,139 665,154.7 C701.5,171 738,213 775,229.3 C812.3,245 849,235 886,240 C923.1,245 960,267 997,229.3 C1033.8,192 1071,96 1108,101.3 C1144.6,107 1182,213 1218,234.7 C1255.4,256 1292,192 1329,181.3 C1366.2,171 1403,213 1422,234.7 L1440,256',
]

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
  // Randomize the delay indices for each path
  const delayIndices = useMemo(() => {
    const indices = [0, 1, 2, 3, 4]
    // Fisher-Yates shuffle
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[indices[i], indices[j]] = [indices[j], indices[i]]
    }
    return indices
  }, [])

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
        {loading && (
          <svg
            className={cx(styles.waveGraph, { [styles.animateWave]: animate })}
            preserveAspectRatio="none"
            viewBox="0 0 1440 320"
          >
            {WAVE_PATHS.map((path, index) => (
              <path
                key={index}
                fill="none"
                stroke="rgba(var(--primary-blue-rgb), 0.6)"
                strokeWidth="2"
                className={cx(styles.wavePath, styles[`wavePath${delayIndices[index]}`])}
                d={path}
              />
            ))}
          </svg>
        )}
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
