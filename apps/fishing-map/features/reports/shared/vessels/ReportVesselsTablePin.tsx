import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Button, Icon, Spinner } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { getVesselDataview, VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import { selectVesselsDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import type { ReportTableVessel } from 'features/reports/shared/vessels/report-vessels.types'
import { setPinningVessels } from 'features/reports/tabs/activity/reports-activity.slice'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'

import usePinReportVessels, { MAX_VESSEL_REPORT_PIN } from './report-vessels.hooks'

import styles from './ReportVesselsTable.module.css'

type ReportVesselTablePinProps = {
  vessels: ReportTableVessel[]
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
    (vessel) => getVesselDataview({ dataviews: allVesselsInWorkspace, vesselId: vessel.id! }) || []
  )
  const hasAllVesselsInWorkspace = vesselDataviewInstancesPinned?.length
    ? vessels.every(({ id }) => vesselPinnedIds.includes(id))
    : false

  const totalVesselsLength = (allVesselsInWorkspace?.length || 0) + (vessels?.length || 0)
  const hasMoreMaxVesselsAllowed = totalVesselsLength > MAX_VESSEL_REPORT_PIN

  const handleOnClick = async () => {
    const action = hasAllVesselsInWorkspace ? 'delete' : 'add'
    if (action === 'add') {
      dispatch(setPinningVessels(true))
      setLoading(true)
      const notPinnedVessels = vessels.filter(({ id }) => !vesselPinnedIds.includes(id))
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
      <Icon icon="gfw-logo" type="original-colors" tooltip={t('common.onlyVisibleForGFW')} />
      {hasAllVesselsInWorkspace ? t('analysis.removeVessels') : t('analysis.pinVessels')}
    </Button>
  )
}
