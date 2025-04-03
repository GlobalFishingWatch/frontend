export type User = {
  id: string
  email: string
  country?: string
  groups?: string[]
  organizationType?: string
  organization?: string
  language?: string
}

export type Dataset = {
  id: string
  name: string
  description: string
  downloadUrl: string
  metadata?: Record<string, unknown>
}

export type Report = {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  metadata?: Record<string, unknown>
}

export type LoginResponse = {
  user: User
  token: string
}

export type ApiError = {
  message: string
  code: string
  status: number
}
