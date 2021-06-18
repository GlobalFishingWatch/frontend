export interface UserPermission {
  type: 'application' | 'dataset'
  value:
    | 'map-client'
    | 'data-portal'
    | 'carrier-portal'
    | 'fishing-map'
    | 'indonesia:*'
    | 'carriers:*'
    | 'public'
  action: string
}

export interface UserData {
  id: number
  type: string
  groups: string[]
  permissions: UserPermission[]
  email?: string
  firstName?: string
  lastName?: string
  photo?: string
  language?: string
  country?: string
  organization?: string
  organizationType?: string
}
