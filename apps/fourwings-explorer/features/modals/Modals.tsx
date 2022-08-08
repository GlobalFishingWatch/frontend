import { Fragment } from 'react'
import DatasetsLibraryModal from 'features/datasets/DatasetsLibraryModal'
import NewDatasetModal from 'features/datasets/NewDatasetModal'

function Modals() {
  return (
    <Fragment>
      <DatasetsLibraryModal />
      <NewDatasetModal />
    </Fragment>
  )
}

export default Modals
