import React, { Fragment } from 'react'
import Button from '@globalfishingwatch/ui-components/src/button'
import IconButton from '@globalfishingwatch/ui-components/src/icon-button'
// import { IconButton } from '@globalfishingwatch/ui-components'
// import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'

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
      <Icon icon="delete" fill="red" />
    </Fragment>
  )
}
const IconButtonsSection = () => {
  return (
    <Fragment>
      <h3>Default</h3>
      <IconButton icon="menu" onClick={(e) => console.log(e)} />
      <IconButton icon="download" type="border" />
      <IconButton icon="camera" type="invert" />
    </Fragment>
  )
}

const ComponentsPage = () => {
  return (
    <main>
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
    </main>
  )
}

export default ComponentsPage
