import { useState } from 'react'
import cx from 'classnames'

import { Button } from '@globalfishingwatch/ui-components/button'
import { InputText } from '@globalfishingwatch/ui-components/input-text'

import { useCreateProjectMutation, useEditProjectMutation } from '../../api'
import type { LabellingProject } from '../../types'

import styles from './ProjectsList.module.css'

export function ProjectForm({
  project,
  mode,
}: {
  project: LabellingProject
  mode: 'edit' | 'create'
}) {
  const [error, setError] = useState('')
  const [projectInfo, setProjectInfo] = useState(project)
  const [editProject, { isLoading: isEditLoading }] = useEditProjectMutation({
    fixedCacheKey: [project.id].join(),
  })
  const [createProject, { isLoading: isCreateLoading }] = useCreateProjectMutation({
    fixedCacheKey: [project.id].join(),
  })

  const handleChange = ({ value, field }: { value: string | string[]; field: string }) => {
    setProjectInfo({ ...projectInfo, [field]: value })
  }

  const saveProject = async () => {
    let res = null
    if (mode === 'edit') {
      res = await editProject(projectInfo)
    } else {
      res = await createProject(projectInfo)
    }
    if (res.data) {
      window.location.reload()
    } else if (res.error) {
      setError((res.error as any).message)
    }
  }

  const confirmDisabled =
    !projectInfo.name || !projectInfo.labels.length || !projectInfo.bqQuery || !projectInfo.bqTable

  const { name, labels, bqQuery, bqTable, gcsThumbnails, scale } = projectInfo

  return (
    <div className={styles.projectEdit}>
      <div className={styles.projectEditProperty}>
        <label>Name</label>
        <InputText
          value={name}
          onChange={(e) => handleChange({ value: e.target.value, field: 'name' })}
        />
      </div>
      <div className={styles.projectEditProperty}>
        <label>
          Labels <span className={styles.secondary}>(comma separated)</span>
        </label>
        <InputText
          value={labels.join(', ')}
          onChange={(e) =>
            handleChange({
              value: e.target.value.split(', ').map((l) => l.trim()),
              field: 'labels',
            })
          }
        />
      </div>
      <div className={styles.projectEditProperty}>
        <label>GCS Thumbnails folder</label>
        <InputText
          value={gcsThumbnails}
          onChange={(e) => handleChange({ value: e.target.value, field: 'gcsThumbnails' })}
          placeholder="gs://route-to-folder"
        />
        <span className={cx(styles.preview, styles.oneLine)}>
          Final url:{' '}
          {`${gcsThumbnails !== 'gs://' ? gcsThumbnails : 'gs://route-to-folder'}/YYYYMMDD/ID*`}
        </span>
      </div>
      <div className={styles.projectEditProperty}>
        <label>BQ Query </label>
        <textarea
          className={styles.textArea}
          name="Text1"
          cols={73}
          rows={7}
          value={bqQuery}
          onChange={(e) => handleChange({ value: e.target.value, field: 'bqQuery' })}
        >
          {bqQuery}
        </textarea>
        <span className={styles.preview}>
          <ul className={styles.bulletedList}>
            <li>Should return an 'id' field matching the thumbnail file names.</li>
            <li>
              The tool will show a link to the detection location if 'lat' and 'lon' fields are
              present.
            </li>
            <li>Other fields will appear as metadata (e.g. score).</li>
          </ul>
        </span>
      </div>
      <div className={styles.projectEditProperty}>
        <label>
          Name for the BQ Table to store labelling results{' '}
          <span className={styles.secondary}>(Should not exist already)</span>
        </label>
        <InputText
          value={bqTable}
          onChange={(e) => handleChange({ value: e.target.value, field: 'bqTable' })}
        />
        <span className={styles.preview}>
          <ul className={styles.bulletedList}>
            <li>{`Please follow the following format: <project>.<dataset>.<table>`}</li>
          </ul>
        </span>
      </div>
      <div className={styles.projectEditProperty}>
        <label>
          Scale <span className={styles.secondary}>(in meters per pixel)</span>
        </label>
        <InputText
          value={scale}
          onChange={(e) => handleChange({ value: e.target.value, field: 'scale' })}
        />
      </div>
      <div className={styles.footer}>
        {error && <p className={styles.error}>{error}</p>}
        <Button
          disabled={confirmDisabled}
          loading={mode === 'edit' ? isEditLoading : isCreateLoading}
          className={styles.saveProjectBtn}
          onClick={saveProject}
        >
          {mode === 'edit' ? 'Update project' : 'Create project'}
        </Button>
      </div>
    </div>
  )
}

export default ProjectForm
