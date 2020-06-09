import React, { useState } from 'react'
import Select, { SelectOption } from '@globalfishingwatch/ui-components/src/select'

const selectOptions: SelectOption[] = [
  { id: 1, label: 'One', tooltip: 'Tooltip' },
  { id: 2, label: 'Two' },
  { id: 3, label: 'Three' },
]
const SelectsSection = () => {
  const [selectedOptions, setSelectedOptions] = useState([selectOptions[0].id])
  const onSelect = (selectedOption: SelectOption) => {
    setSelectedOptions([...selectedOptions, selectedOption.id])
  }
  const onClean = (event: React.MouseEvent) => {
    setSelectedOptions([])
  }
  const onRemove = (selectedOption: SelectOption) => {
    setSelectedOptions(selectedOptions.filter((option) => option !== selectedOption.id))
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
