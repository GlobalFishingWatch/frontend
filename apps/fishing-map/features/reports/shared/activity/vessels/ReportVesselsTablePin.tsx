import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Button, Icon, Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { getVesselInWorkspace, VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import { selectVesselsDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import type { ReportVesselWithDatasets } from 'features/reports/areas/area-reports.selectors'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'

import { setPinningVessels } from '../reports-activity.slice'

import usePinReportVessels, { MAX_VESSEL_REPORT_PIN } from './report-activity-vessels.hooks'

import styles from './ReportVesselsTable.module.css'

type ReportVesselTablePinProps = {
  vessels: ReportVesselWithDatasets[]
  onClick?: (action: 'add' | 'delete') => void
}

export default function ReportVesselsTablePinAll({ vessels, onClick }: ReportVesselTablePinProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const isGFWUser = useSelector(selectIsGFWUser)
  const { pinVessels, unPinVessels } = usePinReportVessels()
  const [loading, setLoading] = useState(false)
  const allVesselsInWorkspace = useSelector(selectVesselsDataviews)
  const vesselPinnedIds = allVesselsInWorkspace.map((dI) => dI.id.split(VESSEL_LAYER_PREFIX)[1])
  const vesselDataviewInstancesPinned = vessels.flatMap(
    (vessel) => getVesselInWorkspace(allVesselsInWorkspace, vessel.vesselId!) || []
  )
  const hasAllVesselsInWorkspace = vesselDataviewInstancesPinned?.length
    ? vessels.every(({ vesselId }) => vesselPinnedIds.includes(vesselId))
    : false

  const totalVesselsLength = (allVesselsInWorkspace?.length || 0) + (vessels?.length || 0)
  const hasMoreMaxVesselsAllowed = totalVesselsLength > MAX_VESSEL_REPORT_PIN

  const handleOnClick = async () => {
    const action = hasAllVesselsInWorkspace ? 'delete' : 'add'
    if (action === 'add') {
      dispatch(setPinningVessels(true))
      setLoading(true)
      const notPinnedVessels = vessels.filter(({ vesselId }) => !vesselPinnedIds.includes(vesselId))
      try {
        await pinVessels(notPinnedVessels)
      } catch (e: any) {
        console.warn(e)
      }
      setLoading(false)
      dispatch(setPinningVessels(false))
    } else {
      unPinVessels(vessels)
    }
    if (onClick) {
      onClick(action)
    }
  }

  if (!isGFWUser) {
    return null
  }

  return (
    <Button
      type="secondary"
      onClick={handleOnClick}
      disabled={loading || !vessels?.length || hasMoreMaxVesselsAllowed}
      tooltip={
        hasMoreMaxVesselsAllowed
          ? t('analysis.pinVesselsMaxAllowed', {
              defaultValue:
                'Adding these many vessels would make your workspace surpass the recommended limit of {{maxVessels}} vessels. Please consider using the vessel groups feature to manage your vessels.',
              maxVessels: MAX_VESSEL_REPORT_PIN,
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
      {/* TODO remove when GFWOnly is removed */}
      <Icon
        icon="gfw-logo"
        type="original-colors"
        tooltip={t('common.onlyVisibleForGFW', 'Only visible for GFW users')}
      />
      {hasAllVesselsInWorkspace
        ? t('analysis.removeVessels', 'Remove from workspace')
        : t('analysis.pinVessels', 'Add to workspace')}
    </Button>
  )
}
