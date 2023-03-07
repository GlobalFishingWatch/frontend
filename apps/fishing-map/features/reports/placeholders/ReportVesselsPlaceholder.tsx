import { Fragment } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { WorkspaceLoginError } from 'features/workspace/WorkspaceError'
import { selectLocationDatasetId, selectLocationAreaId } from 'routes/routes.selectors'
import styles from './placeholders.module.css'

export default function ReportVesselsPlaceholder({ title }: { title?: string }) {
  const datasetId = useSelector(selectLocationDatasetId)
  const areaId = useSelector(selectLocationAreaId)
  const tableRows = Array(11).fill('')
  return (
    <Fragment>
      <div className={styles.container}>
        <div className={cx({ [styles.faint]: title })}>
          <div className={cx(styles.flex, styles.column)}>
            {/* header */}
            <div style={{ width: '100%' }} className={cx(styles.flex, styles.spaceBetween)}>
              <div style={{ maxWidth: '10rem' }} className={cx(styles.block, styles.grow)} />
              <div style={{ maxWidth: '20rem' }} className={cx(styles.block, styles.grow)} />
            </div>
            {/* graph */}
            <div
              style={{ width: '100%' }}
              className={cx(styles.flex, styles.spaceAround, styles.end)}
            >
              <div
                style={{ height: 260, borderRadius: 0 }}
                className={cx(styles.block, styles.grow, styles.marginH)}
              />
              <div
                style={{ height: 160, borderRadius: 0 }}
                className={cx(styles.block, styles.grow, styles.marginH)}
              />
              <div
                style={{ height: 100, borderRadius: 0 }}
                className={cx(styles.block, styles.grow, styles.marginH)}
              />
              <div
                style={{ height: 50, borderRadius: 0 }}
                className={cx(styles.block, styles.grow, styles.marginH)}
              />
              <div
                style={{ height: 10, borderRadius: 0 }}
                className={cx(styles.block, styles.grow, styles.marginH)}
              />
              <div
                style={{ height: 150, borderRadius: 0 }}
                className={cx(styles.block, styles.grow, styles.marginH)}
              />
            </div>
            <div style={{ width: '100%' }} className={cx(styles.flex, styles.spaceAround)}>
              <div className={cx(styles.block, styles.grow, styles.marginH)} />
              <div className={cx(styles.block, styles.grow, styles.marginH)} />
              <div className={cx(styles.block, styles.grow, styles.marginH)} />
              <div className={cx(styles.block, styles.grow, styles.marginH)} />
              <div className={cx(styles.block, styles.grow, styles.marginH)} />
              <div className={cx(styles.block, styles.grow, styles.marginH)} />
            </div>
            {/* search */}
            <div
              style={{ width: '100%' }}
              className={cx(styles.block, styles.grow, styles.thick, styles.marginV)}
            />
            {/* table */}
            {tableRows.map((_, index) => (
              <Fragment key={index}>
                <div style={{ width: '100%' }} className={cx(styles.flex, styles.spaceBetween)}>
                  <div className={cx(styles.block, styles.grow)} />
                  <div className={cx(styles.block, styles.grow)} />
                  <div className={cx(styles.block, styles.grow)} />
                  <div className={cx(styles.block, styles.grow)} />
                  <div className={cx(styles.block, styles.grow)} />
                  <div className={cx(styles.block, styles.grow, styles.short, styles.marginL)} />
                </div>
                {index > 0 && index < tableRows.length - 1 && (
                  <div
                    style={{ width: '100%' }}
                    className={cx(styles.block, styles.grow, styles.line)}
                  />
                )}
              </Fragment>
            ))}
          </div>
        </div>
        {title && (
          <div className={styles.cover}>
            <WorkspaceLoginError
              title={title}
              emailSubject={`Requesting access for ${datasetId}-${areaId} report`}
            />
          </div>
        )}
      </div>
    </Fragment>
  )
}
