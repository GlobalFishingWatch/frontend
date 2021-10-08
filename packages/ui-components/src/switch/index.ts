import { MouseEvent } from 'react'
export { default, SwitchProps } from './Switch'

// TODO Maybe a simple way is to have the Switch component wrap an <input type="checkbox"> so that we can use the React native event
export interface SwitchEvent extends MouseEvent {
  active: boolean
}
