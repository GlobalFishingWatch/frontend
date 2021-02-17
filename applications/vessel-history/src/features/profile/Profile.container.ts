import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { AppState } from 'types/redux.types'
import Profile from './Profile'

const mainStateToProps = (state: AppState) => ({})

const mainDispatchToProps = (dispatch: Dispatch) => ({})

export default connect(mainStateToProps, mainDispatchToProps)(Profile)
