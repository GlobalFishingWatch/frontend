import _ from 'lodash'
import { useCallback, useMemo } from 'react'
import { Select, SelectOption } from '@globalfishingwatch/ui-components'
import { useUser } from 'features/user/user.hooks'
import styles from './view-selector.module.css'

/* eslint-disable-next-line */
export interface ViewSelectorProps {}

export function ViewSelector(props: ViewSelectorProps) {
  const { availableViews } = useUser()
  const currentView = ''

  const VIEWS_OPTIONS: SelectOption[] = availableViews.map((item) => ({
    id: item.id,
    label: _.startCase(item.name),
  }))

  const selectedView = useMemo(
    () => VIEWS_OPTIONS.find(({ id }) => currentView === id),
    [VIEWS_OPTIONS]
  )

  const onSelectView = useCallback((option: SelectOption) => {
    // setUserAdditionalInformation({ ...userAdditionalInformation, intendedUse: option.id })
    console.log('switch view to ' + option.id)
  }, [])
  const onRemoveView = useCallback((option: SelectOption) => {
    // setUserAdditionalInformation({ ...userAdditionalInformation, intendedUse: option.id })
    console.log('Removed view ' + option.id)
  }, [])
  return (
    <div className={styles['container']}>
      <Select
        placeholder="View as"
        options={VIEWS_OPTIONS}
        onSelect={onSelectView}
        onRemove={onRemoveView}
        className={styles.select}
        selectedOption={selectedView}
      />
    </div>
  )
}

export default ViewSelector
