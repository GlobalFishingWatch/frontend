import React, { Fragment, useState } from 'react'
import Choice, { ChoiceOption } from '@globalfishingwatch/ui-components/src/choice'

const ChoicesSection = () => {
  const choiceOptions: ChoiceOption[] = [
    {
      id: '1',
      title: 'First Option',
    },
    {
      id: '2',
      title: 'Second Option',
    },
    {
      id: '3',
      title: 'Third Option',
    },
    {
      id: '4',
      title: 'Forth Option',
    },
    {
      id: '5',
      title: 'Guess what?',
    },
  ]
  const [activeOption, setActiveOption] = useState<string>(choiceOptions[0].id)
  const onOptionClick = (option: ChoiceOption, e: React.MouseEvent<Element, MouseEvent>) => {
    setActiveOption(option.id)
  }

  return (
    <Fragment>
      <Choice options={choiceOptions} onOptionClick={onOptionClick} activeOption={activeOption} />
    </Fragment>
  )
}

export default ChoicesSection
