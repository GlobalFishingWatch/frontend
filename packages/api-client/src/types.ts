interface UserPermission {
  type: 'application' | 'dataset'
  value: 'map-client' | 'data-portal' | 'carrier-portal' | 'indonesia:*' | 'carriers:*' | 'public'
  action: string
}

export interface UserData {
  id: number
  email: string
  firstName: string
  lastName: string
  photo: string
  type: string
  permissions: [UserPermission]
}
