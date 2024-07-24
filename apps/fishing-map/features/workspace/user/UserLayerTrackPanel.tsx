import { Fragment, useCallback, useMemo, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { uniqBy } from 'es-toolkit'
import { NO_RECORD_ID } from '@globalfishingwatch/data-transforms'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import {
  getUserDataviewDataset,
  getDatasetConfigurationProperty,
} from '@globalfishingwatch/datasets-client'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { UserTracksLayer } from '@globalfishingwatch/deck-layers'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { selectActiveTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'

type UserPanelProps = {
  dataview: UrlDataviewInstance
}

const SEE_MORE_LENGTH = 5

export function useUserLayerTrackMetadata(dataview: UrlDataviewInstance) {
  const dataset = getUserDataviewDataset(dataview)
  const allTracksActive = useSelector(selectActiveTrackDataviews)
  const trackLayer = useGetDeckLayer<UserTracksLayer>(dataview?.id)
  const data = useMemo(() => {
    return trackLayer?.instance?.getData()
  }, [trackLayer])

  const idProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'lineId',
  }) as string

  const hasRecordIds = idProperty
    ? data?.features?.some((f) => f.properties?.id !== NO_RECORD_ID)
    : false

  const singleTrack = allTracksActive.length === 1
  const hasFeaturesColoredByField = singleTrack && data && hasRecordIds

  return {
    data,
    hasRecordIds,
    hasFeaturesColoredByField,
    error: trackLayer?.instance?.getError(),
    loaded: trackLayer?.loaded,
  }
}

function UserLayerTrackPanel({ dataview }: UserPanelProps) {
  const { t } = useTranslation()
  const [seeMoreOpen, setSeeMoreOpen] = useState(false)

  const { data, hasFeaturesColoredByField } = useUserLayerTrackMetadata(dataview)

  const onSeeMoreClick = useCallback(() => {
    setSeeMoreOpen(!seeMoreOpen)
  }, [seeMoreOpen])

  if (!hasFeaturesColoredByField || !data?.features) {
    return null
  }

  const dataset = getUserDataviewDataset(dataview)
  const lineIdProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'lineId',
  }) as string
  const filterValues = dataview.config?.filters?.[lineIdProperty] || []

  const features = uniqBy(data?.features, (f) => f.properties?.[lineIdProperty])

  return (
    <Fragment>
      {features.slice(0, seeMoreOpen ? undefined : SEE_MORE_LENGTH).map((feature, index) => {
        if (
          !feature.properties?.[lineIdProperty] ||
          (filterValues?.length && !filterValues.includes(feature.properties?.[lineIdProperty]))
        ) {
          return null
        }
        return (
          <div
            key={index}
            className={styles.trackColor}
            style={
              {
                '--color': feature.properties?.color || dataview.config?.color,
              } as React.CSSProperties
            }
          >
            {feature.properties?.[lineIdProperty]}
          </div>
        )
      })}
      {features?.length > SEE_MORE_LENGTH && (
        <button
          className={cx(styles.link, {
            [styles.more]: !seeMoreOpen,
            [styles.less]: seeMoreOpen,
          })}
          onClick={onSeeMoreClick}
        >
          {seeMoreOpen ? t('common.less', 'less') : t('common.more', 'more')}
        </button>
      )}
    </Fragment>
  )
}

export default UserLayerTrackPanel
