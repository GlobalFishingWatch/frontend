import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useCallback, useEffect, useState } from 'react'
import { Button, Icon } from '@globalfishingwatch/ui-components'
import { Dataset } from '@globalfishingwatch/api-types'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import { getDatasetSourceIcon, getDatasetTypeIcon } from 'features/datasets/datasets.utils'
import { fetchDatasetsByIdsThunk, selectDatasetById } from 'features/datasets/datasets.slice'
import { getHighlightedText } from 'features/layer-library/layer-library.utils'
import { LibraryLayer } from 'data/layer-library'
import styles from './LayerLibraryItem.module.css'

type LayerLibraryItemProps = { layer: LibraryLayer; highlightedText?: string }

const LayerLibraryItem = (props: LayerLibraryItemProps) => {
  const { layer, highlightedText = '' } = props
  const { id, dataviewId, config, previewImageUrl, dataview, name, description, datasetsConfig } =
    layer
  const dataset = useSelector(selectDatasetById(dataview.datasetsConfig?.[0].datasetId || ''))
  const ids = (datasetsConfig || []).map(({ datasetId }) => datasetId)
  const [loading, setLoading] = useState(false)
  const [datasetResolved, setDatasetResolved] = useState<Dataset>(dataset)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const datasetTypeIcon = datasetResolved && getDatasetTypeIcon(datasetResolved)
  const datasetSourceIcon = datasetResolved && getDatasetSourceIcon(datasetResolved)

  const resolveDataset = useCallback(async () => {
    const fetchDatasetsAction = await dispatch(fetchDatasetsByIdsThunk({ ids }))
    const { payload } = await fetchDatasetsAction
    if (payload) {
      setDatasetResolved((payload as Dataset[])?.[0])
    }
  }, [dispatch, ids])

  useEffect(() => {
    if (!datasetResolved) {
      resolveDataset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onAddToWorkspaceClick = async () => {
    if (datasetsConfig?.length) {
      setLoading(true)
      await dispatch(fetchDatasetsByIdsThunk({ ids }))
      setLoading(false)
    }
    upsertDataviewInstance({ id: `${id}-${Date.now()}`, dataviewId, config, datasetsConfig })
    dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
  }

  return (
    <li className={styles.layer}>
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
            {datasetSourceIcon && <Icon icon={datasetSourceIcon} type="original-colors" />}
            <Button className={styles.cta} loading={loading} onClick={onAddToWorkspaceClick}>
              {t('workspace.addLayer', 'Add to workspace')}
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default LayerLibraryItem
