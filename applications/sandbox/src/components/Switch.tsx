import React, { Fragment, useState } from 'react'
import Switch from '@globalfishingwatch/ui-components/src/switch'

const SwitchsSection = () => {
  const [switchActive, setSwitchActive] = useState(false)
  const toggle = () => {
    setSwitchActive(!switchActive)
  }
  return (
    <Fragment>
      <label>Default</label>
      <Switch active={switchActive} onClick={toggle} />
      <label>Disabled</label>
      <Switch active={false} onClick={toggle} disabled={true} />
      <label>Custom color</label>
      <Switch tooltip="switch layer" active={switchActive} onClick={toggle} color={'#ff0000'} />
    </Fragment>
  )
}

export default SwitchsSection
