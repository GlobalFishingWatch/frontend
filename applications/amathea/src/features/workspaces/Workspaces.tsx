import React from 'react'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { AREAS_OF_INTEREST } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'

function Workspaces(): React.ReactElement {
  const { dispatchLocation } = useLocationConnect()
  return (
    <div>
      <h2>Workspaces</h2>
      <Button
        onClick={() => {
          dispatchLocation(AREAS_OF_INTEREST)
        }}
      >
        Go to AOI
      </Button>
    </div>
  )
}

export default Workspaces
