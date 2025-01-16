import { connect } from 'react-redux'
import type { Dispatch } from 'redux'

import type { AppState } from '../../types/redux.types'

import Main from './Main'

const mainStateToProps = (state: AppState) => ({})

const mainDispatchToProps = (dispatch: Dispatch) => ({})

export default connect(mainStateToProps, mainDispatchToProps)(Main)
