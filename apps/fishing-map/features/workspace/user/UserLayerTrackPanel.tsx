import { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { FeatureCollection } from 'geojson'
import { useTranslation } from 'react-i18next'
import { NO_RECORD_ID } from '@globalfishingwatch/data-transforms'
import { DatasetTypes, Resource } from '@globalfishingwatch/api-types'
import {
  UrlDataviewInstance,
  resolveDataviewDatasetResource,
  selectResourceByUrl,
} from '@globalfishingwatch/dataviews-client'
import { getDatasetConfigurationProperty } from '@globalfishingwatch/datasets-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { selectActiveTrackDataviews } from 'features/dataviews/dataviews.slice'
import { getUserDataviewDataset } from './UserLayerPanel'

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
    property: 'idProperty',
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

  const { resource, featuresColoredByField } = useUserLayerTrackResource(dataview)

  const onSeeMoreClick = useCallback(() => {
    setSeeMoreOpen(!seeMoreOpen)
  }, [seeMoreOpen])

  if (!featuresColoredByField || !resource?.data?.features) {
    return null
  }
  return (
    <Fragment>
      {resource.data?.features
        .slice(0, seeMoreOpen ? undefined : SEE_MORE_LENGTH)
        .map((feature, index) => {
          return (
            <div
              key={index}
              className={styles.trackColor}
              style={
                {
                  '--color': feature.properties?.color,
                } as React.CSSProperties
              }
            >
              {feature.properties?.id}
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
