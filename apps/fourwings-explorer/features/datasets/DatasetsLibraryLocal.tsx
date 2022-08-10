import cx from 'classnames'
import Image from 'next/image'
import { Button } from '@globalfishingwatch/ui-components'
import { ColorRampId } from '@globalfishingwatch/layer-composer'
import { useDatasetLayers, useLayersConfig } from 'features/layers/layers.hooks'
import { getNextColor } from 'features/layers/layers.utils'
import { APIDataset } from 'features/datasets/datasets.types'
import styles from './DatasetsLibrary.module.css'

const LocalDatasetsLibrary = ({ datasets }: { datasets: APIDataset[] }) => {
  const { addLayer } = useLayersConfig()
  const layers = useDatasetLayers()
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
  }
  return datasets && datasets.length ? (
    <ul className={styles.dataset}>
      {datasets.map((dataset) => {
        const disabled = layers.some((l) => l.id === dataset.id)
        return (
          <li key={dataset.id} className={cx(styles.dataset, { [styles.disabled]: disabled })}>
            {dataset.image && <Image src={dataset.image}></Image>}
            <h3 className={styles.name}>{dataset.name}</h3>
            <p className={styles.description}>{dataset.description}</p>
            <Button
              size="small"
              disabled={disabled}
              onClick={disabled ? undefined : () => onLayerClick(dataset)}
              type="secondary"
            >
              Add to map
            </Button>
          </li>
        )
      })}
    </ul>
  ) : null
}

export default LocalDatasetsLibrary
