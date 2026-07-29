import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { DEFAULT_TIME_RANGE } from 'data/map/config'
import { useTimerangeConnect } from 'features/map/timebar/timebar.hooks'
import { selectRealTimeLatestAvailableTimerange } from 'features/map/timebar/timebar.selectors'
import type { TimeRange } from 'features/map/timebar/timebar.slice'
import { selectTimeMode } from 'features/map/workspace/workspace.selectors'
import { useReplaceQueryParams } from 'router/routes.hook'
import type { TimeMode } from 'types'

import styles from './SidebarHeader.module.css'

function TimeModeSelector() {
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()
  const { timerange, setTimerange } = useTimerangeConnect()
  const timeMode = useSelector(selectTimeMode)
  const realTimeTimerange = useSelector(selectRealTimeLatestAvailableTimerange)
  const [previousTimeRange, setPreviousTimeRange] = useState<TimeRange>(DEFAULT_TIME_RANGE)

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
      if (realTimeTimerange) {
        setTimerange(realTimeTimerange)
      }
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
