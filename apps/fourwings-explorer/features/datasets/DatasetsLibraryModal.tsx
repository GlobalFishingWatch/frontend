import { useState } from 'react'
import { uniq } from 'lodash'
import cx from 'classnames'
import Image from 'next/image'
import { InputText, Modal } from '@globalfishingwatch/ui-components'
import libraryDatasets, {
  LibraryDataset,
  LibraryDatasetCategory,
} from 'features/datasets/data/library'
import { ROOT_DOM_ELEMENT } from 'data/config'
import { useDatasetsLibraryModal } from 'features/datasets/datasets-library.hoooks'
import { useDatasetLayers, useMapLayersConfig } from 'features/layers/layers.hooks'
import styles from './DatasetsLibraryModal.module.css'

const DatasetsLibraryCategories = ({ categories }: { categories: LibraryDatasetCategory[] }) => {
  return categories && categories.length ? (
    <ul>
      {categories.map((category) => {
        return <li key={category}>{category}</li>
      })}
    </ul>
  ) : null
}

const DatasetsLibraryItems = ({ datasets }: { datasets: LibraryDataset[] }) => {
  const { addMapLayer } = useMapLayersConfig()
  const layers = useDatasetLayers()
  const onLayerClick = (dataset) => {
    addMapLayer({ id: dataset.id, config: { visible: true } })
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
            {dataset.label}
          </li>
        )
      })}
    </ul>
  ) : null
}

const DatasetsLibraryModal = () => {
  const [datasetSearch, setDatasetSearch] = useState('')
  const [isOpen, setIsOpen] = useDatasetsLibraryModal()

  const filteredDatasets = datasetSearch
    ? libraryDatasets.filter((d) => {
        const search = datasetSearch.toUpperCase()
        return (
          d.id.toUpperCase().includes(search) ||
          d.label.toUpperCase().includes(search) ||
          d.category.toUpperCase().includes(search)
        )
      })
    : libraryDatasets
  const categories = uniq(filteredDatasets.flatMap((d) => d.category || []))

  return (
    <Modal
      appSelector={ROOT_DOM_ELEMENT}
      title={'Public dataset library'}
      isOpen={isOpen}
      shouldCloseOnEsc
      contentClassName={styles.container}
      onClose={() => setIsOpen(false)}
    >
      <div className={styles.sidebar}>
        <InputText value={datasetSearch} onChange={(e) => setDatasetSearch(e.target.value)} />
        <DatasetsLibraryCategories categories={categories} />
      </div>
      <div className={styles.content}>
        <DatasetsLibraryItems datasets={filteredDatasets} />
      </div>
    </Modal>
  )
}

export default DatasetsLibraryModal
