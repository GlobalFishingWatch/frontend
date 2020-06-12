import { IconComponents } from './Icon'

export { default } from './Icon'

// Needed to do it also here to use in CRA sandbox
// duplicated of Icon.tsx declaration
export type IconType = keyof typeof IconComponents
