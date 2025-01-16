import { Fragment, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniqBy } from 'es-toolkit'

import {
  COORDINATE_PROPERTY_TIMESTAMP,
  getUTCDate,
  NO_RECORD_ID,
} from '@globalfishingwatch/data-transforms'
import {
  getDatasetConfigurationProperty,
  getUserDataviewDataset,
} from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { UserTracksLayer } from '@globalfishingwatch/deck-layers'
import type { UserTrackFeature } from '@globalfishingwatch/deck-loaders'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectActiveUserTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { useDisableHighlightTimeConnect } from 'features/timebar/timebar.hooks'
import { setHighlightedTime } from 'features/timebar/timebar.slice'
import styles from 'features/workspace/shared/LayerPanel.module.css'

type UserPanelProps = {
  dataview: UrlDataviewInstance
}

const SEE_MORE_LENGTH = 5

export function useUserLayerTrackMetadata(dataview: UrlDataviewInstance) {
  const dataset = getUserDataviewDataset(dataview)
  const allTracksActive = useSelector(selectActiveUserTrackDataviews)
  const trackLayer = useGetDeckLayer<UserTracksLayer>(dataview?.id)
  const data = useMemo(() => {
    return trackLayer?.instance?.getData?.()
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
    error: trackLayer?.instance?.getError?.(),
    loaded: trackLayer?.loaded,
  }
}

const getFeatureTimeExtent = (
  feature: UserTrackFeature,
  timestampProperty = COORDINATE_PROPERTY_TIMESTAMP
) => {
  const times = feature.properties.coordinateProperties[timestampProperty]
  if (!times || !times.length) {
    return null
  }
  const min = Array.isArray(times[0]) ? times[0][0] : times[0]
  const latestValue = times[times.length - 1]
  const max = Array.isArray(latestValue)
    ? (latestValue as number[])[latestValue.length - 1]
    : latestValue
  if (!min || !max) {
    return null
  }
  return { start: getUTCDate(min).toISOString(), end: getUTCDate(max).toISOString() }
}

function UserLayerTrackPanel({ dataview }: UserPanelProps) {
  const { t } = useTranslation()
  const [seeMoreOpen, setSeeMoreOpen] = useState(false)
  const dispatch = useAppDispatch()
  const { dispatchDisableHighlightedTime } = useDisableHighlightTimeConnect()

  const { data, hasFeaturesColoredByField } = useUserLayerTrackMetadata(dataview)
  const dataset = getUserDataviewDataset(dataview)

  const onSeeMoreClick = useCallback(() => {
    setSeeMoreOpen(!seeMoreOpen)
  }, [seeMoreOpen])

  const onFeatureMouseEnter = useCallback(
    (feature: UserTrackFeature) => {
      const extent = getFeatureTimeExtent(feature)
      if (extent) {
        dispatch(setHighlightedTime(extent))
      }
    },
    [dispatch]
  )

  const onFeatureMouseLeave = useCallback(
    (feature: UserTrackFeature) => {
      dispatchDisableHighlightedTime()
    },
    [dispatchDisableHighlightedTime]
  )

  if (!hasFeaturesColoredByField || !data?.features) {
    return null
  }

  const lineIdProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'lineId',
  }) as string

  const filterValues = dataview.config?.filters?.[lineIdProperty] || []

  const features = uniqBy(data?.features, (f) => {
    return f.properties?.[lineIdProperty]
  })

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
            onMouseEnter={() => onFeatureMouseEnter(feature)}
            onMouseLeave={() => onFeatureMouseLeave(feature)}
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
