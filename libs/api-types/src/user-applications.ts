import { UserFetchResponse, UserPermission } from "./user"

type Narrowable = string | number | boolean | symbol | void | null | undefined
const tuple = <T extends Narrowable[]>(...args: T) => args

export const USER_APPLICATION_INTENDED_USES = tuple('commercial', 'non-commercial')
export type UserApplicationIntendedUse = typeof USER_APPLICATION_INTENDED_USES[number]

export interface UserApiAdditionalInformation {
  intendedUse?: UserApplicationIntendedUse
  whoEndUsers?: string
  problemToResolve?: string
  pullingDataOtherAPIS?: string
  apiTerms?: string
}
export interface UserApplication {
  id: number
  name: string
  description: string
  createdAt: string
  token: string
  userId: number
}

export interface UserApplicationFetchResponse extends UserFetchResponse {
  entries: UserApplication[]
}
