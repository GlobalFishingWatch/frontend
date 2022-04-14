import { createContext } from 'react'

export type ImmediateContextProps = {
  immediate: boolean
  toggleImmediate: () => void
}
export const ImmediateContext = createContext<ImmediateContextProps>({
  immediate: false,
  toggleImmediate: () => {},
})
export default ImmediateContext
