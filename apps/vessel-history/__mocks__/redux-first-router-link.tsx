import * as React from 'react'

const Link = (props: any) => <a {...props}>{props?.children}</a>
Link.displayName = 'Connect(Link)'

export default Link
