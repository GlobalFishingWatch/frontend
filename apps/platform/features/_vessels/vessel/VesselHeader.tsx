import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniqBy } from 'es-toolkit'

import type { RegistryImage } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import { IconButton } from '@globalfishingwatch/ui-components'
import { VESSEL_DOWNLOAD_PDF_TESTID, VESSEL_NAME_TESTID } from '@platform/config/selectors/vessels'

import { useSidePanel } from 'features/_map/content-panel/contentPanel.hooks'
import {
  selectVesselProfileColor,
  selectVesselProfileDataview,
  selectVesselProfileDataviewIntanceResolved,
} from 'features/_map/dataviews/selectors/dataviews.instances.selectors'
import { useDeckMap } from 'features/_map/map/map-context.hooks'
import { useTimerangeConnect } from 'features/_map/timebar/timerange.hooks'
import { selectReadOnly } from 'features/_map/workspace/selectors/app.selectors'
import VesselDownload from 'features/_map/workspace/vessels/VesselDownload'
import { selectIsWorkspaceOwnerOrDefault } from 'features/_map/workspace/workspace.selectors'
import { selectIsGuestUser } from 'features/_user/selectors/user.selectors'
import VesselGroupAddButton, {
  VesselGroupAddActionButton,
} from 'features/_user/vessel-groups/VesselGroupAddButton'
import { selectVesselInfoData } from 'features/_vessels/vessel/selectors/vessel.selectors'
import {
  selectVesselIdentityId,
  selectVesselIdentitySource,
} from 'features/_vessels/vessel/vessel.config.selectors'
import { setVesselPrintMode } from 'features/_vessels/vessel/vessel.slice'
import { getOtherVesselNames, getVesselProperty } from 'features/_vessels/vessel/vessel.utils'
import { useVesselProfileBounds } from 'features/_vessels/vessel/vessel-bounds.hooks'
import VesselDeprecatedLink from 'features/_vessels/vessel/VesselDeprecatedLink'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { COLOR_PRIMARY_BLUE } from 'features/app/app.config'
import { useAppDispatch } from 'features/app/app.hooks'
import { useIsClientHydrated } from 'hooks/ssr.hooks'
import { useReplaceQueryParams } from 'router/routes.hook'
import { getCurrentAppUrl } from 'router/routes.utils'
import { handleOpenImage } from 'utils/img'
import { formatInfoField, getVesselOtherNamesLabel } from 'utils/info'

import styles from './VesselHeader.module.css'

const VesselHeader = ({ isSticky }: { isSticky?: boolean }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { replaceQueryParams } = useReplaceQueryParams()
  const isSmallScreen = useSmallScreen()
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const isWorkspaceOwner = useSelector(selectIsWorkspaceOwnerOrDefault)
  const vesselProfileDataviewIntance = useSelector(selectVesselProfileDataviewIntanceResolved)
  const vessel = useSelector(selectVesselInfoData)
  const guestUser = useSelector(selectIsGuestUser)
  const vesselColor = useSelector(selectVesselProfileColor)
  const vesselProfileDataview = useSelector(selectVesselProfileDataview)
  const { boundsReady, setVesselBounds } = useVesselProfileBounds()
  const isClientHydrated = useIsClientHydrated()
  const { closeAllSidePanels } = useSidePanel()
  const deck = useDeckMap()
  // The dates the print shows over the map (MapInfo → TimelineDatesRange)
  const { start, end } = useTimerangeConnect()
  const [pdfLoading, setPdfLoading] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const readOnly = useSelector(selectReadOnly)

  const trackAction = useCallback((label: 'center_map' | 'download_pdf' | 'share') => {
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
    if (isSmallScreen) replaceQueryParams({ sidebarOpen: false })
    setVesselBounds()
    trackAction('center_map')
  }

  const onDownloadPdfClick = async () => {
    closeAllSidePanels()
    trackAction('download_pdf')
    setPdfLoading(true)
    // Print mode lists every event instead of the virtualized window
    dispatch(setVesselPrintMode(true))
    try {
      const { downloadSidebarPdf } = await import('features/pdf/pdf.download')
      await downloadSidebarPdf({
        deck,
        filename: `GFW-vessel-${shipname}.pdf`,
        title: shipname,
        timerange: start && end ? { start, end } : undefined,
      })
    } finally {
      dispatch(setVesselPrintMode(false))
      setPdfLoading(false)
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePosition({ x, y })
  }

  const copyright = allVesselImages[currentImageIndex]?.copyright
    ? `© ${allVesselImages[currentImageIndex].copyright}`
    : undefined

  const shipnameLabel = formatInfoField(shipname, 'shipname')
  const showDeprecatedWarning = isWorkspaceOwner && vesselProfileDataviewIntance?.deprecated

  return (
    <div className={cx(styles.summaryContainer, { [styles.sticky]: isSticky })}>
      {allVesselImages.length > 0 && (
        <div
          className={styles.imageSliderContainer}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onMouseMove={handleMouseMove}
        >
          <a
            href={`${allVesselImages[currentImageIndex].url}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) =>
              handleOpenImage(e, {
                data: allVesselImages[currentImageIndex].url,
                copyright,
                title: (shipnameLabel || t((t) => t.common.vessel)) as string,
                type: 'vessel',
              })
            }
          >
            <img
              src={allVesselImages[currentImageIndex].url}
              alt={`${shipnameLabel} - ${currentImageIndex + 1}`}
              title={copyright}
              className={styles.vesselImage}
            />
          </a>
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
                  aria-label={t((t) => t.vessel.goToImage, {
                    number: String(index + 1),
                  })}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <div className={styles.titleContainer}>
        <h1 data-testid={VESSEL_NAME_TESTID} className={styles.title}>
          <svg className={styles.vesselIcon} width="16" height="16">
            <path
              fill={vesselColor || COLOR_PRIMARY_BLUE}
              stroke={COLOR_PRIMARY_BLUE}
              strokeOpacity=".5"
              d="M15.23.75v6.36l-7.8 7.8-1.58-4.78-4.78-1.59L8.87.75h6.36Z"
            />
          </svg>
          {shipnameLabel}
          <span className={styles.secondary}>{otherNamesLabel}</span>
          {isClientHydrated && (
            <a hidden className={styles.reportLink} href={getCurrentAppUrl()}>
              {t((t) => t.vessel.linkToVessel)}
            </a>
          )}
        </h1>

        <div className={styles.actionsContainer}>
          {showDeprecatedWarning && (
            <VesselDeprecatedLink
              vesselIdentity={vessel}
              dataview={vesselProfileDataviewIntance}
              isVesselProfile
            />
          )}
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
          {!guestUser && (
            <IconButton
              className="print-hidden"
              type="border"
              icon="target"
              tooltip={t((t) => t.layer.vessel_fit_bounds)}
              tooltipPlacement="bottom"
              size="medium"
              disabled={!isClientHydrated || !boundsReady}
              onClick={onVesselFitBoundsClick}
            />
          )}
          <IconButton
            className="print-hidden"
            type="border"
            icon="download"
            tooltip={t((t) => t.analysis.downloadPdf)}
            size="medium"
            tooltipPlacement="bottom"
            loading={pdfLoading}
            onClick={onDownloadPdfClick}
            testId={VESSEL_DOWNLOAD_PDF_TESTID}
          />
          {!readOnly && (
            <VesselGroupAddButton
              vessels={vessel ? [vessel] : []}
              onAddToVesselGroup={onAddToVesselGroup}
            >
              <VesselGroupAddActionButton buttonSize="medium" buttonType="border-secondary" />
            </VesselGroupAddButton>
          )}
        </div>
      </div>
    </div>
  )
}

export default VesselHeader
