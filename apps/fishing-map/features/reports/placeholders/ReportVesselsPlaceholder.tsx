import { Fragment } from 'react'
import cx from 'classnames'
import { ReportBarGraphPlaceholder } from 'features/reports/placeholders/ReportBarGraphPlaceholder'
import styles from './placeholders.module.css'

export default function ReportVesselsPlaceholder({
  children,
  showGraphHeader = true,
}: {
  children?: React.ReactNode
  showGraphHeader?: boolean
}) {
  const tableRows = Array(11).fill('')
  return (
    <Fragment>
      <div className={styles.container}>
        <div className={cx({ [styles.faint]: children !== undefined })}>
          <div className={cx(styles.flex, styles.column)}>
            {/* header */}
            {showGraphHeader && (
              <div style={{ width: '100%' }} className={cx(styles.flex, styles.spaceBetween)}>
                <div
                  style={{ maxWidth: '10rem' }}
                  className={cx(styles.block, styles.animate, styles.grow)}
                />
                <div
                  style={{ maxWidth: '20rem' }}
                  className={cx(styles.block, styles.animate, styles.grow)}
                />
              </div>
            )}
            <ReportBarGraphPlaceholder />
            {/* search */}
            <div
              style={{ width: '100%', borderRadius: 'var(--border-radius)' }}
              className={cx(
                styles.block,
                styles.animate,
                styles.grow,
                styles.thick,
                styles.marginV
              )}
            />
            {/* table */}
            {tableRows.map((_, index) => (
              <Fragment key={index}>
                <div style={{ width: '100%' }} className={cx(styles.flex, styles.spaceBetween)}>
                  <div className={cx(styles.block, styles.animate, styles.grow)} />
                  <div className={cx(styles.block, styles.animate, styles.grow)} />
                  <div className={cx(styles.block, styles.animate, styles.grow)} />
                  <div className={cx(styles.block, styles.animate, styles.grow)} />
                  <div className={cx(styles.block, styles.animate, styles.grow)} />
                  <div
                    className={cx(
                      styles.block,
                      styles.animate,
                      styles.grow,
                      styles.short,
                      styles.marginL
                    )}
                  />
                </div>
                {index > 0 && index < tableRows.length - 1 && (
                  <div
                    style={{ width: '100%' }}
                    className={cx(styles.block, styles.animate, styles.grow, styles.line)}
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>
        {children}
      </div>
    </Fragment>
  )
}
