import React, { Fragment, useState } from 'react'
import Button from '@globalfishingwatch/ui-components/src/button'
import Icon from '@globalfishingwatch/ui-components/src/icon'
import IconButton from '@globalfishingwatch/ui-components/src/icon-button'
import Tag from '@globalfishingwatch/ui-components/src/tag'
import TagList, { TagItem, TagListOnRemove } from '@globalfishingwatch/ui-components/src/tag-list'
import InputText from '@globalfishingwatch/ui-components/src/input-text'
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
      <label>Default</label>
      <Icon icon="menu" />
      <label>Custom fill</label>
      <span style={{ color: 'red' }}>
        <Icon icon="delete" />
      </span>
    </Fragment>
  )
}

const IconButtonsSection = () => {
  return (
    <Fragment>
      <label>Default</label>
      <IconButton icon="menu" onClick={(e) => console.log(e)} />
      <label>Default destructive</label>
      <IconButton icon="delete" />
      <label>Border</label>
      <IconButton icon="download" type="border" />
      <label>Invert</label>
      <IconButton icon="camera" type="invert" />
      <label>Small</label>
      <IconButton icon="compare" size="small" />
      <label>Small invert</label>
      <IconButton icon="edit" size="small" type="invert" />
      <label>Tiny</label>
      <IconButton icon="arrow-top" size="tiny" />
      <label>Tiny invert</label>
      <IconButton icon="arrow-down" size="tiny" type="invert" />
      <label>Custom fill</label>
      <IconButton icon="arrow-right" className={styles.customIcon} />
      <label>Custom fill invert</label>
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
      <Switch active={switchActive} onClick={toggle} />
      <label>Disabled</label>
      <Switch active={false} onClick={toggle} disabled={true} />
      <label>Custom color</label>
      <Switch tooltip="switch layer" active={switchActive} onClick={toggle} color={'#ff0000'} />
    </Fragment>
  )
}

const TagsSection = () => {
  const [tags, setTags] = useState<TagItem[]>([
    {
      id: 'RUS',
      label: 'Russia',
    },
    {
      id: 'JPN',
      label: 'Japan',
    },
    {
      id: 'CHN',
      label: 'China',
    },
    {
      id: 'PRT',
      label: 'Portugal',
    },
  ])
  const onRemoveTag: TagListOnRemove = (id, currentOptions) => {
    console.log('Removed', id)
    setTags(currentOptions)
  }

  return (
    <Fragment>
      <label>Default</label>
      <Tag>Argentina</Tag>
      <Tag onRemove={(e) => console.log(e)}>Panama</Tag>
      <label>Custom Color</label>
      <Tag onRemove={(e) => console.log(e)} color={'#ff0000'}>
        Chile
      </Tag>
      <label>Tag list</label>
      <TagList color={'#ff0000'} options={tags} onRemove={onRemoveTag} />
    </Fragment>
  )
}

const InputsSection = () => {
  return (
    <Fragment>
      <InputText label="something" placeholder="Input something" />
      <InputText label="email or stuff" placeholder="Input an email" icon="email" />
      <InputText inputSize="small" label="email" placeholder="Input an email" icon="email" />
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
        <h2>Inputs</h2>
        <InputsSection />
      </section>
    </main>
  )
}

export default ComponentsPage
