import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { setModalOpen } from 'features/vessel-groups/vessel-groups.slice'
import { selectAllVesselGroups } from './vessel-groups.slice'

export const useVesselGroupsOptions = () => {
  const { t } = useTranslation()
  const vesselGroups = useSelector(selectAllVesselGroups)

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

export const useVesselGroupSelectWithModal = (options, onSelect, className) => {
  const OPEN_MODAL_ID = 'openModal'
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const vesselGroupsOptionsWithModal: MultiSelectOption[] = useMemo(
    () =>
      [
        {
          id: OPEN_MODAL_ID,
          label: t('vesselGroup.createNewGroup', 'Create new group'),
          disableSelection: true,
          className,
        } as MultiSelectOption,
      ].concat(options),
    [options, t, className]
  )

  const onSelectVesselGroupFilterClick = useCallback(
    (id, selection: MultiSelectOption) => {
      if (selection.id === OPEN_MODAL_ID) {
        dispatch(setModalOpen({}))
        return
      }
      if (onSelect) onSelect('vessel-groups', selection)
    },
    [onSelect, dispatch]
  )

  return { vesselGroupsOptionsWithModal, onSelectVesselGroupFilterClick }
}
