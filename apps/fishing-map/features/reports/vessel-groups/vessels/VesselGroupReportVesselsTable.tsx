import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { Fragment } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { useLocationConnect } from 'routes/routes.hook'
import { getDatasetsReportNotSupported } from 'features/datasets/datasets.utils'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { selectUserData } from 'features/user/selectors/user.selectors'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { EMPTY_API_VALUES } from 'features/reports/areas/reports.config'
import VesselLink from 'features/vessel/VesselLink'
import VesselPin from 'features/vessel/VesselPin'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'
import {
  selectVGRVesselsOrderDirection,
  selectVGRVesselsOrderProperty,
} from 'features/reports/vessel-groups/vessel-group.config.selectors'
import { selectVGRVessels } from 'features/reports/vessel-groups/vessel-group-report.slice'
import {
  VGRVesselsOrderProperty,
  VGRVesselsOrderDirection,
} from 'features/vessel-groups/vessel-groups.types'
import styles from './VesselGroupReportVesselsTable.module.css'
import { selectVGRVesselsPaginated } from './vessel-group-report-vessels.selectors'
import VesselGroupReportVesselsTableFooter from './VesselGroupReportVesselsTableFooter'

export default function VesselGroupReportVesselsTable() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vesselsRaw = useSelector(selectVGRVessels)
  const vessels = useSelector(selectVGRVesselsPaginated)
  const userData = useSelector(selectUserData)
  const dataviews = useSelector(selectActiveReportDataviews)
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const orderProperty = useSelector(selectVGRVesselsOrderProperty)
  const orderDirection = useSelector(selectVGRVesselsOrderDirection)
  const datasetsDownloadNotSupported = getDatasetsReportNotSupported(
    dataviews,
    userData?.permissions || []
  )

  const onFilterClick = (vGRVesselFilter: any) => {
    dispatchQueryParams({ vGRVesselFilter, vGRVesselPage: 0 })
  }

  const onPinClick = () => {
    dispatchQueryParams({ viewOnlyVesselGroup: false })
  }

  const handleSortClick = (
    property: VGRVesselsOrderProperty,
    direction: VGRVesselsOrderDirection
  ) => {
    dispatchQueryParams({
      vGRVesselsOrderProperty: property,
      vGRVesselsOrderDirection: direction,
    })
  }

  return (
    <Fragment>
      <div className={styles.tableContainer} data-test="report-vessels-table">
        {datasetsDownloadNotSupported.length > 0 && (
          <p className={styles.error}>
            {t(
              'analysis.datasetsNotAllowed',
              'Vessels are not included from the following sources:'
            )}{' '}
            {datasetsDownloadNotSupported.map((dataset, index) => (
              <Fragment key={dataset}>
                <DatasetLabel key={dataset} dataset={{ id: dataset }} />
                {index < datasetsDownloadNotSupported.length - 1 && ', '}
              </Fragment>
            ))}
          </p>
        )}
        <div className={styles.vesselsTable}>
          <div className={cx(styles.header, styles.spansFirstTwoColumns)}>
            {t('common.name', 'Name')}
            <IconButton
              size="tiny"
              icon={orderDirection === 'asc' ? 'sort-asc' : 'sort-desc'}
              onClick={() => handleSortClick('shipname', orderDirection === 'asc' ? 'desc' : 'asc')}
              className={cx(styles.sortIcon, { [styles.active]: orderProperty === 'shipname' })}
            />
          </div>
          <div className={styles.header}>{t('vessel.mmsi', 'mmsi')}</div>
          <div className={styles.header}>
            {t('layer.flagState_one', 'Flag state')}
            <IconButton
              size="tiny"
              icon={orderDirection === 'asc' ? 'sort-asc' : 'sort-desc'}
              onClick={() => handleSortClick('flag', orderDirection === 'asc' ? 'desc' : 'asc')}
              className={cx(styles.sortIcon, { [styles.active]: orderProperty === 'flag' })}
            />
          </div>
          <div className={styles.header}>
            {t('vessel.vessel_type', 'Vessel Type')}
            <IconButton
              size="tiny"
              icon={orderDirection === 'asc' ? 'sort-asc' : 'sort-desc'}
              onClick={() => handleSortClick('shiptype', orderDirection === 'asc' ? 'desc' : 'asc')}
              className={cx(styles.sortIcon, { [styles.active]: orderProperty === 'shiptype' })}
            />
          </div>
          {vessels?.map((vessel, i) => {
            const { id, shipName, flag, flagTranslatedClean, flagTranslated, mmsi, index } = vessel
            const isLastRow = i === vessels.length - 1
            const flagInteractionEnabled = !EMPTY_API_VALUES.includes(flagTranslated)
            const type = vessel.vesselType
            const typeInteractionEnabled = type !== EMPTY_FIELD_PLACEHOLDER
            const workspaceReady = workspaceStatus === AsyncReducerStatus.Finished
            return (
              <Fragment key={id}>
                <div className={cx({ [styles.border]: !isLastRow }, styles.icon)}>
                  <VesselPin
                    vessel={vesselsRaw?.[index]}
                    disabled={!workspaceReady}
                    onClick={onPinClick}
                  />
                </div>
                <div className={cx({ [styles.border]: !isLastRow })}>
                  {workspaceReady ? (
                    <VesselLink className={styles.link} vesselId={id} datasetId={vessel.dataset}>
                      {shipName}
                    </VesselLink>
                  ) : (
                    shipName
                  )}
                </div>
                <div className={cx({ [styles.border]: !isLastRow })}>
                  <span>{mmsi || EMPTY_FIELD_PLACEHOLDER}</span>
                </div>
                <div
                  className={cx({
                    [styles.border]: !isLastRow,
                    [styles.pointer]: flagInteractionEnabled,
                  })}
                  title={
                    flagInteractionEnabled
                      ? `${t('analysis.clickToFilterBy', `Click to filter by:`)} ${flag}`
                      : undefined
                  }
                  onClick={
                    flagInteractionEnabled
                      ? () => onFilterClick(`flag:${flagTranslatedClean}`)
                      : undefined
                  }
                >
                  <span>{flagTranslated}</span>
                </div>
                <div
                  className={cx({
                    [styles.border]: !isLastRow,
                    [styles.pointer]: typeInteractionEnabled,
                  })}
                  title={
                    typeInteractionEnabled
                      ? `${t('analysis.clickToFilterBy', `Click to filter by:`)} ${type}`
                      : undefined
                  }
                  onClick={
                    typeInteractionEnabled ? () => onFilterClick(`${'type'}:${type}`) : undefined
                  }
                >
                  {type}
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
      <VesselGroupReportVesselsTableFooter />
    </Fragment>
  )
}