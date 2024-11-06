import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { AppState } from '../../types/redux.types'
import Main from './Main'

const mainStateToProps = (state: AppState) => ({})

const mainDispatchToProps = (dispatch: Dispatch) => ({})

export default connect(mainStateToProps, mainDispatchToProps)(Main)
