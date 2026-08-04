export type WorkspaceEnv = 'development' | 'staging' | 'production'

export const WORKSPACE_ENV =
  (import.meta.env.VITE_WORKSPACE_ENV as WorkspaceEnv) ||
  (import.meta.env.MODE as WorkspaceEnv) ||
  'production'

export function getWorkspaceEnv(): WorkspaceEnv {
  return WORKSPACE_ENV
}
