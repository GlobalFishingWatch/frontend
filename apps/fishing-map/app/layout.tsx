import path from 'path'
import React from 'react'

import 'app/i18n/client'
import '../pages/styles.css'
import '../../../libs/ui-components/src/base.css'
import '../../../libs/timebar/src/timebar-settings.css'
import '@globalfishingwatch/maplibre-gl/dist/maplibre-gl.css'

// This is needed by nx/next builder to run build the standalone next app properly
// https://github.com/nrwl/nx/issues/9017#issuecomment-1140066503
path.resolve('./next.config.js')

const IndexLayout = function ({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default IndexLayout
