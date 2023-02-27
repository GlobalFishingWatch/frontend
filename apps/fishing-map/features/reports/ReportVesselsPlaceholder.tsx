import { Fragment } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { WorkspaceLoginError } from 'features/workspace/WorkspaceError'
import { selectLocationDatasetId, selectLocationAreaId } from 'routes/routes.selectors'
import styles from './ReportVesselsPlaceholder.module.css'

export default function ReportVesselsPlaceholder({ title }: { title: string }) {
  const datasetId = useSelector(selectLocationDatasetId)
  const areaId = useSelector(selectLocationAreaId)
  const tableRows = Array(11).fill('')
  return (
    <Fragment>
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <div className={cx(styles.flex, styles.column)}>
            {/* header */}
            <div className={cx(styles.flex, styles.spaceBetween)}>
              <div style={{ maxWidth: '20rem' }} className={styles.block} />
              <div style={{ maxWidth: '20rem' }} className={styles.block} />
            </div>
            {/* graph */}
            <div className={cx(styles.flex, styles.spaceAround, styles.end)}>
              <div
                style={{ height: 280, borderRadius: 0 }}
                className={cx(styles.block, styles.marginH)}
              />
              <div
                style={{ height: 160, borderRadius: 0 }}
                className={cx(styles.block, styles.marginH)}
              />
              <div
                style={{ height: 100, borderRadius: 0 }}
                className={cx(styles.block, styles.marginH)}
              />
              <div
                style={{ height: 50, borderRadius: 0 }}
                className={cx(styles.block, styles.marginH)}
              />
              <div
                style={{ height: 10, borderRadius: 0 }}
                className={cx(styles.block, styles.marginH)}
              />
              <div
                style={{ height: 150, borderRadius: 0 }}
                className={cx(styles.block, styles.marginH)}
              />
            </div>
            <div className={cx(styles.flex, styles.spaceAround)}>
              <div className={cx(styles.block, styles.marginH)} />
              <div className={cx(styles.block, styles.marginH)} />
              <div className={cx(styles.block, styles.marginH)} />
              <div className={cx(styles.block, styles.marginH)} />
              <div className={cx(styles.block, styles.marginH)} />
              <div className={cx(styles.block, styles.marginH)} />
            </div>
            {/* search */}
            <div className={cx(styles.block, styles.thick, styles.marginV)} />
            {/* table */}
            {tableRows.map((_, index) => (
              <Fragment key={index}>
                <div className={cx(styles.flex, styles.spaceBetween)}>
                  <div className={styles.block} />
                  <div className={styles.block} />
                  <div className={styles.block} />
                  <div className={styles.block} />
                  <div className={styles.block} />
                  <div className={cx(styles.block, styles.short, styles.marginL)} />
                </div>
                {index > 0 && index < tableRows.length - 1 && (
                  <div className={cx(styles.block, styles.line)} />
                )}
              </Fragment>
            ))}
          </div>
        </div>
        <div className={styles.cover}>
          <WorkspaceLoginError
            title={title}
            emailSubject={`Requesting access for ${datasetId}-${areaId} report`}
          />
        </div>
      </div>
    </Fragment>
  )
}
