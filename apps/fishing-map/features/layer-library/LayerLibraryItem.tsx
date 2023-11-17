import { useTranslation } from 'react-i18next'
import { Fragment } from 'react'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { Button } from '@globalfishingwatch/ui-components'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useAppDispatch } from 'features/app/app.hooks'
import { setModalOpen } from 'features/modals/modals.slice'
import styles from './LayerLibrary.module.css'

export type LayerResolved = {
  name: string
  description: string
  category: DataviewCategory
  datasetId: string
  dataviewSlug: string
  previewImageUrl: string
}
type LayerLibraryItemProps = { layer: LayerResolved; highlightedText?: string }

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
  const { previewImageUrl, name, description } = layer
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const onAddToWorkspaceClick = () => {
    upsertDataviewInstance({ id: 'TODO', dataviewId: layer.dataviewSlug })
    dispatch(setModalOpen({ id: 'layerLibrary', open: false }))
  }

  return (
    <li className={styles.layer}>
      <div className={styles.layerContainer}>
        <div className={styles.layerImage} style={{ backgroundImage: `url(${previewImageUrl})` }} />
        <div className={styles.layerContent}>
          <h2 className={styles.layerTitle}>{getHighlightedText(name, highlightedText)}</h2>
          <p className={styles.layerDescription}>
            {getHighlightedText(description, highlightedText)}
          </p>
          <div className={styles.layerActions}>
            <Button onClick={onAddToWorkspaceClick}>
              {t('workspace.addLayer', 'Add to workspace')}
            </Button>
          </div>
        </div>
      </div>
    </li>
  )
}

export default LayerLibraryItem
