import { connect } from 'react-redux'
import { Dispatch } from 'react'
import { AppState, AppActions } from 'types/redux.types'
import { getSearchFields } from 'redux-modules/router/route.selectors'
import { updateQueryParams } from 'redux-modules/router/router.actions'
import { SearchItemType } from 'types/app.types'
import { parseSearchFieldsToQuery } from 'utils'
import { getStaticOptionsFilteredByDate } from './search.selectors'
import Search from './search.wrapper'

const mapStateToProps = (state: AppState) => ({
  staticOptions: getStaticOptionsFilteredByDate(state),
  selectedItems: getSearchFields(state),
  searchUrl: `/vessels?query={{searchQuery}}&querySuggestions=true&offset=0`,
})

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
  onChange: (searchFields: SearchItemType[]) => {
    const query = parseSearchFieldsToQuery(searchFields)
    dispatch(updateQueryParams(query))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)
