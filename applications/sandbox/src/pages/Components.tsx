import React, { Fragment } from 'react'
import Button from '@globalfishingwatch/ui-components/src/button'

const ButtonsSection = () => {
  return (
    <Fragment>
      <h3>Basic</h3>
      <Button>I'm the default</Button>
      <h3>Secondary</h3>
      <Button type="secondary">I'm the secondary one</Button>
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
      </section>
    </main>
  )
}

export default ComponentsPage
