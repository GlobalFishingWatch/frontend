/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniqBy, upperFirst } from 'es-toolkit'

import type { RegistryImage } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import { IconButton } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectVesselProfileColor,
  selectVesselProfileDataview,
} from 'features/dataviews/selectors/dataviews.instances.selectors'
import {
  selectVesselInfoData,
  selectVesselPrintMode,
} from 'features/vessel/selectors/vessel.selectors'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/vessel/vessel.config.selectors'
import { setVesselPrintMode } from 'features/vessel/vessel.slice'
import { getOtherVesselNames, getVesselProperty } from 'features/vessel/vessel.utils'
import { useVesselProfileBounds } from 'features/vessel/vessel-bounds.hooks'
import VesselGroupAddButton, {
  VesselGroupAddActionButton,
} from 'features/vessel-groups/VesselGroupAddButton'
import VesselDownload from 'features/workspace/vessels/VesselDownload'
import { useCallbackAfterPaint } from 'hooks/paint.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { formatInfoField, getVesselOtherNamesLabel } from 'utils/info'

import styles from './VesselHeader.module.css'

const VesselHeader = ({ isSticky }: { isSticky?: boolean }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const isSmallScreen = useSmallScreen()
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const vessel = useSelector(selectVesselInfoData)
  const vesselColor = useSelector(selectVesselProfileColor)
  const vesselPrintMode = useSelector(selectVesselPrintMode)
  const vesselProfileDataview = useSelector(selectVesselProfileDataview)
  const { boundsReady, setVesselBounds } = useVesselProfileBounds()
  const vesselPrintCallback = useCallback(() => {
    window.print()
  }, [])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

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

  if (!vessel) return null

  const allVesselImages: RegistryImage[] = uniqBy(
    vessel.identities
      .flatMap((identity) => identity.extraFields?.[0]?.images?.map((img) => img) || [])
      .filter(Boolean),
    (img: RegistryImage) => img.url
  )

  const shipname = getVesselProperty(vessel, 'shipname', { identityId, identitySource })
  const nShipname = getVesselProperty(vessel, 'nShipname', { identityId, identitySource })
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePosition({ x, y })
  }

  return (
    <div className={cx(styles.summaryContainer, { [styles.sticky]: isSticky })}>
      {allVesselImages.length > 0 && (
        <div
          className={styles.imageSliderContainer}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={allVesselImages[currentImageIndex].url}
            alt={`${shipname} - ${currentImageIndex + 1}`}
            title={
              allVesselImages[currentImageIndex].copyright
                ? `© ${allVesselImages[currentImageIndex].copyright}`
                : undefined
            }
            className={styles.vesselImage}
          />
          {isHovering && (
            <div className={styles.zoomedContainer}>
              <img
                src={allVesselImages[currentImageIndex].url}
                alt=""
                className={styles.zoomedImage}
                style={{
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                }}
              />
            </div>
          )}
          {allVesselImages.length > 1 && (
            <div className={styles.navigationButtons}>
              {allVesselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`${styles.dot} ${index === currentImageIndex ? styles.activeDot : ''}`}
                  aria-label={t('vessel.goToImage', {
                    number: index + 1,
                  })}
                />
              ))}
            </div>
          )}
        </div>
      )}
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
          <span className={styles.reportLink}>
            <a href={window.location.href}>{t('vessel.linkToVessel')}</a>
          </span>
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
          <IconButton
            className="print-hidden"
            type="border"
            icon="target"
            tooltip={t('layer.vessel_fit_bounds')}
            tooltipPlacement="bottom"
            size="small"
            disabled={!boundsReady}
            onClick={onVesselFitBoundsClick}
          />
          <IconButton
            className="print-hidden"
            type="border"
            icon="print"
            tooltip={upperFirst(t('analysis.print'))}
            size="small"
            tooltipPlacement="bottom"
            onClick={onPrintClick}
          />
          <VesselGroupAddButton
            vessels={vessel ? [vessel] : []}
            onAddToVesselGroup={onAddToVesselGroup}
          >
            <VesselGroupAddActionButton buttonSize="small" buttonType="border-secondary" />
          </VesselGroupAddButton>
        </div>
      </div>
    </div>
  )
}

export default VesselHeader
