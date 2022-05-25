import { Fragment, ReactComponentElement } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DatasetCategory, DatasetGeometryType } from '@globalfishingwatch/api-types'
import { ReactComponent as Polygons } from 'assets/icons/dataset-type-polygons.svg'
import { ReactComponent as PolygonsLine } from 'assets/icons/dataset-type-polygons-lines.svg'
import { ReactComponent as Tracks } from 'assets/icons/dataset-type-tracks.svg'
import { ReactComponent as Points } from 'assets/icons/dataset-type-points.svg'
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
  currentType,
  datasetCategory,
  onDatasetTypeChange,
}: {
  datasetCategory: DatasetCategory
  currentType: DatasetGeometryType | undefined
  onDatasetTypeChange: (e: any) => void
}) => {
  const { t } = useTranslation()
  return (
    <div className={styles.wrapper} onChange={onDatasetTypeChange}>
      {datasetCategory === DatasetCategory.Environment && (
        <Fragment>
          <DatasetType
            id="polygons"
            title={t('dataset.typePolygons', 'Polygons')}
            description={t(
              'dataset.typePolygonsDescription',
              'Display one or multiple areas coloured by any quantitative value in your dataset.'
            )}
            icon={<Polygons />}
            selected={currentType === 'polygons'}
          />
          <DatasetType
            id="tracks"
            title={t('dataset.typeTracks', 'Tracks')}
            description={t(
              'dataset.typeTracksDescription',
              'Display the movement of one or multiple animals or vessels.'
            )}
            icon={<Tracks />}
            selected={currentType === 'tracks'}
          />
        </Fragment>
      )}
      {datasetCategory === DatasetCategory.Context && (
        <Fragment>
          <DatasetType
            id="polygons"
            title={t('dataset.typePolygons', 'Polygons')}
            description={t(
              'dataset.typePolygonsContextDescription',
              'Display one or multiple areas.'
            )}
            icon={<PolygonsLine />}
            selected={currentType === 'polygons'}
          />
          <DatasetType
            id="points"
            title={t('dataset.typePoints', 'Points')}
            description={t(
              'dataset.typePointsDescription',
              'Display one or multiple positions sized by any quantitative value in your dataset.'
            )}
            icon={<Points />}
            selected={currentType === 'points'}
          />
        </Fragment>
      )}
    </div>
  )
}

export default DatasetTypeSelect
