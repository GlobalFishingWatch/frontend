import React, { ReactElement, Fragment } from 'react'

const Link = ({ to, children }: { to: any; children: ReactElement }): ReactElement => {
  const toURL = JSON.stringify(to)

  return (
    <Fragment>
      <a href={toURL}>{children}</a>
    </Fragment>
  )
}

export default Link
