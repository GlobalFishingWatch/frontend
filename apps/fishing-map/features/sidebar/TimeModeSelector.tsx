import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DateTime } from 'luxon'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import type { TimeRange } from 'features/timebar/timebar.slice'
import { setRealTimeLatestUpdate } from 'features/timebar/timebar.slice'
import { selectTimeMode } from 'features/workspace/workspace.selectors'
import { useReplaceQueryParams } from 'router/routes.hook'
import type { TimeMode } from 'types'
import { getRealTimeTimerange } from 'utils/dates'

import styles from './SidebarHeader.module.css'

function TimeModeSelector() {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()
  const { timerange, setTimerange } = useTimerangeConnect()
  const timeMode = useSelector(selectTimeMode)
  const [previousTimeRange, setPreviousTimeRange] = useState<TimeRange | null>(null)

  const options = [
    {
      id: 'historical',
      label: t((t) => t.common.historical),
    },
    {
      id: 'realTime',
      label: t((t) => t.common.realTime),
    },
  ] as ChoiceOption<TimeMode>[]

  const onSelect = (option: ChoiceOption<TimeMode>) => {
    if (option.id === timeMode) {
      return
    }
    replaceQueryParams({ timeMode: option.id })
    if (option.id === 'realTime') {
      setPreviousTimeRange(timerange)
      setTimerange(getRealTimeTimerange())
      dispatch(setRealTimeLatestUpdate(DateTime.now().toISO() as string))
    } else {
      if (previousTimeRange) {
        setTimerange(previousTimeRange)
      }
    }
  }

  return (
    <div className={styles.header}>
      <Choice size="medium" options={options} activeOption={timeMode} onSelect={onSelect} />
    </div>
  )
}

export default TimeModeSelector
