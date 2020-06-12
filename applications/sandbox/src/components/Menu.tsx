import React, { Fragment, useState } from 'react'
import Menu from '@globalfishingwatch/ui-components/src/menu'
import IconButton from '@globalfishingwatch/ui-components/src/icon-button'

const MenuSection = () => {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <Fragment>
      <label>Menu</label>
      <Menu isOpen={open} onClose={(e) => setOpen(false)} activeLinkId="map-data">
        Menu toggle
      </Menu>
      <IconButton icon="plus" onClick={() => setOpen(true)} />
    </Fragment>
  )
}

export default MenuSection
