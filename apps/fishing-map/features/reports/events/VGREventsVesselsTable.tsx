import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Fragment } from 'react'
import {
  useGetVesselGroupEventsVesselsQuery,
  VesselGroupEventsVesselsParams,
} from 'queries/vessel-group-events-stats-api'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'
import { useLocationConnect } from 'routes/routes.hook'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  selectFetchVGREventsVesselsParams,
  selectVGREventsVesselsPaginated,
} from 'features/reports/events/vgr-events.selectors'
import VGREventsVesselsTableFooter from 'features/reports/events/VGREventsVesselsTableFooter'
import styles from 'features/reports/vessel-groups/vessels/VesselGroupReportVesselsTable.module.css'

export default function VesselGroupReportEventsVesselsTable() {
  const { t } = useTranslation()
  const params = useSelector(selectFetchVGREventsVesselsParams)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const { dispatchQueryParams } = useLocationConnect()
  const { error, isLoading } = useGetVesselGroupEventsVesselsQuery(
    params as VesselGroupEventsVesselsParams,
    {
      skip: !params,
    }
  )
  const vessels = useSelector(selectVGREventsVesselsPaginated)

  const onPinClick = ({
    vesselInWorkspace,
  }: {
    vesselInWorkspace?: UrlDataviewInstance | null | undefined
  }) => {
    if (!vesselInWorkspace) {
      dispatchQueryParams({ viewOnlyVesselGroup: false })
    }
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
          {vessels?.map((vessel, i) => {
            const { vesselId, numEvents, shipname, flag, ssvid, dataset } = vessel
            const isLastRow = i === vessels.length - 1
            const name = formatInfoField(shipname, 'shipname') as string
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
                      query={{ vesselIdentitySource: VesselIdentitySourceEnum.SelfReported }}
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
      <VGREventsVesselsTableFooter />
    </Fragment>
  )
}
