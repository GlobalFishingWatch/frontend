import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { uniq } from 'es-toolkit'

import type { Dataview } from '@globalfishingwatch/api-types'
import { DataviewType } from '@globalfishingwatch/api-types'
import { Button, Icon, Tooltip } from '@globalfishingwatch/ui-components'

import { LAYER_LIBRARY_ID_SEPARATOR } from 'data/config'
import type { LibraryLayer } from 'data/layer-library'
import { LAYER_LIBRARY_EVENTS_IDS } from 'data/layer-library/layers-events'
import { useAppDispatch } from 'features/app/app.hooks'
import { fetchDatasetsByIdsThunk, selectDatasetById } from 'features/datasets/datasets.slice'
import {
  getDatasetsInDataviews,
  getDatasetSourceIcon,
  getDatasetTypeIcon,
} from 'features/datasets/datasets.utils'
import { fetchDataviewsByIdsThunk, selectAllDataviews } from 'features/dataviews/dataviews.slice'
import { selectDataviewInstancesResolvedVisible } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { setModalOpen } from 'features/modals/modals.slice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { setWorkspaceSuggestSave } from 'features/workspace/workspace.slice'
import { getNextColor } from 'features/workspace/workspace.utils'
import { getHighlightedText } from 'utils/text'

import styles from './LayerLibraryItem.module.css'

type LayerLibraryItemProps = { layer: LibraryLayer; highlightedText?: string }

const FILL_DATAVIEWS = [DataviewType.Heatmap, DataviewType.HeatmapAnimated]

const LayerLibraryItem = (props: LayerLibraryItemProps) => {
  const { layer, highlightedText = '' } = props
  const {
    id,
    category,
    dataviewId,
    config,
    previewImageUrl,
    dataview,
    name,
    description,
    moreInfoLink,
    datasetsConfig,
  } = layer
  const [loading, setLoading] = useState(false)
  const dataviews = useSelector(selectDataviewInstancesResolvedVisible)
  const datasetId = dataview.datasetsConfig?.[0].datasetId || ''
  const dataset = useSelector(selectDatasetById(datasetId))
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const datasetTypeIcon = getDatasetTypeIcon(dataset)
  const datasetSourceIcon = getDatasetSourceIcon(dataset)
  const allDataviews = useSelector(selectAllDataviews)

  const onAddToWorkspaceClick = async () => {
    const usedColors = uniq(dataviews.flatMap((dataview) => dataview.config?.color || []))
    const isDefaultColorUnused = !usedColors.includes(config?.color as string)
    const firstUnusedColor = getNextColor(
      FILL_DATAVIEWS.includes(dataview.config?.type) ? 'fill' : 'line',
      usedColors
    )
    const supportsColorChange = !LAYER_LIBRARY_EVENTS_IDS.includes(id)
    const apiDataview = allDataviews.find((d) => d.id === dataviewId)
    if (!apiDataview) {
      setLoading(true)
      const action = dispatch(fetchDataviewsByIdsThunk([dataviewId]))
      const resolvedAction = await action
      if (fetchDataviewsByIdsThunk.fulfilled.match(resolvedAction)) {
        const dataviews = resolvedAction.payload as Dataview[]
        const datasets = getDatasetsInDataviews(dataviews)
        await dispatch(fetchDatasetsByIdsThunk({ ids: datasets }))
      }
      setLoading(false)
    }
    upsertDataviewInstance({
      id: `${id}${LAYER_LIBRARY_ID_SEPARATOR}${Date.now()}`,
      category,
      dataviewId,
      datasetsConfig,
      config: {
        ...config,
        ...(supportsColorChange && {
          color: isDefaultColorUnused ? config?.color : firstUnusedColor?.value,
          colorRamp: isDefaultColorUnused ? config?.colorRamp : firstUnusedColor?.id,
        }),
      },
    })
    dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
    dispatch(setWorkspaceSuggestSave(true))
  }

  return (
    <li className={styles.layer} key={id}>
      <div className={styles.container}>
        <div className={styles.image} style={{ backgroundImage: `url(${previewImageUrl})` }} />
        <div className={styles.content}>
          <h2 className={styles.title}>
            {getHighlightedText(name as string, highlightedText, styles)}
          </h2>
          <p className={styles.description}>
            {getHighlightedText(description as string, highlightedText, styles)}
          </p>
          <div className={styles.actions}>
            {datasetTypeIcon && <Icon icon={datasetTypeIcon} />}
            {datasetSourceIcon ? (
              moreInfoLink ? (
                <Tooltip content={t('common.seeMore', 'See more')}>
                  <a href={moreInfoLink} target="_blank" rel="noreferrer" style={{ lineHeight: 1 }}>
                    <Icon icon={datasetSourceIcon} type="original-colors" />
                  </a>
                </Tooltip>
              ) : (
                <Icon icon={datasetSourceIcon} type="original-colors" />
              )
            ) : null}
            <Button className={styles.cta} onClick={onAddToWorkspaceClick} loading={loading}>
              {t('workspace.addLayer', 'Add to workspace')}
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default LayerLibraryItem
