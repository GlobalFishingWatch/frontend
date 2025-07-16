import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { IconButton, Switch } from '@globalfishingwatch/ui-components'

import { VESSEL_PROFILE_DATAVIEWS_INSTANCES } from 'data/default-workspaces/context-layers'
import { getDatasetLabel } from 'features/datasets/datasets.utils'
import { selectContextAreasDataviews } from 'features/dataviews/selectors/dataviews.categories.selectors'
import InfoModal from 'features/workspace/shared/InfoModal'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

import styles from './ReferenceLayersControl.module.css'

type ReferenceLayer = {
  id: string
  visible: boolean
  color?: string
  label: string
  dataview: UrlDataviewInstance
}

const ReferenceLayersControl = () => {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const contextAreasDataviews = useSelector(selectContextAreasDataviews)
  const [isOpen, setIsOpen] = useState(false)

  const layers = useMemo(
    () =>
      VESSEL_PROFILE_DATAVIEWS_INSTANCES.map((layer) => {
        const dataview = contextAreasDataviews.find((d) => d.id === layer.id)
        const dataset = dataview?.datasets?.find((d) => d.type === DatasetTypes.Context)
        const label = dataset ? getDatasetLabel(dataset) : layer.id
        return {
          id: layer.id,
          visible: dataview?.config?.visible ?? false,
          color: dataview?.config?.color,
          label,
          dataview,
        } as ReferenceLayer
      }),

    [contextAreasDataviews]
  )

  const updateAreaLayersVisibility = useCallback(
    (id: string, visible: boolean) => {
      const layer = VESSEL_PROFILE_DATAVIEWS_INSTANCES.find((d) => d.id === id)
      if (layer) {
        upsertDataviewInstance({
          ...layer,
          config: { visible },
        })
      }
    },
    [upsertDataviewInstance]
  )

  const toggleOpen = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen])

  if (!contextAreasDataviews) {
    return null
  }

  return (
    <div className={styles.container}>
      <IconButton
        type="map-tool"
        icon={isOpen ? 'close' : 'layers'}
        tooltip={isOpen ? t('map.referenceLayersClose') : t('map.referenceLayersOpen')}
        onClick={toggleOpen}
        className={cx({ [styles.active]: isOpen })}
      />
      {isOpen && (
        <div className={styles.layers}>
          {layers.map((layer) => (
            <div className={styles.layer} key={layer.id}>
              <Switch
                active={layer.visible}
                onClick={() => updateAreaLayersVisibility(layer.id, !layer.visible)}
                id={layer.id}
                color={layer.color}
                className={styles.switch}
              />
              <p className={styles.label}>{layer.label}</p>
              <InfoModal dataview={layer.dataview} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReferenceLayersControl
