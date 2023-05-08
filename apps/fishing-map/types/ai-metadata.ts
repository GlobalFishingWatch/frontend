export interface AiMetadata {
  entities?: Entities
  intents?: Intent[]
  text?: string
  traits?: Traits
}

export interface Entities {
  [key: string]: Entity[] | DateEntity[]
}

export interface Entity {
  body?: string
  confidence?: number
  end?: number
  entities?: Traits
  id?: string
  name?: string
  role?: string
  start?: number
  type?: string
  value?: string
  grain?: string
  values?: Value[]
}

export interface DateEntity {
  body?: string
  confidence?: number
  end?: number
  entities?: Traits
  id?: string
  name?: string
  role?: string
  start?: number
  type?: string
  value?: string
  grain?: string
  values?: Value[]
  from?: {
    grain: string
    value: string
  }
  to?: {
    grain: string
    value: string
  }
}

export interface Traits {}

export interface Value {
  grain: string
  type: string
  value: any
}

export interface Intent {
  confidence: number
  id: string
  name: string
}
