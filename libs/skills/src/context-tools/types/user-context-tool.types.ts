/** Every page: get_user_resources */

/** public: anyone with the link. password: link + password (workspaces). private: the user only */
export type AssistantResourceVisibility = 'public' | 'private' | 'password'

/** Most recent first: `total` counts all, `items` holds the first ones */
export type AssistantResourceList<T> = { total: number; items: T[] }

export type AssistantUserResources = {
  /** User groups (info tab of the user page) */
  groups?: string[]
  /** Groups the user belongs to that do not grant access to their datasets yet */
  groupsWithoutDatasetPermission?: string[]
  workspaces: AssistantResourceList<{
    id: string
    name: string
    category?: string
    visibility: AssistantResourceVisibility
  }>
  datasets: AssistantResourceList<{
    id: string
    name: string
    category?: string
    type: string
    visibility: AssistantResourceVisibility
  }>
  vesselGroups: AssistantResourceList<{
    id: string
    name: string
    vessels?: number
    visibility: AssistantResourceVisibility
  }>
  reports: AssistantResourceList<{
    id: string
    name: string
    areaId?: string | number
    datasetId?: string
    visibility: AssistantResourceVisibility
  }>
}
