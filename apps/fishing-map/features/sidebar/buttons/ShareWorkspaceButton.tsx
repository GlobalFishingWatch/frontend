import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useClipboardNotification } from 'features/sidebar/sidebar.hooks'
import type { ROUTE_TYPES } from 'routes/routes'
import { selectLocationType } from 'routes/routes.selectors'

function ShareWorkspaceButton() {
  const { t } = useTranslation()
  const location = useSelector(selectLocationType)

  const shareTitles: Partial<Record<ROUTE_TYPES, string>> = {
    HOME: t('common.share'),
    WORKSPACE: t('common.share'),
    REPORT: t('analysis.share'),
    WORKSPACE_REPORT: t('analysis.share'),
    VESSEL: t('vessel.share'),
    WORKSPACE_VESSEL: t('vessel.share'),
  }

  const { showClipboardNotification, copyToClipboard } = useClipboardNotification()

  const onShareClick = useCallback(() => {
    const trackEventCategories: Partial<Record<ROUTE_TYPES, TrackCategory>> = {
      HOME: TrackCategory.WorkspaceManagement,
      WORKSPACE: TrackCategory.WorkspaceManagement,
      REPORT: TrackCategory.Analysis,
      WORKSPACE_REPORT: TrackCategory.Analysis,
      VESSEL: TrackCategory.VesselProfile,
      WORKSPACE_VESSEL: TrackCategory.VesselProfile,
    }
    const trackEventActions: Partial<Record<ROUTE_TYPES, string>> = {
      HOME: 'workspace',
      WORKSPACE: 'workspace',
      REPORT: 'report',
      WORKSPACE_REPORT: 'report',
      VESSEL: 'report',
      WORKSPACE_VESSEL: 'report',
    }
    copyToClipboard(window.location.href)
    trackEvent({
      category: trackEventCategories[location] as TrackCategory,
      action: `Click share ${trackEventActions[location]}'}`,
    })
  }, [copyToClipboard, location])

  return (
    <IconButton
      icon={showClipboardNotification ? 'tick' : 'share'}
      size="medium"
      className="print-hidden"
      onClick={onShareClick}
      tooltip={showClipboardNotification ? t('common.copiedToClipboard') : shareTitles[location]}
      tooltipPlacement="bottom"
    />
  )
}

export default ShareWorkspaceButton
