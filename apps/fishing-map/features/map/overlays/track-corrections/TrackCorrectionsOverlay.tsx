import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { HtmlOverlay, HtmlOverlayItem } from '@nebula.gl/overlays'
import { useSetAtom } from 'jotai'

import { IconButton } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectVesselsDatasets } from 'features/datasets/datasets.selectors'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { useMapViewport } from 'features/map/map-viewport.hooks'
import { overlaysCursorAtom } from 'features/map/overlays/overlays-hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useSetTrackCorrectionId } from 'features/track-correction/track-correction.hooks'
import {
  setTrackCorrectionDataviewId,
  type TrackCorrection,
} from 'features/track-correction/track-correction.slice'
import { selectTrackCorrectionIssues } from 'features/track-correction/track-selection.selectors'
import { usePinVessel } from 'features/vessel/VesselPin'

import styles from './TrackCorrectionsOverlay.module.css'

const TrackCorrectionOverlayIssue = ({ issue }: { issue: TrackCorrection }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const setOverlaysCursor = useSetAtom(overlaysCursorAtom)
  const vesselDatasets = useSelector(selectVesselsDatasets)
  const setTrackCorrectionId = useSetTrackCorrectionId()
  const { setTimerange } = useTimerangeConnect()

  const handleMouseEnter = useCallback(() => {
    setOverlaysCursor('pointer')
  }, [setOverlaysCursor])

  const handleMouseLeave = useCallback(() => {
    setOverlaysCursor('')
  }, [setOverlaysCursor])

  const { onPinClick, loading, vesselInWorkspace } = usePinVessel({
    vesselToSearch: { id: issue.vesselId, datasets: (vesselDatasets || []).map((d) => d.id) },
  })

  const onIssueClick = useCallback(async () => {
    let dataviewInstanceId = vesselInWorkspace?.id
    if (!dataviewInstanceId) {
      const { dataviewInstance } = await onPinClick()
      dataviewInstanceId = dataviewInstance?.id
    }
    if (dataviewInstanceId) {
      dispatch(setTrackCorrectionDataviewId(dataviewInstanceId))
      setTrackCorrectionId(issue.issueId)
      if (issue.startDate && issue.endDate) {
        setTimerange({
          start: issue.startDate,
          end: issue.endDate,
        })
      }
    }
  }, [vesselInWorkspace?.id, onPinClick, dispatch, setTrackCorrectionId, issue, setTimerange])

  return (
    <IconButton
      className={styles.button}
      icon="feedback"
      loading={loading}
      onClick={onIssueClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tooltip={t('trackCorrection.mapTooltip', {
        date: formatI18nDate(issue.lastUpdated),
        type: issue.type, // TODO: translate type
        defaultValue: 'Issue added on {{date}} reported as {{type}}',
      })}
    />
  )
}

const TrackCorrectionsOverlay = (): React.ReactNode | null => {
  const trackCorrectionIssues = useSelector(selectTrackCorrectionIssues)
  const viewport = useMapViewport()

  if (!viewport || !trackCorrectionIssues?.length) {
    return null
  }
  return (
    <HtmlOverlay viewport={viewport} key="2">
      {trackCorrectionIssues.map((issue) => {
        if (!issue.lon || !issue.lat) {
          return null
        }
        return (
          <HtmlOverlayItem
            key={issue.issueId}
            style={{
              pointerEvents: 'all',
              transform: 'translate(-50%,-50%)',
              maxWidth: '32rem',
              textAlign: 'center',
              fontWeight: 500,
            }}
            coordinates={[Number(issue.lon), Number(issue.lat)]}
          >
            <TrackCorrectionOverlayIssue issue={issue} />
          </HtmlOverlayItem>
        )
      })}
    </HtmlOverlay>
  )
}

export default TrackCorrectionsOverlay
