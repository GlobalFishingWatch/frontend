import React from 'react'

type FishingActivityProps = {
  className?: string
  children?: React.ReactNode
}

function FishingActivity({ children, className = '' }: FishingActivityProps): React.ReactElement {
  console.log(children)
  return <div>FISHING ACTIVITY</div>
}
export default FishingActivity
