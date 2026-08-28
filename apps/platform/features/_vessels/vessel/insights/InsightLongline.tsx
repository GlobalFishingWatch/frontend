import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useGetVesselEventsQuery } from 'queries/map/vessel-events-api'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { EventTypes, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { IconButton } from '@globalfishingwatch/ui-components'

import { fetchDatasetsByIdsThunk } from 'features/_map/datasets/datasets.slice'
import { selectTimeRange } from 'features/_map/workspace/selectors/app.timebar.selectors'
import { useVisibleVesselEvents } from 'features/_map/workspace/vessels/vessel-events.hooks'
import UserLoggedIconButton from 'features/_user/UserLoggedIconButton'
import { selectVesselInfoData } from 'features/_vessels/vessel/selectors/vessel.selectors'
import {
  selectLonglineSetsOnMap,
  selectVesselIdentityId,
  selectVesselIdentitySource,
  selectVesselSection,
} from 'features/_vessels/vessel/vessel.config.selectors'
import { parseLonglineSetsToCSV } from 'features/_vessels/vessel/vessel.download'
import { getVesselIdentities, getVesselProperty } from 'features/_vessels/vessel/vessel.utils'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useReplaceQueryParams } from 'router/routes.hook'

import InsightError from './InsightErrorMessage'
import { LONGLINE_FISHING_EVENTS_DATASET } from './insights.config'
import { removeNonTunaRFMO } from './insights.utils'
import LonglineSetsGraph from './LonglineSetsGraph'

import styles from './Insights.module.css'

const InsightLongline = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { start, end } = useSelector(selectTimeRange)
  const vessel = useSelector(selectVesselInfoData)
  const vesselSection = useSelector(selectVesselSection)
  const longlineSetsOnMap = useSelector(selectLonglineSetsOnMap)
  const identityId = useSelector(selectVesselIdentityId)
  const identitySource = useSelector(selectVesselIdentitySource)
  const { replaceQueryParams } = useReplaceQueryParams()
  const { setVesselEventVisibility } = useVisibleVesselEvents()
  const identities = getVesselIdentities(vessel, {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  })

  const { data, isFetching, error } = useGetVesselEventsQuery(
    {
      vessels: identities?.map((i) => i.id),
      datasets: [LONGLINE_FISHING_EVENTS_DATASET],
      'start-date': start,
      'end-date': end,
    },
    { skip: !identities?.length }
  )

  useEffect(() => {
    dispatch(fetchDatasetsByIdsThunk({ ids: [LONGLINE_FISHING_EVENTS_DATASET] }))
  }, [dispatch])

  useEffect(() => {
    if (vesselSection !== 'insights' && longlineSetsOnMap) {
      replaceQueryParams({ longlineSetsOnMap: undefined })
    }
  }, [vesselSection, longlineSetsOnMap, replaceQueryParams])

  const onShowOnMapClick = () => {
    if (!longlineSetsOnMap) {
      setVesselEventVisibility({ event: EventTypes.Fishing, visible: true })
    }
    replaceQueryParams({ longlineSetsOnMap: longlineSetsOnMap ? undefined : true })
  }

  const onDownloadClick = async () => {
    const csv = parseLonglineSetsToCSV(data!.map(removeNonTunaRFMO))
    const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' })
    const { saveAs } = await import('file-saver')
    const shipname = getVesselProperty(vessel, 'shipname', { identityId, identitySource })
    const flag = getVesselProperty(vessel, 'flag', { identityId, identitySource })
    saveAs(blob, `${shipname}(${flag})-longline-sets-${start}-${end}.csv`)
    trackEvent({
      category: TrackCategory.VesselProfile,
      action: 'vessel_longline_sets_download',
    })
  }

  return (
    <div id="longline" className={styles.insightContainer}>
      <div className={styles.insightTitle}>
        <label>{t((t) => t.vessel.insights.longline)}</label>
        <div className={styles.insightTitleActions}>
          <UserLoggedIconButton
            loginSource="vessel-download"
            size="medium"
            icon="download"
            className="print-hidden"
            disabled={isFetching || !data?.length}
            onClick={onDownloadClick}
            tooltip={t((t) => t.vessel.insights.longlineDownload)}
            loginTooltip={t((t) => t.download.eventsDownloadLogin)}
          />
          <IconButton
            size="medium"
            disabled={isFetching || !data?.length}
            icon={longlineSetsOnMap ? 'remove-from-map' : 'view-on-map'}
            onClick={onShowOnMapClick}
            tooltip={
              longlineSetsOnMap
                ? t((t) => t.vessel.insights.longlineHideFromMap)
                : t((t) => t.vessel.insights.longlineShowOnMap)
            }
          />
        </div>
      </div>
      {error ? (
        <InsightError error={error as ParsedAPIError} />
      ) : isFetching || !data ? (
        <LonglineSetsGraph loading />
      ) : data.length === 0 ? (
        <p className={styles.secondary}>{t((t) => t.vessel.insights.longlineEventsEmpty)}</p>
      ) : (
        <LonglineSetsGraph data={data.map(removeNonTunaRFMO)} />
      )}
    </div>
  )
}

export default InsightLongline
