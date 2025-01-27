import type { ChangeEvent } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'

import type { SelectOption } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectCreateWorkspaceModalOpen,
  selectEditWorkspaceModalOpen,
  setModalOpen,
} from 'features/modals/modals.slice'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import type { AppWorkspace } from 'features/workspaces-list/workspaces-list.slice'

import type { WorkspaceTimeRangeMode } from './workspace-save.utils'
import {
  getTimeRangeOptions,
  isValidDaysFromLatest,
  replaceTimerangeWorkspaceName,
} from './workspace-save.utils'

export const useSaveWorkspaceModalConnect = (id: 'editWorkspace' | 'createWorkspace') => {
  const dispatch = useAppDispatch()
  const editWorkspaceModalOpen = useSelector(selectEditWorkspaceModalOpen)
  const createWorkspaceModalOpen = useSelector(selectCreateWorkspaceModalOpen)

  const dispatchWorkspaceModalOpen = useCallback(
    (open: boolean) => {
      dispatch(setModalOpen({ id, open }))
    },
    [dispatch, id]
  )

  return {
    workspaceModalOpen:
      id === 'editWorkspace'
        ? editWorkspaceModalOpen
        : id === 'createWorkspace'
          ? createWorkspaceModalOpen
          : false,
    dispatchWorkspaceModalOpen,
  }
}

const DEFAULT_DAYS_FROM_LATEST = 30

export const useSaveWorkspaceTimerange = (workspace: AppWorkspace) => {
  const timerange = useTimerangeConnect()
  const timeRangeOptions = getTimeRangeOptions(timerange.start, timerange.end)
  const [timeRangeOption, setTimeRangeOption] = useState<WorkspaceTimeRangeMode>(
    workspace?.state?.daysFromLatest ? 'dynamic' : 'static'
  )
  const defaultDaysFromLatest = workspace?.state?.daysFromLatest || DEFAULT_DAYS_FROM_LATEST
  const [daysFromLatest, setDaysFromLatest] = useState<number | undefined>(defaultDaysFromLatest)

  const handleTimeRangeChange = useCallback(
    (option: SelectOption<WorkspaceTimeRangeMode>, workspaceName: string) => {
      const newTimeRangeOption = option.id
      setTimeRangeOption(newTimeRangeOption)

      if (newTimeRangeOption === 'static') {
        setDaysFromLatest(undefined)
      } else if (newTimeRangeOption === 'dynamic') {
        setDaysFromLatest(defaultDaysFromLatest)
      }

      const newName = replaceTimerangeWorkspaceName({
        name: workspaceName,
        timerange,
        prevTimeRangeOption: timeRangeOption,
        timeRangeOption: newTimeRangeOption,
        prevDaysFromLatest: daysFromLatest as number,
        ...(newTimeRangeOption === 'dynamic' && { daysFromLatest: defaultDaysFromLatest }),
      })
      return newName
    },
    [daysFromLatest, defaultDaysFromLatest, timeRangeOption, timerange]
  )

  const handleDaysFromLatestChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>, workspaceName: string) => {
      const newDaysFromLatest = parseInt(event.target.value)
      if (isValidDaysFromLatest(newDaysFromLatest)) {
        setDaysFromLatest(newDaysFromLatest)
      } else if (!newDaysFromLatest) {
        setDaysFromLatest('' as any)
      }

      const newName = replaceTimerangeWorkspaceName({
        name: workspaceName,
        timerange,
        timeRangeOption,
        prevDaysFromLatest: daysFromLatest as number,
        daysFromLatest: newDaysFromLatest,
      })
      return newName
    },
    [daysFromLatest, timeRangeOption, timerange]
  )

  return useMemo(
    () => ({
      timeRangeOptions,
      timeRangeOption,
      daysFromLatest,
      handleTimeRangeChange,
      handleDaysFromLatestChange,
    }),
    [
      daysFromLatest,
      handleDaysFromLatestChange,
      handleTimeRangeChange,
      timeRangeOption,
      timeRangeOptions,
    ]
  )
}
