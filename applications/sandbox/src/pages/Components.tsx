import React, { Fragment, useState } from 'react'
import Button from '@globalfishingwatch/ui-components/src/button'
import Icon from '@globalfishingwatch/ui-components/src/icon'
import IconButton from '@globalfishingwatch/ui-components/src/icon-button'
// import { IconButton } from '@globalfishingwatch/ui-components'
// import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Switch from '@globalfishingwatch/ui-components/src/switch'
import styles from './pages.module.css'

const ButtonsSection = () => {
  return (
    <Fragment>
      <h3>Basic</h3>
      <Button tooltip="Tooltiping" onClick={(e) => console.log(e)}>
        I'm the default
      </Button>
      <h3>Secondary</h3>
      <Button type="secondary">I'm the secondary one</Button>
      <h3>Small</h3>
      <Button size="small">I'm the small one</Button>
      <h3>Small secondary</h3>
      <Button tooltip="Hi" tooltipPlacement="right" size="small" type="secondary">
        I'm the small and secondary one
      </Button>
      <h3>Disabled</h3>
      <Button disabled>I'm disabled</Button>
    </Fragment>
  )
}

const IconsSection = () => {
  return (
    <Fragment>
      <h3>Default</h3>
      <Icon icon="menu" />
      <h3>Custom fill</h3>
      <span style={{ color: 'red' }}>
        <Icon icon="delete" />
      </span>
    </Fragment>
  )
}

const IconButtonsSection = () => {
  return (
    <Fragment>
      <h3>Default</h3>
      <IconButton icon="menu" onClick={(e) => console.log(e)} />
      <h3>Default destructive</h3>
      <IconButton icon="delete" />
      <h3>Border</h3>
      <IconButton icon="download" type="border" />
      <h3>Invert</h3>
      <IconButton icon="camera" type="invert" />
      <h3>Small</h3>
      <IconButton icon="compare" size="small" />
      <h3>Small invert</h3>
      <IconButton icon="edit" size="small" type="invert" />
      <h3>Tiny</h3>
      <IconButton icon="arrow-top" size="tiny" />
      <h3>Tiny invert</h3>
      <IconButton icon="arrow-down" size="tiny" type="invert" />
      <h3>Custom fill</h3>
      <IconButton icon="arrow-right" className={styles.customIcon} />
      <h3>Custom fill invert</h3>
      <IconButton icon="arrow-down" type="invert" className={styles.customIcon} />
    </Fragment>
  )
}
const SwitchsSection = () => {
  const [switchActive, setSwitchActive] = useState(false)
  const toggle = () => {
    setSwitchActive(!switchActive)
  }
  return (
    <Fragment>
      <label>Default</label>
      <Switch active={switchActive} onClickFn={toggle} />
      <label>Disabled</label>
      <Switch active={false} onClickFn={toggle} disabled={true} />
      <label>Custom color</label>
      <Switch active={switchActive} onClickFn={toggle} color={'#ff0000'} />
    </Fragment>
  )
}

const ComponentsPage = () => {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Components</h1>
      <section>
        <h2>Buttons</h2>
        <ButtonsSection />
        <hr />
        <h2>Icons</h2>
        <IconsSection />
        <hr />
        <h2>IconButtons</h2>
        <IconButtonsSection />
      </section>
      <section>
        <h2>Switchs</h2>
        <SwitchsSection />
      </section>
    </main>
  )
}

export default ComponentsPage
