import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Button } from '@globalfishingwatch/ui-components'
import { Dataview } from '@globalfishingwatch/api-types'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import { selectUserDataviewEditPermissions } from 'features/user/user.selectors'
import WorkspaceEditor from './WorkspaceEditor'
import DataviewEditor from './DataviewEditor'
import styles from './EditorMenu.module.css'

type Section = 'dataviews' | 'new-dataview'
const EditorMenu = () => {
  const [activeSection, setActiveSection] = useState<Section>('dataviews')
  const [editDataview, setEditDataview] = useState<Dataview | undefined>()
  const workspaceStatus = useSelector(selectWorkspaceStatus)
  const userDataviewPermissions = useSelector(selectUserDataviewEditPermissions)

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
