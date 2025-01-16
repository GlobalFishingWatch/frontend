import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Sticky from 'react-sticky-el'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import { Button, Icon, IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectVesselProfileColor,
  selectVesselProfileDataview,
} from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectIsGFWUser } from 'features/user/selectors/user.selectors'
import {
  selectVesselInfoData,
  selectVesselPrintMode,
} from 'features/vessel/selectors/vessel.selectors'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
  selectViewOnlyVessel,
} from 'features/vessel/vessel.config.selectors'
import { setVesselPrintMode } from 'features/vessel/vessel.slice'
import {
  getCurrentIdentityVessel,
  getOtherVesselNames,
  getVesselProperty,
} from 'features/vessel/vessel.utils'
import { useVesselProfileBounds } from 'features/vessel/vessel-bounds.hooks'
import VesselGroupAddButton, {
  VesselGroupAddActionButton,
} from 'features/vessel-groups/VesselGroupAddButton'
import VesselDownload from 'features/workspace/vessels/VesselDownload'
import { useCallbackAfterPaint } from 'hooks/paint.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { selectIsWorkspaceVesselLocation } from 'routes/routes.selectors'
import { formatInfoField, getVesselOtherNamesLabel } from 'utils/info'

import styles from './VesselHeader.module.css'

const VesselHeader = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const isSmallScreen = useSmallScreen()
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const viewOnlyVessel = useSelector(selectViewOnlyVessel)
  const vessel = useSelector(selectVesselInfoData)
  const isGFWUser = useSelector(selectIsGFWUser)
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const vesselColor = useSelector(selectVesselProfileColor)
  const vesselPrintMode = useSelector(selectVesselPrintMode)
  const vesselProfileDataview = useSelector(selectVesselProfileDataview)
  const { boundsReady, setVesselBounds } = useVesselProfileBounds()
  const vesselIdentity = getCurrentIdentityVessel(vessel, {
    identityId,
    identitySource,
  })
  const vesselPrintCallback = useCallback(() => {
    window.print()
  }, [])

  const trackAction = useCallback((label: 'center_map' | 'print' | 'share') => {
    trackEvent({
      category: TrackCategory.VesselProfile,
      action: 'click_vessel_header_actions',
      label,
    })
  }, [])

  const onAddToVesselGroup = (vesselGroupId: string, vesselsCount?: number) => {
    trackEvent({
      category: TrackCategory.VesselGroups,
      action: 'add_to_vessel_group_from_vessel_profile',
      label: `${vesselGroupId}`,
      value: `number of vessel identities in group: ${vesselsCount}`,
    })
  }

  useEffect(() => {
    const enableVesselPrintMode = () => {
      dispatch(setVesselPrintMode(true))
    }
    const disableVesselPrintMode = () => {
      dispatch(setVesselPrintMode(false))
    }
    window.addEventListener('beforeprint', enableVesselPrintMode)
    window.addEventListener('afterprint', disableVesselPrintMode)
    return () => {
      window.removeEventListener('beforeprint', enableVesselPrintMode)
      window.removeEventListener('afterprint', disableVesselPrintMode)
    }
  }, [])

  useCallbackAfterPaint({
    callback: vesselPrintCallback,
    /**
     * Signal to the hook that we want to capture the frame right after our item list
     * model is populated.
     */
    enabled: vesselPrintMode,
  })

  const shipname = getVesselProperty(vessel, 'shipname', { identityId, identitySource })
  const nShipname = getVesselProperty(vessel, 'nShipname', { identityId, identitySource })
  const vesselImage = isGFWUser && vesselIdentity?.images?.[0]?.url
  const otherNamesLabel = getVesselOtherNamesLabel(getOtherVesselNames(vessel, nShipname))

  const onVesselFitBoundsClick = () => {
    if (isSmallScreen) dispatchQueryParams({ sidebarOpen: false })
    setVesselBounds()
    trackAction('center_map')
  }

  const onPrintClick = () => {
    dispatch(setVesselPrintMode(true))
    trackAction('print')
  }

  const setViewOnlyVessel = () => {
    if (isSmallScreen) dispatchQueryParams({ sidebarOpen: false })
    dispatchQueryParams({ viewOnlyVessel: !viewOnlyVessel })
  }

  return (
    <Sticky scrollElement=".scrollContainer" stickyClassName={styles.sticky}>
      <div className={styles.summaryContainer}>
        <div className={styles.summaryWrapper}>
          {vesselImage && <img src={vesselImage} alt={shipname} className={styles.vesselImage} />}
          <div className={styles.titleContainer}>
            <h1 data-test="vv-vessel-name" className={styles.title}>
              <svg className={styles.vesselIcon} width="16" height="16">
                <path
                  fill={vesselColor || COLOR_PRIMARY_BLUE}
                  stroke={COLOR_PRIMARY_BLUE}
                  strokeOpacity=".5"
                  d="M15.23.75v6.36l-7.8 7.8-1.58-4.78-4.78-1.59L8.87.75h6.36Z"
                />
              </svg>
              {formatInfoField(shipname, 'shipname')}
              <span className={styles.secondary}>{otherNamesLabel}</span>
              <div>
                <a className={styles.reportLink} href={window.location.href}>
                  {t('vessel.linkToVessel', 'Check the vessel profile here')}
                </a>
              </div>
            </h1>
            <div className={styles.actionsContainer}>
              {vesselProfileDataview && (
                <VesselDownload
                  dataview={vesselProfileDataview}
                  vesselIds={vessel.identities
                    .filter((i) => i.identitySource === VesselIdentitySourceEnum.SelfReported)
                    .map((i) => i.id)}
                  vesselTitle={shipname}
                  datasetId={vessel.track as string}
                  iconType="border"
                />
              )}
              {isWorkspaceVesselLocation && (
                <IconButton
                  className="print-hidden"
                  type="border"
                  icon={viewOnlyVessel ? 'layers-on' : 'layers-off'}
                  tooltip={
                    viewOnlyVessel
                      ? t('vessel.showOtherLayers', 'Show other layers')
                      : t('vessel.hideOtherLayers', 'Hide other layers')
                  }
                  tooltipPlacement="bottom"
                  size="small"
                  onClick={setViewOnlyVessel}
                />
              )}
              <IconButton
                className="print-hidden"
                type="border"
                icon="target"
                tooltip={t('layer.vessel_fit_bounds', 'Center view on vessel track')}
                tooltipPlacement="bottom"
                size="small"
                disabled={!boundsReady}
                onClick={onVesselFitBoundsClick}
              />
              <Button
                className="print-hidden"
                type="border-secondary"
                size="small"
                onClick={onPrintClick}
              >
                <p>{t('analysis.print ', 'print')}</p>
                <Icon icon="print" type="default" />
              </Button>
              <VesselGroupAddButton
                vessels={vessel ? [vessel] : []}
                onAddToVesselGroup={onAddToVesselGroup}
              >
                <VesselGroupAddActionButton buttonSize="small" buttonType="border-secondary" />
              </VesselGroupAddButton>
            </div>
          </div>
        </div>
      </div>
    </Sticky>
  )
}

export default VesselHeader
