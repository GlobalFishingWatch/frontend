import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { MultiSelectOption } from '@globalfishingwatch/ui-components'
import { setModalOpen } from 'features/vesselGroup/vessel-groups.slice'
import { selectVesselGroups } from './vessel-groups.selectors'

export const useVesselGroupsOptions = () => {
  const { t } = useTranslation()
  const vesselGroups = useSelector(selectVesselGroups)

  return useMemo(() => {
    const vesselGroupsOptions: MultiSelectOption[] = vesselGroups.map(({ id, name, vessels }) => ({
      id,
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
  const optionsWithModal: MultiSelectOption[] = useMemo(
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

  const onSelectCallback = useCallback(
    (selection: MultiSelectOption) => {
      if (selection.id === OPEN_MODAL_ID) {
        dispatch(setModalOpen())
        return
      }
      if (onSelect) onSelect(selection)
    },
    [onSelect, dispatch]
  )

  return { optionsWithModal, onSelectCallback }
}
