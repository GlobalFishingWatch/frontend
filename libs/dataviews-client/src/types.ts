import type { DataviewInstance } from '@globalfishingwatch/api-types'

export type UrlDataviewInstance<T = any> = Omit<DataviewInstance<T>, 'dataviewId'> & {
  dataviewId?: string | number // making this optional as sometimes we just need to reference the id
  deleted?: boolean // needed when you want to override from url an existing workspace config
}

export type AnyDataviewInstance = DataviewInstance | UrlDataviewInstance
