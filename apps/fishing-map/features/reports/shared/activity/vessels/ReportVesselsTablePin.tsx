import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { Button, Icon, Spinner } from '@globalfishingwatch/ui-components'
import type { ReportVesselWithDatasets } from 'features/reports/areas/area-reports.selectors'
import { getVesselInWorkspace, VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import { selectNotDeletedTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import usePinReportVessels, { MAX_VESSEL_REPORT_PIN } from './report-activity-vessels.hooks'
import styles from './ReportVesselsTable.module.css'

type ReportVesselTablePinProps = {
  vessels: ReportVesselWithDatasets[]
  onClick?: (action: 'add' | 'delete') => void
}

export default function ReportVesselsTablePinAll({ vessels, onClick }: ReportVesselTablePinProps) {
  const { t } = useTranslation()
  const pinVessels = usePinReportVessels()
  const [loading, setLoading] = useState(false)
  const allVesselsInWorkspace = useSelector(selectNotDeletedTrackDataviews)
  const pinnedVesselsInstances = vessels.flatMap(
    (vessel) => getVesselInWorkspace(allVesselsInWorkspace, vessel.vesselId!) || []
  )

  const vesselIds = vessels.map((v) => v.vesselId)
  const hasAllVesselsInWorkspace = pinnedVesselsInstances?.length
    ? pinnedVesselsInstances.every((dI) => vesselIds.includes(dI.id.split(VESSEL_LAYER_PREFIX)[1]))
    : false

  const hasMoreMaxVesselsAllowed = vessels.length > MAX_VESSEL_REPORT_PIN

  const handleOnClick = async () => {
    const action = hasAllVesselsInWorkspace ? 'delete' : 'add'
    if (action === 'add') {
      setLoading(true)
    }
    await pinVessels(vessels, action)
    if (action === 'add') {
      setLoading(false)
    }
    if (onClick) {
      onClick(action)
    }
  }
  return (
    <Button
      type="secondary"
      onClick={handleOnClick}
      disabled={loading || !vessels?.length || hasMoreMaxVesselsAllowed}
      tooltip={
        hasMoreMaxVesselsAllowed
          ? t('analysis.pinVesselsNotAllowed', {
              defaultValue: 'You can only add up to {{vessels}} vessels',
              vessels: MAX_VESSEL_REPORT_PIN,
            })
          : ''
      }
    >
      {loading ? (
        <Spinner className={styles.pinAllLoading} inline size="tiny" />
      ) : (
        <Icon
          icon={hasAllVesselsInWorkspace ? 'pin-filled' : 'pin'}
          style={{
            color: hasAllVesselsInWorkspace ? 'var(--color-secondary-blue)' : '',
          }}
        />
      )}
      {hasAllVesselsInWorkspace
        ? t('analysis.removeVessels', 'Remove from workspace')
        : t('analysis.pinVessels', 'Add to workspace')}
    </Button>
  )
}
