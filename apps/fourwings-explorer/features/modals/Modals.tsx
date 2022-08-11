import { Fragment } from 'react'
import DatasetsLibraryModal from 'features/datasets/DatasetsLibraryModal'
import NewFourwingsDatasetModal from 'features/datasets/NewFourwingsDatasetModal'
import NewContextDatasetModal from 'features/datasets/NewContextDatasetModal'

function Modals() {
  return (
    <Fragment>
      <DatasetsLibraryModal />
      <NewFourwingsDatasetModal />
      <NewContextDatasetModal />
    </Fragment>
  )
}

export default Modals
