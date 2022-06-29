import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import {
  useVesselGroupSelectWithModal,
  useVesselGroupsOptions,
} from 'features/vessel-groups/vessel-groups.hooks'
import styles from './VesselGroupsList.module.css'

type VesselsGroupListProps = {
  //   schemaFilter: SchemaFilter
  //   onSelect: (filterKey: string, selection: MultiSelectOption | MultiSelectOption[]) => void
  //   onRemove: (filterKey: string, selection: MultiSelectOption[]) => void
  //   onClean: (filterKey: string) => void
}

function VesselsGroupList({}: //   schemaFilter,
//   onSelect,
//   onRemove,
//   onClean,
VesselsGroupListProps): React.ReactElement {
  const vesselGroupsOptions = useVesselGroupsOptions()
  const { t } = useTranslation()
  const { vesselGroupsOptionsWithModal, onSelectVesselGroupFilterClick } =
    useVesselGroupSelectWithModal(
      vesselGroupsOptions,
      (selection) => {
        console.log('actually do some shit', selection)
      },
      styles.openModalLink
    )

  return (
    <div className={styles.container}>
      {vesselGroupsOptionsWithModal.map((option) => (
        <div
          className={cx(styles.optionItem, option.className)}
          onClick={() => onSelectVesselGroupFilterClick('vessel-groups', option)}
        >
          {option.label}
        </div>
      ))}
    </div>
  )
}

export default VesselsGroupList
