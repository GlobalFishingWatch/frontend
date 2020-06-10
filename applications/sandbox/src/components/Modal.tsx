import React, { Fragment, useState } from 'react'
import Modal from '@globalfishingwatch/ui-components/src/modal'
import IconButton from '@globalfishingwatch/ui-components/src/icon-button'

const ModalSection = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [noHeaderOpen, setNoHeaderOpen] = useState<boolean>(false)
  return (
    <Fragment>
      <label>Default modal</label>
      <Modal header="Im the modal" isOpen={open} onClose={(e) => setOpen(false)}>
        Modal content
      </Modal>
      <IconButton icon="plus" onClick={() => setOpen(true)} />
      <label>No header modal</label>
      <Modal isOpen={noHeaderOpen} onClose={(e) => setNoHeaderOpen(!noHeaderOpen)}>
        Modal content
      </Modal>
      <IconButton icon="plus" onClick={() => setNoHeaderOpen(true)} />
    </Fragment>
  )
}

export default ModalSection
