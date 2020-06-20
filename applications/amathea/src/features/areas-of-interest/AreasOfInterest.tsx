import React from 'react'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { WORKSPACES } from 'routes/routes'
import { useLocationConnect } from 'routes/routes.hook'

function AreasOfInterest(): React.ReactElement {
  const { dispatchLocation } = useLocationConnect()
  return (
    <div>
      <h2>AreasOfInterest</h2>
      <Button
        onClick={() => {
          dispatchLocation(WORKSPACES)
        }}
      >
        Go to Workspaces
      </Button>
    </div>
  )
}

export default AreasOfInterest
