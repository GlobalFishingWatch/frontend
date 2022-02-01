import { ActionType } from 'typesafe-actions'
import AppActions from './app/app.actions'
import UserActions from './user/user.actions'
import RouterActions from './router/router.actions'
import TrackActions from './tracks/tracks.actions'
import EventsActions from './events/events.actions'
import VesselActions from './vessel/vessel.actions'

export type AppActions = ActionType<typeof AppActions>
export type UserActions = ActionType<typeof UserActions>
export type RouterActions = ActionType<typeof RouterActions>
export type TrackActions = ActionType<typeof TrackActions>
export type EventsActions = ActionType<typeof EventsActions>
export type VesselActions = ActionType<typeof VesselActions>

const actions = {
  app: AppActions,
  user: UserActions,
  router: RouterActions,
  tracks: TrackActions,
  events: EventsActions,
  vessel: VesselActions,
}

export default actions
