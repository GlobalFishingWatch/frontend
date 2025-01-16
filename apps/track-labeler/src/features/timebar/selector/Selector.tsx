import React, { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'

import type { SelectOnChange, SelectOption } from '@globalfishingwatch/ui-components/select';
import { Select } from '@globalfishingwatch/ui-components/select'

import type { Field } from '../../../data/models'
import { selectProject } from '../../../routes/routes.selectors'
import { useTimebarModeConnect } from '../timebar.hooks'

import styles from './Selector.module.css'

const colorTypesOptions: SelectOption[] = [
  { id: 'all', label: 'All' },
  { id: 'content', label: 'Only Variable' },
  { id: 'labels', label: 'Only Labels' },
]

const TimebarSelector = () => {
  const {
    timebarMode,
    filterMode,
    colorMode,
    dispatchTimebarMode,
    dispatchFilterMode,
    dispatchColorMode,
  } = useTimebarModeConnect()
  const [openModal, setOpenModal] = useState(false)
  const onGearClick = () => setOpenModal(!openModal)
  const [selectedColor, setSelectedColorOption] = useState<SelectOption | undefined>(
    colorTypesOptions.filter((option) => option.id === colorMode).shift()
  )
  const onSelectColor: SelectOnChange = (option) => {
    setSelectedColorOption(option)
    dispatchColorMode(option.id as string)
  }
  const onRemoveColor: SelectOnChange = () => {
    setSelectedColorOption(undefined)
  }
  const project = useSelector(selectProject)
  const enabledFilters: SelectOption[] =
    project?.available_filters.map((filter: Field) => ({
      id: filter as string,
      label: filter as string,
    })) || []
  const enabledDisplayOptions: SelectOption[] =
    project?.display_options.map((filter: Field) => ({
      id: filter as string,
      label: filter as string,
    })) || []

  return (
    <Fragment>
      {openModal && (
        <div className={styles.filtersPopup}>
          <label>FILTER BY</label>
          <Select
            options={enabledFilters}
            selectedOption={{ id: filterMode, label: filterMode }}
            onRemove={() => {
              return null
            }}
            onSelect={(selected: SelectOption) => {
              dispatchFilterMode(selected.id as string)
              return
            }}
          />
          <br />
          <label>DISPLAY</label>
          <Select
            options={enabledDisplayOptions}
            //direction="top"
            selectedOption={{ id: timebarMode, label: timebarMode }}
            onRemove={() => {
              return null
            }}
            onSelect={(selected: SelectOption) => {
              dispatchTimebarMode(selected.id as string)
              return
            }}
          />
          <br />
          <label>COLOR TYPES</label>
          <Select
            options={colorTypesOptions}
            direction="top"
            selectedOption={selectedColor}
            onSelect={onSelectColor}
            onRemove={onRemoveColor}
          />
        </div>
      )}
      <button className={styles.graphSelector} onClick={onGearClick}></button>
    </Fragment>
  )
}

export default TimebarSelector
