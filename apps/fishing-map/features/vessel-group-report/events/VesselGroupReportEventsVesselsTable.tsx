import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Fragment } from 'react'
import {
  useGetVesselGroupEventsVesselsQuery,
  VesselGroupEventsVesselsParams,
} from 'queries/vessel-group-events-stats-api'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { useLocationConnect } from 'routes/routes.hook'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  selectFetchVesselGroupReportEventsVesselsParams,
  selectVesselGroupReportEventsVesselsPaginated,
} from 'features/vessel-group-report/events/vessel-group-report-events.selectors'
import VesselGroupReportEventsVesselsTableFooter from 'features/vessel-group-report/events/VesselGroupReportEventsVesselsTableFooter'
import styles from '../vessels/VesselGroupReportVesselsTable.module.css'

export default function VesselGroupReportEventsVesselsTable() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const params = useSelector(selectFetchVesselGroupReportEventsVesselsParams)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const { error, isLoading } = useGetVesselGroupEventsVesselsQuery(
    params as VesselGroupEventsVesselsParams,
    {
      skip: !params,
    }
  )
  const vessels = useSelector(selectVesselGroupReportEventsVesselsPaginated)

  const onPinClick = () => {
    dispatchQueryParams({ viewOnlyVesselGroup: false })
  }

  return (
    <Fragment>
      <div className={styles.tableContainer} data-test="report-vessels-table">
        <div
          className={styles.vesselsTable}
          style={{ gridTemplateColumns: 'max-content 1fr 1fr 1fr max-content' }}
        >
          <div className={cx(styles.header, styles.spansFirstTwoColumns)}>
            {t('common.name', 'Name')}
          </div>
          <div className={styles.header}>{t('vessel.mmsi', 'mmsi')}</div>
          <div className={styles.header}>{t('layer.flagState_one', 'Flag state')}</div>
          <div className={styles.header}>{t('common.events', 'events')}</div>
          {/* <div className={styles.header}>
            {t('vessel.vessel_type', 'Vessel Type')}
          </div> */}
          {vessels?.map((vessel, i) => {
            const { vesselId, numEvents, identity } = vessel
            const { shipname, flag, ssvid, dataset } = identity || {}
            console.log('identity:', identity)
            const isLastRow = i === vessels.length - 1
            const name = formatInfoField(shipname, 'name') as string
            const workspaceReady = workspaceStatus === AsyncReducerStatus.Finished
            return (
              <Fragment key={vesselId}>
                <div className={cx({ [styles.border]: !isLastRow }, styles.icon)}>
                  <VesselPin
                    vesselToResolve={{
                      id: vesselId,
                      name,
                      flag,
                      datasetId: dataset as string,
                    }}
                    disabled={!workspaceReady}
                    onClick={onPinClick}
                  />
                </div>
                <div className={cx({ [styles.border]: !isLastRow })}>
                  {workspaceReady ? (
                    <VesselLink
                      className={styles.link}
                      vesselId={vesselId}
                      datasetId={dataset as string}
                    >
                      {name}
                    </VesselLink>
                  ) : (
                    name
                  )}
                </div>
                <div className={cx({ [styles.border]: !isLastRow })}>
                  <span>{ssvid || EMPTY_FIELD_PLACEHOLDER}</span>
                </div>
                <div className={cx({ [styles.border]: !isLastRow })}>
                  <span>{formatInfoField(flag, 'flag') || EMPTY_FIELD_PLACEHOLDER}</span>
                </div>
                <div className={cx({ [styles.border]: !isLastRow }, styles.right)}>
                  <span>{numEvents}</span>
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
      <VesselGroupReportEventsVesselsTableFooter />
    </Fragment>
  )
}
