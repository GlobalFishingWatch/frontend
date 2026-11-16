import type { ClientEnv } from 'data/env'
import { clientEnv } from 'data/env'

export type WorkspaceEnv = NonNullable<ClientEnv['VITE_WORKSPACE_ENV']>

export const WORKSPACE_ENV =
  clientEnv.VITE_WORKSPACE_ENV || (import.meta.env.MODE as WorkspaceEnv) || 'production'

export function getWorkspaceEnv(): WorkspaceEnv {
  return WORKSPACE_ENV
}
