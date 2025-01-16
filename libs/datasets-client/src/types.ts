import type { Dataview, DataviewInstance,DataviewType } from '@globalfishingwatch/api-types'

// Duplicated from resolve-datavies (dataviews-client lib) to avoid circular dependency
export type UrlDataviewInstance<T = DataviewType> = Omit<DataviewInstance<T>, 'dataviewId'> & {
  dataviewId?: Dataview['id'] | Dataview['slug'] // making this optional as sometimes we just need to reference the id
  deleted?: boolean // needed when you want to override from url an existing workspace config
}
