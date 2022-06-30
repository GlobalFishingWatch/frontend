import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { selectUserVesselGroups } from 'features/user/user.selectors'
import styles from './VesselGroupsList.module.css'

export const useVesselGroupsOptions = () => {
  const { t } = useTranslation()
  const vesselGroups = useSelector(selectUserVesselGroups)

  return useMemo(() => {
    const vesselGroupsOptions: MultiSelectOption[] = vesselGroups.map(({ id, name, vessels }) => ({
      id: id.toString(),
      label: t('vesselGroup.label', `{{name}} ({{count}} IDs)`, {
        name,
        count: vessels.length,
      }),
    }))
    return vesselGroupsOptions
  }, [t, vesselGroups])
}

export const VESSEL_GROUPS_MODAL_ID = 'vesselGroupsOpenModalId'
export const useVesselGroupSelectWithModal = () => {
  const options = useVesselGroupsOptions()
  const { t } = useTranslation()
  const vesselGroupsOptionsWithModal: MultiSelectOption[] = useMemo(
    () =>
      [
        {
          id: VESSEL_GROUPS_MODAL_ID,
          label: t('vesselGroup.createNewGroup', 'Create new group'),
          disableSelection: true,
          className: styles.openModalLink,
        } as MultiSelectOption,
      ].concat(options),
    [options, t]
  )

  return vesselGroupsOptionsWithModal
}
