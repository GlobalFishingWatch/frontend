import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Button from '@globalfishingwatch/ui-components/dist/button'
import { Dataview } from '@globalfishingwatch/api-types/dist'
import { AsyncReducerStatus } from 'utils/async-slice'
import { selectWorkspaceStatus } from 'features/workspace/workspace.selectors'
import WorkspaceEditor from './WorkspaceEditor'
import NewDataviewEditor from './NewDataviewEditor'
import styles from './EditorMenu.module.css'

type Section = 'dataviews' | 'new-dataview'
const EditorMenu = () => {
  const [activeSection, setActiveSection] = useState<Section>('dataviews')
  const [editDataview, setEditDataview] = useState<Dataview | undefined>()
  const workspaceStatus = useSelector(selectWorkspaceStatus)

  const onEditClick = (dataview: Dataview) => {
    setEditDataview(dataview)
    setActiveSection('new-dataview')
  }

  const onCancelClick = () => {
    setEditDataview(undefined)
    setActiveSection('dataviews')
  }

  if (activeSection === 'new-dataview') {
    return <NewDataviewEditor editDataview={editDataview} onCancelClick={onCancelClick} />
  }

  return (
    <div className={styles.container}>
      <WorkspaceEditor onEditClick={onEditClick} />
      {workspaceStatus === AsyncReducerStatus.Finished && (
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
