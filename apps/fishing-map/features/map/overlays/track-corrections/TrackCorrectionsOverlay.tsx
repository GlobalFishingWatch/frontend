import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { HtmlOverlay, HtmlOverlayItem } from '@nebula.gl/overlays'
import { useSetAtom } from 'jotai'

import { IconButton } from '@globalfishingwatch/ui-components'

import { formatI18nDate } from 'features/i18n/i18nDate'
import { useMapViewport } from 'features/map/map-viewport.hooks'
import { overlaysCursorAtom } from 'features/map/overlays/overlays-hooks'
import { useSetTrackCorrectionId } from 'features/track-correction/track-correction.hooks'
import { selectTrackCorrectionIssues } from 'features/track-correction/track-selection.selectors'

import styles from './TrackCorrectionsOverlay.module.css'

const TrackCorrectionsOverlay = (): React.ReactNode | null => {
  const { t } = useTranslation()
  const setOverlaysCursor = useSetAtom(overlaysCursorAtom)
  const trackCorrectionIssues = useSelector(selectTrackCorrectionIssues)
  const setTrackCorrectionId = useSetTrackCorrectionId()
  const viewport = useMapViewport()

  const handleMouseEnter = useCallback(() => {
    setOverlaysCursor('pointer')
  }, [setOverlaysCursor])

  const handleMouseLeave = useCallback(() => {
    setOverlaysCursor('')
  }, [setOverlaysCursor])

  const onIssueClick = useCallback(
    (issueId: string) => {
      setTrackCorrectionId(issueId)
    },
    [setTrackCorrectionId]
  )

  if (!trackCorrectionIssues?.length) {
    return null
  }
  return (
    <div onPointerUp={(event) => event.preventDefault()}>
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
              <IconButton
                className={styles.button}
                icon="feedback"
                onClick={() => onIssueClick(issue.issueId)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                tooltip={t('trackCorrection.mapTooltip', {
                  date: formatI18nDate(issue.createdAt),
                  type: issue.type, // TODO: translate type
                  defaultValue: 'Issue added on {{date}} reported as {{type}}',
                })}
              />
            </HtmlOverlayItem>
          )
        })}
      </HtmlOverlay>
    </div>
  )
}

export default TrackCorrectionsOverlay
