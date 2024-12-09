import cx from 'classnames'
import { Button, IconButton } from '@globalfishingwatch/ui-components'
import type { ColorRampId } from '@globalfishingwatch/layer-composer'
import { useDatasetLayers, useLayersConfig } from 'features/layers/layers.hooks'
import { getNextColor } from 'features/layers/layers.utils'
import type { APIDataset } from 'features/datasets/datasets.types'
import { useModal } from 'features/modals/modals.hooks'
import { useDeleleAPIDataset } from 'features/datasets/datasets.hooks'
import styles from './DatasetsLibrary.module.css'

const LocalDatasetsLibrary = ({ datasets }: { datasets: APIDataset[] }) => {
  const { addLayer } = useLayersConfig()
  const layers = useDatasetLayers()
  const deleteDataset = useDeleleAPIDataset()
  const [, setIsOpen] = useModal('newContextDataset')

  const onRemoveClick = (dataset) => {
    deleteDataset.mutate(dataset.id)
  }

  const onLayerClick = (dataset) => {
    const colors = layers.flatMap((layer) => layer?.config?.color || [])
    addLayer({
      id: dataset.id,
      config: {
        visible: true,
        color: getNextColor('fill', colors)?.value,
        colorRamp: getNextColor('fill', colors)?.id as ColorRampId,
      },
    })
    setIsOpen(false)
  }
  return datasets && datasets.length ? (
    <div className={styles.column}>
      <label>Your datasets</label>
      <ul>
        {datasets.map((dataset) => {
          const disabled = layers.some((l) => l.id === dataset.id)
          return (
            <li key={dataset.id} className={cx(styles.dataset, { [styles.disabled]: disabled })}>
              {dataset.image && (
                <img
                  alt={`dataset ${dataset.name}`}
                  className={styles.image}
                  src={dataset.image.src}
                ></img>
              )}
              <h3 className={styles.name}>{dataset.name}</h3>
              {dataset.description && <p className={styles.description}>{dataset.description}</p>}
              <div className={styles.buttons}>
                <IconButton
                  size="small"
                  icon="delete"
                  loading={deleteDataset.isLoading}
                  disabled={disabled}
                  onClick={disabled ? undefined : () => onRemoveClick(dataset)}
                  tooltip="Remove dataset"
                />
                <Button
                  size="small"
                  disabled={disabled}
                  onClick={disabled ? undefined : () => onLayerClick(dataset)}
                  type="secondary"
                >
                  Add to map
                </Button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  ) : null
}

export default LocalDatasetsLibrary
