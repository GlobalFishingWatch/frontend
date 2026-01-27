import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ContextPickingObject, UserLayerPickingObject } from '@globalfishingwatch/deck-layers'
import { IconButton } from '@globalfishingwatch/ui-components'

import { selectTrackCorrectionOpen } from 'features/track-correction/track-selection.selectors'
import { htmlSafeParse, options } from 'utils/html-parser'

import ContextLayerDownloadPopupButton from './ContextLayerDownloadPopupButton'
import ContextLayerReportLink from './ContextLayerReportLink'

import styles from '../Popup.module.css'

type ContextLayersRowProps = {
  id: string
  label: string
  feature: ContextPickingObject | UserLayerPickingObject
  showFeaturesDetails: boolean
  showActions?: boolean
  linkHref?: string
  handleDownloadClick?: (e: React.MouseEvent<Element, MouseEvent>) => void
  handleReportClick?: (
    e: React.MouseEvent<Element, MouseEvent>,
    feature: ContextPickingObject | UserLayerPickingObject
  ) => void
}

const ContextLayersRow = ({
  id,
  label,
  showFeaturesDetails,
  linkHref,
  feature,
  handleDownloadClick,
  handleReportClick,
}: ContextLayersRowProps) => {
  const { t } = useTranslation()
  const isTrackCorrectionOpen = useSelector(selectTrackCorrectionOpen)

  const parsedLabel = htmlSafeParse(label)
  return (
    <div className={styles.row} key={id}>
      <span className={styles.rowText}>{parsedLabel}</span>
      {showFeaturesDetails && (
        <div className={styles.rowActions}>
          {handleDownloadClick && (
            <ContextLayerDownloadPopupButton feature={feature} onClick={handleDownloadClick} />
          )}
          {handleReportClick && !isTrackCorrectionOpen && (
            <ContextLayerReportLink feature={feature} onClick={handleReportClick} />
          )}
          {linkHref && (
            <a target="_blank" rel="noopener noreferrer" href={linkHref}>
              <IconButton icon="info" tooltip={t((t) => t.common.learnMore)} size="small" />
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default ContextLayersRow
