import { useCallback, useMemo } from 'react'
import _ from 'lodash'

import type { SelectOption } from '@globalfishingwatch/ui-components';
import { Select } from '@globalfishingwatch/ui-components'

import { useUser } from 'features/user/user.hooks'
import { useWorkspace } from 'features/workspace/workspace.hook'

import styles from './view-selector.module.css'

/* eslint-disable-next-line */
export interface ViewSelectorProps {}

export function ViewSelector(props: ViewSelectorProps) {
  const { availableViews } = useUser()
  const {
    updateProfileView,
    workspace: { profileView: currentProfileView },
  } = useWorkspace()

  const VIEWS_OPTIONS: SelectOption[] = availableViews.map((item) => ({
    id: item.id,
    label: _.startCase(item.name),
  }))

  const selectedView = useMemo(
    () => VIEWS_OPTIONS.find(({ id }) => currentProfileView === id),
    [VIEWS_OPTIONS, currentProfileView]
  )

  const onSelectView = useCallback(
    (option: SelectOption) => {
      updateProfileView(option.id)
    },
    [updateProfileView]
  )

  if (VIEWS_OPTIONS.length < 2) return
  return (
    <div className={styles['container']}>
      <Select
        placeholder="View as"
        options={VIEWS_OPTIONS}
        onSelect={onSelectView}
        className={styles.select}
        selectedOption={selectedView}
      />
    </div>
  )
}

export default ViewSelector
