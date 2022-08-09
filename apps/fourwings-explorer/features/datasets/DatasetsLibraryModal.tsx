import { Fragment, useState } from 'react'
import { uniq } from 'lodash'
import cx from 'classnames'
import Image from 'next/image'
import { InputText, Modal, Spinner } from '@globalfishingwatch/ui-components'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { useDatasetLayers, useLayersConfig } from 'features/layers/layers.hooks'
import { getNextColor } from 'features/layers/layers.utils'
import { useModal } from 'features/modals/modals.hooks'
import { APIDataset, DatasetSource, useAPIDatasets } from 'features/datasets/datasets.hooks'
import styles from './DatasetsLibraryModal.module.css'

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
            {source}
          </li>
        )
      })}
    </ul>
  ) : null
}

const DatasetsLibraryItems = ({ datasets }: { datasets: APIDataset[] }) => {
  const { addLayer } = useLayersConfig()
  const layers = useDatasetLayers()
  const onLayerClick = (dataset) => {
    const colors = layers.flatMap((layer) => layer?.config?.color || [])
    addLayer({
      id: dataset.id,
      config: { visible: true, color: getNextColor('fill', colors)?.value },
    })
  }
  return datasets && datasets.length ? (
    <ul className={styles.datasetList}>
      {datasets.map((dataset) => {
        const disabled = layers.some((l) => l.id === dataset.id)
        return (
          <li
            key={dataset.id}
            className={cx(styles.dataset, { [styles.disabled]: disabled })}
            onClick={disabled ? undefined : () => onLayerClick(dataset)}
          >
            {dataset.image && <Image src={dataset.image}></Image>}
            {dataset.description}
          </li>
        )
      })}
    </ul>
  ) : null
}

const DatasetsLibraryContent = ({ datasets }: { datasets: APIDataset[] }) => {
  const [datasetSearch, setDatasetSearch] = useState('')
  const sources = uniq(datasets?.flatMap((d) => d.source || []))
  const [sourceSelected, setSourceSelected] = useState<DatasetSource>(sources[0])

  const filteredDatasets = datasets?.filter((d) => {
    const search = datasetSearch.toUpperCase()
    return (
      d.source === sourceSelected &&
      (d.id.toUpperCase().includes(search) || d.description.toUpperCase().includes(search))
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
  const datasets = useAPIDatasets()
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
      {datasets.isLoading ? <Spinner /> : <DatasetsLibraryContent datasets={datasets.data} />}
    </Modal>
  )
}

export default DatasetsLibraryModal
