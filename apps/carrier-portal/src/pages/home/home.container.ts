import { connect, batch } from 'react-redux'
import { Dispatch } from 'redux'
import { AppState } from 'types/redux.types'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import { getDatasetLoaded, getDatasetError } from 'redux-modules/app/app.selectors'
import { hasVesselSelected } from 'redux-modules/router/route.selectors'
import { NOT_FOUND_ERROR } from 'data/constants'
import { DATASET_ID } from 'data/api'
import { fetchDatasetError, setSidebarSize } from 'redux-modules/app/app.actions'
import Home from './home'

const mapStateToProps = (state: AppState) => ({
  datasetLoaded: getDatasetLoaded(state),
  datasetNotFound: getDatasetError(state) === NOT_FOUND_ERROR,
  hasVessel: hasVesselSelected(state),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setLatestDataset: () => {
    batch(() => {
      dispatch(updateQueryParams({ dataset: DATASET_ID }))
      dispatch(fetchDatasetError({ error: '' }))
    })
  },
  setSidebarSize: (size: number) => {
    dispatch(setSidebarSize(size))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
