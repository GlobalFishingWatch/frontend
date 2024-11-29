import { Fragment, useState } from 'react'
import { uniq } from 'lodash'
import cx from 'classnames'
import { Button, InputText, Modal, Spinner } from '@globalfishingwatch/ui-components'
import type { ColorRampId } from '@globalfishingwatch/layer-composer'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { useDatasetLayers, useLayersConfig } from 'features/layers/layers.hooks'
import { getNextColor } from 'features/layers/layers.utils'
import { useModal } from 'features/modals/modals.hooks'
import { useAPIDatasets } from 'features/datasets/datasets.hooks'
import type { DatasetSource, FourwingsAPIDataset } from 'features/datasets/datasets.types'
import styles from './DatasetsLibrary.module.css'

const CLEAN_SOURCE_NAMES = {
  GEE: 'Google Earth Engine',
  GFW: 'Global Fishing Watch',
}

const DatasetsLibrarySources = ({
  sources,
  sourceSelected,
  setSourceSelected,
}: {
  sources: DatasetSource[]
  sourceSelected: DatasetSource
  setSourceSelected: (source: DatasetSource) => void
}) => {
  return sources && sources.length ? (
    <ul className={styles.categoriesList}>
      {sources.map((source) => {
        return (
          <li
            className={cx(styles.category, { [styles.selected]: sourceSelected === source })}
            key={source}
            onClick={() => setSourceSelected(source)}
          >
            {CLEAN_SOURCE_NAMES[source] || source}
          </li>
        )
      })}
    </ul>
  ) : null
}

const DatasetsLibraryItems = ({ datasets }: { datasets: FourwingsAPIDataset[] }) => {
  const { addLayer } = useLayersConfig()
  const layers = useDatasetLayers()
  const [, setIsOpen] = useModal('datasetLibrary')
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
    <ul className={styles.datasetList}>
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

const DatasetsLibraryContent = ({ datasets }: { datasets: FourwingsAPIDataset[] }) => {
  const [datasetSearch, setDatasetSearch] = useState('')
  const sources = uniq(datasets?.flatMap((d) => d.source || [])).filter((s) => s !== 'LOCAL')
  const [sourceSelected, setSourceSelected] = useState<DatasetSource>(sources[0])

  const filteredDatasets = datasets?.filter((d) => {
    const search = datasetSearch.toUpperCase()
    return (
      d.source === sourceSelected &&
      (d.name.toUpperCase().includes(search) || d.description?.toUpperCase().includes(search))
    )
  })

  return (
    <Fragment>
      <div className={styles.sidebar}>
        <div className={styles.sidebar}>
          <InputText
            className={styles.search}
            type="search"
            placeholder="Search"
            value={datasetSearch}
            onChange={(e) => setDatasetSearch(e.target.value)}
          />
          <DatasetsLibrarySources
            sources={sources}
            sourceSelected={sourceSelected}
            setSourceSelected={setSourceSelected}
          />
        </div>
      </div>
      <div className={styles.content}>
        <DatasetsLibraryItems datasets={filteredDatasets} />
      </div>
    </Fragment>
  )
}

const DatasetsLibraryModal = () => {
  const [isOpen, setIsOpen] = useModal('datasetLibrary')
  const datasets = useAPIDatasets({ type: '4wings' })
  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={'Public dataset library'}
      isOpen={isOpen}
      shouldCloseOnEsc
      className={styles.modal}
      contentClassName={styles.container}
      onClose={() => setIsOpen(false)}
      fullScreen
    >
      {datasets.isLoading ? (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      ) : (
        <DatasetsLibraryContent datasets={datasets.data as FourwingsAPIDataset[]} />
      )}
    </Modal>
  )
}

export default DatasetsLibraryModal
