import type {
  WorkspaceEditAccessType,
  WorkspaceViewAccessType,
} from '@globalfishingwatch/api-types'
import {
  WORKSPACE_PASSWORD_ACCESS,
  WORKSPACE_PRIVATE_ACCESS,
  WORKSPACE_PUBLIC_ACCESS,
} from '@globalfishingwatch/api-types'
import type { SelectOption } from '@globalfishingwatch/ui-components'

import { t } from 'features/i18n/i18n'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { pickDateFormatByRange } from 'features/map/controls/TimeRangeDates'

export const DAYS_FROM_LATEST_MIN = 1
export const DAYS_FROM_LATEST_MAX = 100

export function isValidDaysFromLatest(daysFromLatest: number | undefined) {
  return (
    daysFromLatest !== undefined &&
    daysFromLatest >= DAYS_FROM_LATEST_MIN &&
    daysFromLatest <= DAYS_FROM_LATEST_MAX
  )
}

const formatTimerangeBoundary = (
  boundary: string | undefined,
  dateFormat: Intl.DateTimeFormatOptions
) => {
  if (!boundary) return ''
  return formatI18nDate(boundary, {
    format: dateFormat,
  }).replace(/[.,]/g, '')
}

export function getViewAccessOptions(
  containsPrivateDatasets = false
): SelectOption<WorkspaceViewAccessType>[] {
  const permissionsLabel = containsPrivateDatasets
    ? `(${t('common.permissions', 'permissions required')})`
    : ''
  return [
    {
      id: WORKSPACE_PUBLIC_ACCESS,
      label: `${t('common.anyoneWithTheLink', 'Anyone with the link')} ${permissionsLabel}`,
    },
    {
      id: WORKSPACE_PASSWORD_ACCESS,
      label: `${t('common.anyoneWithThePassword', 'Anyone with the password')} ${permissionsLabel}`,
    },
    { id: WORKSPACE_PRIVATE_ACCESS, label: t('common.onlyMe', 'Only me') },
  ]
}

export type WorkspaceTimeRangeMode = 'static' | 'dynamic'
export function getTimeRangeOptions(
  start: string,
  end: string
): SelectOption<WorkspaceTimeRangeMode>[] {
  const dateFormat = pickDateFormatByRange(start, end)
  return [
    {
      id: 'static',
      label: t('common.timerangeStatic', {
        defaultValue: 'Static ({{start}} - {{end}})',
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

function getEditAccessOptions(): SelectOption<WorkspaceEditAccessType>[] {
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

const getStaticWorkspaceName = ({ timerange }: { timerange: { start: string; end: string } }) => {
  if (timerange?.start && timerange?.end) {
    const dateFormat = pickDateFormatByRange(timerange.start as string, timerange.end as string)
    return t('common.timerangeDescription', {
      defaultValue: 'From {{start}} to {{end}}',
      start: formatTimerangeBoundary(timerange.start, dateFormat),
      end: formatTimerangeBoundary(timerange.end, dateFormat),
    })
  }
  return ''
}

const getDynamicWorkspaceName = ({ daysFromLatest }: { daysFromLatest: number }) => {
  return t('common.latestDays', {
    defaultValue: 'Latest {{count}} days',
    count: daysFromLatest || 0,
  })
}

export const getWorkspaceTimerangeName = (
  timeRangeOption: WorkspaceTimeRangeMode,
  {
    timerange,
    daysFromLatest,
  }: { timerange?: { start: string; end: string }; daysFromLatest?: number }
) => {
  if (timeRangeOption === 'static') {
    return getStaticWorkspaceName({
      timerange: timerange as { start: string; end: string },
    })
  } else if (timeRangeOption === 'dynamic') {
    return getDynamicWorkspaceName({ daysFromLatest: daysFromLatest as number })
  }
  return ''
}

type ReplaceTimerangeWorkspaceNameParams = {
  name: string
  prevTimeRangeOption?: WorkspaceTimeRangeMode
  timeRangeOption: WorkspaceTimeRangeMode
  daysFromLatest?: number
  prevDaysFromLatest?: number
  timerange: { start: string; end: string }
}
export const replaceTimerangeWorkspaceName = ({
  name,
  daysFromLatest,
  prevTimeRangeOption,
  prevDaysFromLatest,
  timeRangeOption,
  timerange,
}: ReplaceTimerangeWorkspaceNameParams) => {
  const workspaceTimerangeName = getWorkspaceTimerangeName(prevTimeRangeOption || timeRangeOption, {
    timerange,
    daysFromLatest: prevDaysFromLatest as number,
  })
  if (name && name.includes(workspaceTimerangeName)) {
    const workspaceLatestDescription = getWorkspaceTimerangeName(timeRangeOption, {
      timerange,
      daysFromLatest,
    })
    return name.replace(workspaceTimerangeName, workspaceLatestDescription)
  }
  return name
}
