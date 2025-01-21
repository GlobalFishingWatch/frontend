import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import type { EventsStatsVessel } from 'features/reports/ports/ports-report.slice'
import styles from 'features/reports/shared/events/EventsReportVesselsTable.module.css'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { useLocationConnect } from 'routes/routes.hook'
import { AsyncReducerStatus } from 'utils/async-slice'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField } from 'utils/info'

export default function EventsReportVesselsTable({ vessels }: { vessels: EventsStatsVessel[] }) {
  const { t } = useTranslation()
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const { dispatchQueryParams } = useLocationConnect()

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
          style={{
            gridTemplateColumns: 'max-content 1fr max-content 1fr 1fr max-content',
          }}
        >
          <div className={cx(styles.header, styles.spansFirstTwoColumns)}>
            {t('common.name', 'Name')}
          </div>
          <div className={styles.header}>{t('vessel.mmsi', 'mmsi')}</div>
          <div className={styles.header}>{t('layer.flagState_one', 'Flag state')}</div>
          <div className={styles.header}>{t('vessel.type', 'Type')}</div>
          <div className={cx(styles.header, styles.right)}>{t('common.events', 'events')}</div>
          {vessels?.map((vessel, i) => {
            const { vesselId, numEvents, shipname, flag, ssvid, dataset, geartype } = vessel
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
                <div className={cx({ [styles.border]: !isLastRow })}>
                  <span>{formatInfoField(geartype, 'geartypes') || EMPTY_FIELD_PLACEHOLDER}</span>
                </div>
                <div className={cx({ [styles.border]: !isLastRow }, styles.right)}>
                  <span>{numEvents}</span>
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
    </Fragment>
  )
}
