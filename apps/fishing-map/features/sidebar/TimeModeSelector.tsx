import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { selectTimeMode } from 'features/workspace/workspace.selectors'
import { useReplaceQueryParams } from 'router/routes.hook'
import type { TimeMode } from 'types'

import styles from './SidebarHeader.module.css'

function TimeModeSelector() {
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()
  const timeMode = useSelector(selectTimeMode)

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

  return (
    <div className={styles.header}>
      <Choice
        size="medium"
        options={options}
        activeOption={timeMode}
        onSelect={(option) => replaceQueryParams({ timeMode: option.id })}
      />
    </div>
  )
}

export default TimeModeSelector
