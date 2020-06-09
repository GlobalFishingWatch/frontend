import React, { useState } from 'react'
import Select, {
  SelectOption,
  SelectOnChange,
  SelectOnRemove,
} from '@globalfishingwatch/ui-components/src/select'

const selectOptions: SelectOption[] = [
  { id: 1, label: 'One', tooltip: 'Tooltip' },
  { id: 2, label: 'Two' },
  { id: 3, label: 'Three' },
]
const SelectsSection = () => {
  const [selectedOptions, setSelectedOptions] = useState([selectOptions[0]])
  const onSelect: SelectOnChange = (option, selectedOptions) => {
    setSelectedOptions(selectedOptions)
  }
  const onClean: SelectOnRemove = () => {
    setSelectedOptions([])
  }
  const onRemove: SelectOnChange = (selectedOption, currentSelection) => {
    setSelectedOptions(currentSelection)
  }

  return (
    <Select
      options={selectOptions}
      selectedOptions={selectedOptions}
      onSelect={onSelect}
      onRemove={onRemove}
      onCleanClick={onClean}
    />
  )
}

export default SelectsSection
