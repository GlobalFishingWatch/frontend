import {
  WORKSPACE_PASSWORD_ACCESS,
  WORKSPACE_PRIVATE_ACCESS,
  WORKSPACE_PUBLIC_ACCESS,
  WorkspaceEditAccessType,
  WorkspaceViewAccessType,
} from '@globalfishingwatch/api-types'
import { SelectOption } from '@globalfishingwatch/ui-components'
import { t } from 'features/i18n/i18n'

export function getViewAccessOptions(): SelectOption<WorkspaceViewAccessType>[] {
  return [
    { id: WORKSPACE_PUBLIC_ACCESS, label: t('common.public', 'Public') },
    { id: WORKSPACE_PASSWORD_ACCESS, label: t('common.password', 'Password') },
    { id: WORKSPACE_PRIVATE_ACCESS, label: t('common.private', 'Private') },
  ]
}

export function getEditAccessOptions(): SelectOption<WorkspaceEditAccessType>[] {
  return [
    { id: WORKSPACE_PRIVATE_ACCESS, label: t('common.private', 'Private') },
    { id: WORKSPACE_PASSWORD_ACCESS, label: t('common.password', 'Password') },
  ]
}

export function getEditAccessOptionsByViewAccess(
  viewAccess: WorkspaceViewAccessType
): SelectOption<WorkspaceEditAccessType>[] {
  if (viewAccess === WORKSPACE_PRIVATE_ACCESS) {
    return []
  }
  return getEditAccessOptions()
}
