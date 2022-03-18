export type UserApplicationIntendedUse = 'commercial' | 'non-commercial'
export interface UserApplication {
  id: number
  name: string
  description: string
  intendedUse: UserApplicationIntendedUse
  termAcceptedAt: string
  createdAt: string
  token: string
  userId: number
}
