import { Fragment } from 'react'
import cx from 'classnames'
import styles from './placeholders.module.css'

export function ReportVesselsGraphPlaceholder({
  animate = true,
  children,
}: {
  animate?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className={styles.relative}>
      <div
        style={{ width: '100%' }}
        className={cx(styles.flex, styles.spaceAround, styles.end, styles.marginV)}
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
        <div
          style={{ height: 150, borderRadius: 0 }}
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
        <div
          className={cx(styles.block, styles.grow, styles.marginH, { [styles.animate]: animate })}
        />
      </div>
      {children && <div className={cx(styles.cover, styles.center)}>{children}</div>}
    </div>
  )
}

export default function ReportVesselsPlaceholder({ children }: { children?: React.ReactNode }) {
  const tableRows = Array(11).fill('')
  return (
    <Fragment>
      <div className={styles.container}>
        <div className={cx({ [styles.faint]: children !== undefined })}>
          <div className={cx(styles.flex, styles.column)}>
            {/* header */}
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
            <ReportVesselsGraphPlaceholder />
            {/* search */}
            <div
              style={{ width: '100%' }}
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
