// checkExistPermissionInList
import { checkExistPermissionInList } from 'auth-middleware/src/utils'
import { useSelector } from 'react-redux'
import { UserData } from '@globalfishingwatch/api-types'
import { LABELER_LOAD_PERMISSION } from '../../data/constants'
import { selectProject } from '../../routes/routes.selectors'
import { Project, PROJECTS } from '../../data/projects'
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
