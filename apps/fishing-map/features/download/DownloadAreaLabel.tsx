import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { saveAs } from 'file-saver'
import type { FeatureCollection } from 'geojson'

import { IconButton, Spinner, Tag } from '@globalfishingwatch/ui-components'

import {
  selectDownloadActivityArea,
  selectIsDownloadActivityAreaLoading,
} from 'features/download/download.selectors'
import { getFileFromGeojson } from 'utils/files'
import { htmlSafeParse } from 'utils/html-parser'
import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

import styles from './DownloadModal.module.css'

export const DownloadAreaLabel = ({ name }: { name?: string }) => {
  const { t } = useTranslation()
  const area = useSelector(selectDownloadActivityArea)
  const isDownloadAreaLoading = useSelector(selectIsDownloadActivityAreaLoading)

  const onDownloadGeoJSON = useCallback(() => {
    if (!area?.data?.geometry) return
    const featureCollection: FeatureCollection = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: area.data.geometry,
          properties: area.data.properties,
        },
      ],
    }
    const file = getFileFromGeojson(featureCollection)
    if (file) {
      saveAs(file, `${name}.json`)
    }
  }, [area?.data?.geometry, name])

  if (!name) return null

  const parsedLabel = htmlSafeParse(name)

  return (
    <Tag testId="area-name">
      <div className={styles.downloadAreaLabelContainer}>
        {parsedLabel || EMPTY_FIELD_PLACEHOLDER}
        {isDownloadAreaLoading ? (
          <Spinner size="tiny" />
        ) : (
          <IconButton
            icon="download"
            type="default"
            size="tiny"
            tooltip={t((t) => t.download.downloadAreaLabel)}
            onClick={onDownloadGeoJSON}
            disabled={!area?.data?.geometry}
          />
        )}
      </div>
    </Tag>
  )
}
