import {
  WORKSPACE_PASSWORD_ACCESS,
  WORKSPACE_PRIVATE_ACCESS,
  WORKSPACE_PUBLIC_ACCESS,
  WorkspaceEditAccessType,
  WorkspaceViewAccessType,
} from '@globalfishingwatch/api-types'
import { SelectOption } from '@globalfishingwatch/ui-components'
import { t } from 'features/i18n/i18n'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { pickDateFormatByRange } from 'features/map/controls/MapInfo'

export const formatTimerangeBoundary = (
  boundary: string | undefined,
  dateFormat: Intl.DateTimeFormatOptions
) => {
  if (!boundary) return ''
  return formatI18nDate(boundary, {
    format: dateFormat,
  }).replace(/[.,]/g, '')
}

export function getViewAccessOptions(): SelectOption<WorkspaceViewAccessType>[] {
  return [
    { id: WORKSPACE_PUBLIC_ACCESS, label: t('common.anyoneWithTheLink', 'Anyone with the link') },
    {
      id: WORKSPACE_PASSWORD_ACCESS,
      label: t('common.anyoneWithThePassword', 'Anyone with the password'),
    },
    { id: WORKSPACE_PRIVATE_ACCESS, label: t('common.onlyMe', 'Only me') },
  ]
}
export function getTimeRangeOptions(start: string, end: string) {
  const dateFormat = pickDateFormatByRange(start, end)
  return [
    {
      id: 'static',
      label: t('common.timerangeStatic', {
        defaultValue: 'Static: from {{start}} to {{end}}',
        start: formatTimerangeBoundary(start, dateFormat),
        end: formatTimerangeBoundary(end, dateFormat),
      }),
    },
    {
      id: 'dynamic',
      label: t('common.timerangeDynamic', 'Dynamic'),
    },
  ]
}

export function getEditAccessOptions(): SelectOption<WorkspaceEditAccessType>[] {
  return [
    { id: WORKSPACE_PRIVATE_ACCESS, label: t('common.onlyMe', 'Only me') },
    {
      id: WORKSPACE_PASSWORD_ACCESS,
      label: t('common.anyoneWithThePassword', 'Anyone with the password'),
    },
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
