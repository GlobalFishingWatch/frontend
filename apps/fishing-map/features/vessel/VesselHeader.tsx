import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import Sticky from 'react-sticky-el'
import { useCallback, useEffect } from 'react'
import { IconButton } from '@globalfishingwatch/ui-components'
import {
  selectVesselInfoData,
  selectVesselPrintMode,
  setVesselPrintMode,
} from 'features/vessel/vessel.slice'
import { formatInfoField } from 'utils/info'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import {
  getCurrentIdentityVessel,
  getOtherVesselNames,
  getVesselProperty,
} from 'features/vessel/vessel.utils'
import { selectVesselProfileColor } from 'features/dataviews/dataviews.slice'
import { COLOR_PRIMARY_BLUE } from 'features/app/App'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
  selectViewOnlyVessel,
} from 'features/vessel/vessel.config.selectors'
import { selectIsWorkspaceVesselLocation } from 'routes/routes.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import { useVesselBounds } from 'features/vessel/vessel-bounds.hooks'
import { useCallbackAfterPaint } from 'hooks/paint.hooks'
import styles from './VesselHeader.module.css'

const VesselHeader = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const viewOnlyVessel = useSelector(selectViewOnlyVessel)
  const vessel = useSelector(selectVesselInfoData)
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const vesselColor = useSelector(selectVesselProfileColor)
  const vesselPrintMode = useSelector(selectVesselPrintMode)
  const { vesselBounds, setVesselBounds } = useVesselBounds()

  const vesselPrintCallback = useCallback(() => {
    window.print()
  }, [])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const otherNamesLabel = getOtherVesselNames(vessel, nShipname)

  const onVesselFitBoundsClick = () => {
    if (vesselBounds) {
      setVesselBounds(vesselBounds)
    }
  }

  const onPrintClick = () => {
    dispatch(setVesselPrintMode(true))
  }

  const setViewOnlyVessel = () => {
    dispatchQueryParams({ viewOnlyVessel: !viewOnlyVessel })
  }

  return (
    <Sticky scrollElement=".scrollContainer" stickyClassName={styles.sticky}>
      <div className={cx(styles.summaryContainer, styles.titleContainer)}>
        <h1 className={styles.title}>
          <svg className={styles.vesselIcon} width="16" height="16">
            <path
              fill={vesselColor || COLOR_PRIMARY_BLUE}
              stroke={COLOR_PRIMARY_BLUE}
              strokeOpacity=".5"
              d="M15.23.75v6.36l-7.8 7.8-1.58-4.78-4.78-1.59L8.87.75h6.36Z"
            />
          </svg>
          {formatInfoField(shipname, 'name')}
          <span className={styles.secondary}>{otherNamesLabel}</span>
          <div>
            <a className={styles.reportLink} href={window.location.href}>
              {t('vessel.linkToVessel', 'Check the vessel profile here')}
            </a>
          </div>
        </h1>
        <div className={styles.actionsContainer}>
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
            disabled={!vesselBounds}
            onClick={onVesselFitBoundsClick}
          />
          <IconButton
            className="print-hidden"
            type="border"
            icon="print"
            tooltip={t('vessel.print', 'Print or save as PDF')}
            tooltipPlacement="bottom"
            size="small"
            onClick={onPrintClick}
          />
          {/* TODO: get info and track datasets for vessel */}
          <VesselGroupAddButton
            buttonSize="small"
            buttonType="border-secondary"
            vessels={vessel ? [getCurrentIdentityVessel(vessel)] : []}
            showCount={false}
            buttonClassName="print-hidden"
          />
        </div>
      </div>
    </Sticky>
  )
}

export default VesselHeader
