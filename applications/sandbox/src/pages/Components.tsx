import React from 'react'
import LogosSection from '../components/Logos'
import ButtonsSection from '../components/Buttons'
import ColorBarSection from '../components/ColorBar'
import SpinnersSection from '../components/Spinners'
import IconsSection from '../components/Icons'
import IconButtonsSection from '../components/IconButtons'
import SwitchsSection from '../components/Switch'
import TagsSection from '../components/Tags'
import SelectsSection from '../components/Select'
import InputsSection from '../components/Inputs'
import ModalsSection from '../components/Modal'
import MenuSection from '../components/Menu'
import MiniglobesSection from '../components/Miniglobes'

const ComponentsPage = () => {
  return (
    <main style={{ padding: '2rem' }}>
      <h1>Components</h1>
      <section>
        <h2>Menu</h2>
        <MenuSection />
      </section>
      <section>
        <h2>Logos</h2>
        <LogosSection />
      </section>
      <section>
        <h2>Buttons</h2>
        <ButtonsSection />
      </section>
      <section>
        <h2>Spinners</h2>
        <SpinnersSection />
      </section>
      <hr />
      <section>
        <h2>Color Bar</h2>
        <ColorBarSection />
      </section>
      <hr />
      <section>
        <h2>Icons</h2>
        <IconsSection />
      </section>
      <hr />
      <section>
        <h2>IconButtons</h2>
        <IconButtonsSection />
      </section>
      <hr />
      <section>
        <h2>Switchs</h2>
        <SwitchsSection />
      </section>
      <section>
        <h2>Tags</h2>
        <TagsSection />
      </section>
      <section>
        <h2>Select</h2>
        <SelectsSection />
      </section>
      <section>
        <h2>Inputs</h2>
        <InputsSection />
      </section>
      <section>
        <h2>Modals</h2>
        <ModalsSection />
      </section>
      <section>
        <h2>Miniglobe</h2>
        <MiniglobesSection />
      </section>
    </main>
  )
}

export default ComponentsPage
