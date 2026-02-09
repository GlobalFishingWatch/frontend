import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from '@tanstack/react-router'

import type { DataviewInstance, EventType } from '@globalfishingwatch/api-types'
import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { Tooltip } from '@globalfishingwatch/ui-components'

import { DEFAULT_WORKSPACE_CATEGORY } from 'data/workspaces'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { getVesselDataviewInstance } from 'features/dataviews/dataviews.utils'
import { selectVesselsDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { selectVesselTemplateDataviews } from 'features/dataviews/selectors/dataviews.vessels.selectors'
import { selectTrackCorrectionOpen } from 'features/track-correction/track-selection.selectors'
import { selectVesselInfoDataId } from 'features/vessel/selectors/vessel.selectors'
import { DEFAULT_VESSEL_IDENTITY_ID } from 'features/vessel/vessel.config'
import type { VesselDataIdentity } from 'features/vessel/vessel.slice'
import {
  resetVesselState,
  setVesselEventId,
  setVesselEventType,
  setVesselFitBoundsOnLoad,
} from 'features/vessel/vessel.slice'
import { getVesselIdentityId } from 'features/vessel/vessel.utils'
import {
  selectCurrentWorkspaceCategory,
  selectCurrentWorkspaceId,
} from 'features/workspace/workspace.selectors'
import {
  selectIsStandaloneSearchLocation,
  selectIsVesselLocation,
  selectLocationQuery,
} from 'routes/routes.selectors'
import type { QueryParams } from 'types'

import styles from './Vessel.module.css'

type VesselLinkProps = {
  children?: any
  className?: string
  datasetId?: string
  dataviewId?: string
  eventId?: string
  eventType?: EventType
  fitBounds?: boolean
  identity?: VesselDataIdentity
  onClick?: (e: MouseEvent, vesselId?: string) => void
  query?: Partial<Record<keyof QueryParams, string | number>>
  showTooltip?: boolean
  testId?: string
  tooltip?: React.ReactNode
  vesselId?: string
}
const VesselLink = ({
  children = '',
  className = '',
  datasetId,
  dataviewId,
  eventId,
  eventType,
  fitBounds = false,
  identity,
  onClick,
  query,
  showTooltip = true,
  testId = 'link-vessel-profile',
  tooltip,
  vesselId: vesselIdProp,
}: VesselLinkProps) => {
  const { t } = useTranslation()
  const workspaceId = useSelector(selectCurrentWorkspaceId)
  const locationQuery = useSelector(selectLocationQuery)
  const isSearchLocation = useSelector(selectIsStandaloneSearchLocation)
  const isVesselLocation = useSelector(selectIsVesselLocation)
  const vesselInfoDataId = useSelector(selectVesselInfoDataId)
  const workspaceCategory = useSelector(selectCurrentWorkspaceCategory)
  const vesselDataviews = useSelector(selectVesselsDataviews)
  const vesselTemplateDataviews = useSelector(selectVesselTemplateDataviews)
  const dispatch = useDispatch()
  const vesselId = vesselIdProp || identity?.id
  const vesselDatasetId = datasetId || DEFAULT_VESSEL_IDENTITY_ID
  const standaloneLink = isSearchLocation || isVesselLocation
  const isTrackCorrectionOpen = useSelector(selectTrackCorrectionOpen)

  const onLinkClick = useCallback(
    (e: any) => {
      if (!e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        if (vesselId !== vesselInfoDataId) {
          dispatch(resetVesselState())
        }
        if (eventId) {
          dispatch(setVesselEventId(eventId))
        }
        if (eventType) {
          dispatch(setVesselEventType(eventType))
        }
        // This needs to happen after dispatch resetVesselState so there is no override
        dispatch(setVesselFitBoundsOnLoad(fitBounds))
      }
      if (onClick) {
        onClick(e, vesselId)
        trackEvent({
          category: TrackCategory.SearchVessel,
          action: 'vessel search click',
          label: vesselId,
        })
      }
    },
    [dispatch, eventId, eventType, fitBounds, onClick, vesselId, vesselInfoDataId]
  )

  if (!vesselId) return children

  const dataviewInstanceToUpdateId = vesselDataviews.find(
    (instance) => instance.id.includes(vesselId) || instance.id === dataviewId
  )?.id
  let dataviewInstances = locationQuery?.dataviewInstances || []
  if (dataviewInstanceToUpdateId) {
    // When coming from a saved workspace the vessel instance might not be in the url yet
    const isInWorkspace = dataviewInstances?.some(
      ({ id }: any) => id === dataviewInstanceToUpdateId
    )
    if (isInWorkspace) {
      dataviewInstances = dataviewInstances?.map((instance) => {
        const matches = instance.id === dataviewInstanceToUpdateId
        if (matches) {
          return {
            ...instance,
            config: {
              ...instance.config,
              visible: true,
            },
            deleted: false,
          }
        }
        return instance
      })
    } else {
      dataviewInstances = [
        ...dataviewInstances,
        {
          ...getVesselDataviewInstance({
            vessel: { id: vesselId },
            datasets: { info: vesselDatasetId },
            vesselTemplateDataviews,
          }),
          config: {
            visible: true,
          },
        },
      ]
    }
  }

  const linkSearch = {
    ...locationQuery,
    // Clean search url when clicking on vessel link
    query: undefined,
    vesselDatasetId,
    ...(identity && {
      vesselIdentitySource: identity.identitySource,
      ...(identity.identitySource === VesselIdentitySourceEnum.SelfReported
        ? {
            vesselSelfReportedId: getVesselIdentityId(identity),
          }
        : { vesselRegistryId: getVesselIdentityId(identity) }),
    }),
    ...(query || {}),
    dataviewInstances,
  }

  const linkTo = standaloneLink ? '/vessel/$vesselId' : '/$category/$workspaceId/vessel/$vesselId'
  const linkParams = standaloneLink
    ? { vesselId }
    : {
        category: workspaceCategory || DEFAULT_WORKSPACE_CATEGORY,
        workspaceId: workspaceId || '',
        vesselId,
      }

  return isTrackCorrectionOpen ? (
    <>
      <Tooltip className={styles.linkTooltip} content={t((t) => t.vessel.exitTrackCorrection)}>
        <span>{children}</span>
      </Tooltip>
    </>
  ) : (
    <Link
      {...(testId && { 'data-test': testId })}
      className={className}
      to={linkTo}
      params={linkParams}
      search={linkSearch}
      onClick={onLinkClick}
    >
      {showTooltip ? (
        <Tooltip
          className={styles.linkTooltip}
          content={tooltip || t((t) => t.vessel.clickToSeeMore)}
        >
          <span>{children}</span>
        </Tooltip>
      ) : (
        children
      )}
    </Link>
  )
}

export default VesselLink
