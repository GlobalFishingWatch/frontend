import cx from 'classnames'
import { ReactComponentElement } from 'react'
import { ReactComponent as Polygons } from 'assets/icons/dataset-type-polygons.svg'
import { ReactComponent as Tracks } from 'assets/icons/dataset-type-tracks.svg'
import { ReactComponent as Points } from 'assets/icons/dataset-type-points.svg'
import { DatasetGeometryType } from './datasets.hook'
import styles from './DatasetTypeSelect.module.css'

const DatasetType = ({
  id,
  title,
  description,
  selected,
  icon,
  disabled,
}: {
  id: string
  title: string
  description: string
  selected: boolean
  icon: ReactComponentElement<any, any>
  disabled?: boolean
}) => {
  return (
    <label
      htmlFor={id}
      className={cx({ [styles.selected]: selected, [styles.disabled]: disabled })}
    >
      {icon}
      <input type="radio" value={id} id={id} name="datasetType" disabled={disabled} />
      <div className={styles.title}>{title}</div>
      <div className={styles.description}>{description}</div>
    </label>
  )
}

const DatasetTypeSelect = ({
  onDatasetTypeChange,
  currentType,
}: {
  onDatasetTypeChange: (e: any) => void
  currentType: DatasetGeometryType | null
}) => {
  return (
    <div className={styles.wrapper} onChange={onDatasetTypeChange}>
      <DatasetType
        id="polygons"
        title="Polygons"
        description="Display one or multiple areas
        coloured by any quantitative value
        in your dataset."
        icon={<Polygons />}
        selected={currentType === 'polygons'}
      />
      <DatasetType
        id="tracks"
        title="Tracks"
        description="Display the movement of one or multiple animals or vessels."
        icon={<Tracks />}
        selected={currentType === 'tracks'}
      />
      <DatasetType
        id="points"
        title="Points (coming soon)"
        description="Display one or multiple positions
        sized by any quantitative value
        in your dataset."
        icon={<Points />}
        selected={currentType === 'points'}
        disabled={true}
      />
    </div>
  )
}

export default DatasetTypeSelect
