import { Fragment, useState } from 'react'
import { Link } from '@tanstack/react-router'

import { IconButton } from '@globalfishingwatch/ui-components/icon-button'
import { Modal } from '@globalfishingwatch/ui-components/modal'

import type { LabellingProject } from '../../types'

import ProjectForm from './ProjectForm'

import styles from './ProjectsList.module.css'

export function ProjectItem({ project }: { project: LabellingProject }) {
  const [editOpen, setEditOpen] = useState(false)

  const closeModal = () => {
    setEditOpen(false)
  }

  return (
    <Fragment>
      <div className={styles.project}>
        <Link
          to="/project/$projectId"
          params={{
            projectId: project.id?.toString() as string,
          }}
        >
          <h2 className={styles.projectName}>{project.name}</h2>
        </Link>
        <div className={styles.projectProperties}>
          <div>
            <label>Labels</label>
            {project.labels.join(', ')}
          </div>
          <IconButton icon="edit" type="border" onClick={() => setEditOpen(true)} />
        </div>
      </div>
      <Modal
        contentClassName={styles.editModal}
        appSelector={'app'}
        title={`Edit project: ${project.name}`}
        isOpen={editOpen}
        shouldCloseOnEsc
        onClose={closeModal}
      >
        <ProjectForm mode="edit" project={project} />
      </Modal>
    </Fragment>
  )
}

export default ProjectItem
