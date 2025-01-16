// checkExistPermissionInList
import { useSelector } from 'react-redux'
import { checkExistPermissionInList } from 'auth-middleware/src/utils'

import type { UserData } from '@globalfishingwatch/api-types'

import { LABELER_LOAD_PERMISSION } from '../../data/constants'
import type { Project} from '../../data/projects';
import { PROJECTS } from '../../data/projects'
import { selectProject } from '../../routes/routes.selectors'

import { selectUserData, selectUserLogged } from './user.slice'

export interface UserHookType {
  user: UserData | null
  logged: boolean
  allowedAppAccess: boolean
  allowedProjectAccess: boolean
  projects: { id: string; name: string }[]
}

export const useUser = (): UserHookType => {
  const project = useSelector(selectProject)
  const user = useSelector(selectUserData)
  const logged = useSelector(selectUserLogged)

  const allowedAppAccess =
    user && checkExistPermissionInList(user?.permissions, LABELER_LOAD_PERMISSION)
  const allowedProjectAccess =
    user && project && checkExistPermissionInList(user?.permissions, project?.permission)

  const projects =
    (user &&
      Object.keys(PROJECTS)
        .map((projectId) => ({ project: PROJECTS[projectId] as Project, id: projectId }))
        .filter((p) => checkExistPermissionInList(user?.permissions, p.project?.permission))
        .map(({ project: p, id }) => ({ name: p['name'] ?? '', id: id }))) ??
    []

  return {
    user,
    logged,
    allowedAppAccess,
    allowedProjectAccess,
    projects,
  }
}
