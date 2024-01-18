import { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { FeatureCollection } from 'geojson'
import { useTranslation } from 'react-i18next'
import { uniqBy } from 'lodash'
import { NO_RECORD_ID } from '@globalfishingwatch/data-transforms'
import { DatasetTypes, Resource } from '@globalfishingwatch/api-types'
import {
  UrlDataviewInstance,
  resolveDataviewDatasetResource,
  selectResourceByUrl,
} from '@globalfishingwatch/dataviews-client'
import {
  getUserDataviewDataset,
  getDatasetConfigurationProperty,
} from '@globalfishingwatch/datasets-client'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { DEFAULT_CONTEXT_SOURCE_LAYER } from '@globalfishingwatch/layer-composer'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { selectActiveTrackDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import useMapInstance from 'features/map/map-context.hooks'

type UserPanelProps = {
  dataview: UrlDataviewInstance
}

const SEE_MORE_LENGTH = 5

export function useUserLayerTrackResource(dataview: UrlDataviewInstance) {
  const dataset = getUserDataviewDataset(dataview)
  const allTracksActive = useSelector(selectActiveTrackDataviews)
  const { url: trackUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.UserTracks)
  const resource: Resource<FeatureCollection> = useSelector(
    selectResourceByUrl<FeatureCollection>(trackUrl)
  )

  const idProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'lineId',
  }) as string

  const hasRecordIds = idProperty
    ? resource?.data?.features?.some((f) => f.properties?.id !== NO_RECORD_ID)
    : false

  const singleTrack = allTracksActive.length === 1
  const featuresColoredByField = singleTrack && resource?.data && hasRecordIds

  return { resource, featuresColoredByField, hasRecordIds }
}

function UserLayerTrackPanel({ dataview }: UserPanelProps) {
  const { t } = useTranslation()
  const [seeMoreOpen, setSeeMoreOpen] = useState(false)
  const { cleanFeatureState, updateFeatureState } = useFeatureState(useMapInstance())

  const { resource, featuresColoredByField } = useUserLayerTrackResource(dataview)

  const onSeeMoreClick = useCallback(() => {
    setSeeMoreOpen(!seeMoreOpen)
  }, [seeMoreOpen])

  if (!featuresColoredByField || !resource?.data?.features) {
    return null
  }
  const dataset = getUserDataviewDataset(dataview)
  const lineIdProperty = getDatasetConfigurationProperty({
    dataset,
    property: 'lineId',
  }) as string
  const features = uniqBy(resource.data?.features, (f) => f.properties?.[lineIdProperty])

  const handleHoverLine = (feature: any) => {
    const id = feature.properties?.[lineIdProperty]
    const source = `user-track-${dataset.id}`
    if (source && id) {
      const featureState = {
        source,
        sourceLayer: DEFAULT_CONTEXT_SOURCE_LAYER,
        id,
      }
      updateFeatureState([featureState], 'highlight')
    }
  }

  return (
    <Fragment>
      {features.slice(0, seeMoreOpen ? undefined : SEE_MORE_LENGTH).map((feature, index) => {
        if (!feature.properties?.[lineIdProperty]) {
          return null
        }
        return (
          <div
            key={index}
            className={styles.trackColor}
            style={
              {
                '--color': feature.properties?.color,
              } as React.CSSProperties
            }
            onMouseEnter={() => handleHoverLine(feature)}
            onMouseLeave={() => cleanFeatureState('highlight')}
          >
            {feature.properties?.[lineIdProperty]}
          </div>
        )
      })}
      {resource.data?.features!?.length > SEE_MORE_LENGTH && (
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
