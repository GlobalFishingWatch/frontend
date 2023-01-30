'use client'

import React, { useCallback } from 'react'
import { SplitView } from '@globalfishingwatch/ui-components'
import { useQueryParam } from 'hooks/use-query-param'

const ClientSplitView = function ({ children }: any) {
  const [isOpen, setIsOpen] = useQueryParam<boolean>('sidebarOpen')
  console.log(isOpen)

  const onToggle = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen, setIsOpen])

  return (
    <SplitView
      isOpen={isOpen}
      showToggle={true}
      onToggle={onToggle}
      main={<div>Map component will be here</div>}
      // asideWidth={asideWidth}
      showAsideLabel={'Map'}
      showMainLabel={'Map'}
      className="split-container"
    >
      {children}
    </SplitView>
  )
}

export default ClientSplitView
