import type { AssistantContextToolOutput } from '@globalfishingwatch/skills/context-tools'

import { selectCurrentWorkspacesList } from 'features/_map/workspaces-list/workspaces-list.selectors'
import { selectWorkspaceListStatus } from 'features/_map/workspaces-list/workspaces-list.slice'
import type {
  AssistantContextDeps,
  AssistantContextModule,
} from 'features/assistant/assistant-context'
import { selectLocationCategory } from 'router/routes.selectors'
import type { RootState } from 'store'

/** /map/$category: the workspaces the list shows. The map tools of the map layout come with it */
function getWorkspacesList({
  reduxStore,
}: AssistantContextDeps): AssistantContextToolOutput<'get_workspaces_list'> {
  const state = reduxStore.getState() as RootState
  return {
    category: selectLocationCategory(state),
    status: selectWorkspaceListStatus(state),
    workspaces: selectCurrentWorkspacesList(state)
      ?.filter((workspace) => workspace.visible !== false)
      .map(({ id, name, description, category }) => ({ id, name, description, category })),
  }
}

export const tools: AssistantContextModule['tools'] = { get_workspaces_list: getWorkspacesList }
