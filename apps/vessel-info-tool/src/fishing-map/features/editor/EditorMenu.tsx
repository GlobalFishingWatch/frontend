import { useState } from 'react'
import { useSelector } from 'react-redux'

import type { Dataview } from '@globalfishingwatch/api-types'
import { Button } from '@globalfishingwatch/ui-components'

import { selectHasDataviewEditPermissions } from 'features/user/selectors/user.permissions.selectors'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import DataviewEditor from './DataviewEditor'
import WorkspaceEditor from './WorkspaceEditor'

import styles from './EditorMenu.module.css'

type Section = 'dataviews' | 'new-dataview'
const EditorMenu = () => {
  const [activeSection, setActiveSection] = useState<Section>('dataviews')
  const [editDataview, setEditDataview] = useState<Dataview | undefined>()
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const userDataviewPermissions = useSelector(selectHasDataviewEditPermissions)

  const onEditClick = (dataview: Dataview) => {
    setEditDataview(dataview)
    setActiveSection('new-dataview')
  }

  const onCancelClick = () => {
    setEditDataview(undefined)
    setActiveSection('dataviews')
  }

  if (activeSection === 'new-dataview') {
    return <DataviewEditor editDataview={editDataview} onCancelClick={onCancelClick} />
  }

  return (
    <div className={styles.container}>
      <WorkspaceEditor onEditClick={onEditClick} />
      {workspaceStatus === AsyncReducerStatus.Finished && userDataviewPermissions && (
        <Button
          className={styles.footerButton}
          onClick={() => {
            setActiveSection('new-dataview')
          }}
        >
          New dataview{' '}
        </Button>
      )}
    </div>
  )
}

export default EditorMenu
