import React, { useState, Fragment } from 'react'
import Select, {
  SelectOption,
  SelectOnChange,
  SelectOnRemove,
} from '@globalfishingwatch/ui-components/src/select'
import MultiSelect, {
  MultiSelectOption,
  MultiSelectOnChange,
  MultiSelectOnRemove,
} from '@globalfishingwatch/ui-components/src/multi-select'

const selectOptions: SelectOption[] = [
  { id: 1, label: 'One', tooltip: 'Tooltip' },
  { id: 2, label: 'Two' },
  { id: 3, label: 'Three' },
]
const SelectsSection = () => {
  const [selectedOption, setSelectedOption] = useState<SelectOption | undefined>()
  const onSelect: SelectOnChange = (option) => {
    setSelectedOption(option)
  }
  const onClean: SelectOnRemove = () => {
    setSelectedOption(undefined)
  }
  const onRemove: SelectOnChange = () => {
    setSelectedOption(undefined)
  }

  const [selectedMultiOptions, setSelectedMultiOptions] = useState<MultiSelectOption[]>([
    selectOptions[0],
  ])
  const onMultiSelect: MultiSelectOnChange = (option, selectedOptions) => {
    setSelectedMultiOptions(selectedOptions)
  }
  const onMultiRemove: MultiSelectOnChange = (selectedOption, currentSelection) => {
    setSelectedMultiOptions(currentSelection)
  }
  const oMultiClean: MultiSelectOnRemove = () => {
    setSelectedMultiOptions([])
  }

  return (
    <Fragment>
      <label>Regular Select</label>
      <Select
        options={selectOptions}
        selectedOption={selectedOption}
        onSelect={onSelect}
        onRemove={onRemove}
        onCleanClick={onClean}
      />
      <label>Multi Select</label>
      <MultiSelect
        options={selectOptions}
        selectedOptions={selectedMultiOptions}
        onSelect={onMultiSelect}
        onRemove={onMultiRemove}
        onCleanClick={oMultiClean}
      />
    </Fragment>
  )
}

export default SelectsSection
