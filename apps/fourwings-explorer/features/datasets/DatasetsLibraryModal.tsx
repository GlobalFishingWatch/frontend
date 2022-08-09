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

const DatasetsLibraryCategories = ({ sources }: { sources: DatasetSource[] }) => {
  return sources && sources.length ? (
    <ul>
      {sources.map((category) => {
        return <li key={category}>{category}</li>
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
    <ul>
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

  const filteredDatasets = datasetSearch
    ? datasets?.filter((d) => {
        const search = datasetSearch.toUpperCase()
        return (
          d.id.toUpperCase().includes(search) ||
          d.description.toUpperCase().includes(search) ||
          d.source.toUpperCase().includes(search)
        )
      })
    : datasets
  const sources = uniq(filteredDatasets?.flatMap((d) => d.source || []))

  return (
    <Fragment>
      <div className={styles.sidebar}>
        <InputText value={datasetSearch} onChange={(e) => setDatasetSearch(e.target.value)} />
        <DatasetsLibraryCategories sources={sources} />
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
      contentClassName={styles.container}
      onClose={() => setIsOpen(false)}
    >
      {datasets.isLoading ? <Spinner /> : <DatasetsLibraryContent datasets={datasets.data} />}
    </Modal>
  )
}

export default DatasetsLibraryModal
