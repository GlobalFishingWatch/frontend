import React, { useState, Fragment } from 'react'
import InputText from '@globalfishingwatch/ui-components/src/input-text'

const InputsSection = () => {
  const [textValue, setTextValue] = useState<string>('')
  return (
    <Fragment>
      <InputText
        value={textValue}
        onChange={(e) => setTextValue(e.currentTarget.value)}
        label="something"
        placeholder="Input something"
      />
      <InputText
        value={textValue}
        onChange={(e) => setTextValue(e.currentTarget.value)}
        label="text or stuff"
        placeholder="Input a text"
        disabled
      />
      <InputText
        value={textValue}
        onChange={(e) => setTextValue(e.currentTarget.value)}
        label="email"
        placeholder="Input an email"
        type="email"
      />
      <InputText
        value={textValue}
        onChange={(e) => setTextValue(e.currentTarget.value)}
        placeholder="Search something"
        type="search"
        inputSize="small"
      />
    </Fragment>
  )
}

export default InputsSection
