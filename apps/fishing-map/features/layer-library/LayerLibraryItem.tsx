import { useTranslation } from 'react-i18next'
import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Button, Icon } from '@globalfishingwatch/ui-components'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import { LibraryLayer } from 'data/library-layers'
import { getDatasetSourceIcon, getDatasetTypeIcon } from 'features/datasets/datasets.utils'
import { selectDatasetById } from 'features/datasets/datasets.slice'
import styles from './LayerLibraryItem.module.css'

type LayerLibraryItemProps = { layer: LibraryLayer; highlightedText?: string }

const getHighlightedText = (text: string, highlight: string) => {
  if (highlight === '') return text
  const regEscape = (v: string) => v.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  const textChunks = text.split(new RegExp(regEscape(highlight), 'ig'))
  let sliceIdx = 0
  return textChunks.map((chunk) => {
    const currentSliceIdx = sliceIdx + chunk.length
    sliceIdx += chunk.length + highlight.length
    return (
      <Fragment>
        {chunk}
        {currentSliceIdx < text.length && (
          <span className={styles.highlighted}>{text.slice(currentSliceIdx, sliceIdx)}</span>
        )}
      </Fragment>
    )
  })
}

const LayerLibraryItem = (props: LayerLibraryItemProps) => {
  const { layer, highlightedText = '' } = props
  const { id, dataviewId, config, previewImageUrl, name, description, dataview } = layer
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const dataset = useSelector(selectDatasetById(dataview?.datasetsConfig?.[0].datasetId || ''))
  const datasetTypeIcon = dataset && getDatasetTypeIcon(dataset)
  const datasetSourceIcon = dataset && getDatasetSourceIcon(dataset)

  const onAddToWorkspaceClick = () => {
    upsertDataviewInstance({ id: `${id}-${Date.now()}`, dataviewId, config })
    dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
  }

  return (
    <li className={styles.layer}>
      <div className={styles.container}>
        <div className={styles.image} style={{ backgroundImage: `url(${previewImageUrl})` }} />
        <div className={styles.content}>
          <h2 className={styles.title}>{getHighlightedText(name as string, highlightedText)}</h2>
          <p className={styles.description}>
            {getHighlightedText(description as string, highlightedText)}
          </p>
          <div className={styles.actions}>
            {datasetTypeIcon && <Icon icon={datasetTypeIcon} />}
            {datasetSourceIcon && <Icon icon={datasetSourceIcon} type="original-colors" />}
            <Button className={styles.cta} onClick={onAddToWorkspaceClick}>
              {t('workspace.addLayer', 'Add to workspace')}
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default LayerLibraryItem
