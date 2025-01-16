import { Fragment } from 'react'
import cx from 'classnames'

import { ReportBarGraphPlaceholder } from 'features/reports/shared/placeholders/ReportBarGraphPlaceholder'

import styles from './placeholders.module.css'

export default function ReportVesselsPlaceholder({
  children,
  showGraph = true,
  showGraphHeader = true,
  showSearch = true,
  animate = true,
}: {
  children?: React.ReactNode
  showGraph?: boolean
  showGraphHeader?: boolean
  showSearch?: boolean
  animate?: boolean
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
                  className={cx(styles.block, styles.grow, { [styles.animate]: animate })}
                />
                <div
                  style={{ maxWidth: '20rem' }}
                  className={cx(styles.block, styles.grow, { [styles.animate]: animate })}
                />
              </div>
            )}
            {showGraph && <ReportBarGraphPlaceholder />}
            {/* search */}
            {showSearch && (
              <div
                style={{ width: '100%', borderRadius: 'var(--border-radius)' }}
                className={cx(styles.block, styles.grow, styles.thick, styles.marginV, {
                  [styles.animate]: animate,
                })}
              />
            )}
            {/* table */}
            {tableRows.map((_, index) => (
              <Fragment key={index}>
                <div style={{ width: '100%' }} className={cx(styles.flex, styles.spaceBetween)}>
                  <div className={cx(styles.block, styles.grow, { [styles.animate]: animate })} />
                  <div className={cx(styles.block, styles.grow, { [styles.animate]: animate })} />
                  <div className={cx(styles.block, styles.grow, { [styles.animate]: animate })} />
                  <div className={cx(styles.block, styles.grow, { [styles.animate]: animate })} />
                  <div className={cx(styles.block, styles.grow, { [styles.animate]: animate })} />
                  <div
                    className={cx(styles.block, styles.grow, styles.short, styles.marginL, {
                      [styles.animate]: animate,
                    })}
                  />
                </div>
                {index > 0 && index < tableRows.length - 1 && (
                  <div
                    style={{ width: '100%' }}
                    className={cx(styles.block, styles.grow, styles.line, {
                      [styles.animate]: animate,
                    })}
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
