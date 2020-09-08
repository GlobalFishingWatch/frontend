import React, { Fragment } from 'react'
import Button from '@globalfishingwatch/ui-components/src/button'

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
      <h3>Loading</h3>
      <Button loading>I'm loading</Button>
      <Button type="secondary" loading>
        I'm loading
      </Button>
    </Fragment>
  )
}

export default ButtonsSection
