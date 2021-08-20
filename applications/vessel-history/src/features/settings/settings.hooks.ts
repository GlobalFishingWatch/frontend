import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { capitalize } from 'lodash'
import { MultiSelectOption } from '@globalfishingwatch//ui-components/dist/multi-select'
import { selectEEZs, selectMPAs, selectRFMOs } from 'features/regions/regions.selectors'
import { Region, anyRegion } from 'features/regions/regions.slice'
import flags from 'data/flags'
import {
  selectSettings,
  SettingEventSectionName,
  Settings,
  SettingsEvents,
  SettingsPortVisits,
  updateSettings,
} from './settings.slice'

export const useSettingsConnect = () => {
  const dispatch = useDispatch()
  const settings = useSelector(selectSettings)

  const mergeSettings = (
    settingType: string,
    updatedSectionSettings: SettingsEvents | SettingsPortVisits
  ) => {
    const newSettings = {
      ...settings,
      [settingType]: updatedSectionSettings,
    }
    dispatch(updateSettings(newSettings))
  }

  const setSettingOptions = (section: string, field: string, values: Region[]) => {
    const key = section as keyof Settings
    const newSettings = {
      ...settings[key],
      [field]: values.map((v) => v.id),
    }
    mergeSettings(section, newSettings)
  }

  const setSetting = (section: string, field: string, value: number) => {
    const key = section as keyof Settings
    const newSettings = {
      ...settings[key],
      [field]: value,
    }
    mergeSettings(section, newSettings)
  }

  return {
    setSetting,
    setSettingOptions,
  }
}

export const useSettingsRegionsConnect = (
  section: SettingEventSectionName,
  settings: SettingsEvents
) => {
  const { t } = useTranslation()
  const { setSettingOptions } = useSettingsConnect()

  const onlyUnique = useCallback((value: Region, index: number, self: Region[]) => {
    return self.map((item) => item.id).indexOf(value.id) === index
  }, [])

  const EEZ_REGIONS: Region[] = useSelector(selectEEZs)
  const RFMOS_REGIONS: Region[] = useSelector(selectRFMOs).filter(onlyUnique)
  const MPAS_REGIONS: Region[] = useSelector(selectMPAs)
  const COUNTRIES: Region[] = flags

  const anyOption: MultiSelectOption<string> = useMemo(
    () => ({
      ...anyRegion,
      label: t(`common.${anyRegion.label}` as any, capitalize(anyRegion.label)) as string,
      disabled: false,
      tooltip: t(`common.${anyRegion.label}` as any, capitalize(anyRegion.label)) as string,
    }),
    [t]
  )

  const onSelectRegion = useCallback(
    (selected: MultiSelectOption<string>, currentSelected: MultiSelectOption[], field: string) => {
      selected === anyOption
        ? // when ANY is selected the rest are deselected
          setSettingOptions(section, field, [selected])
        : // when other than ANY is selected
          setSettingOptions(section, field, [
            // then ANY should be deselected
            ...currentSelected.filter((option) => option !== anyOption),
            selected,
          ])
    },
    [section, setSettingOptions, anyOption]
  )

  const getOptions = useCallback(
    (availableOptions: MultiSelectOption[], field: string, selected?: string | string[]) => {
      const allOptions = [anyOption, ...availableOptions]
      const selectedOptions = allOptions.filter((option) => selected?.includes(option.id))
      const options = [
        // First display ANY whether it's selected or not
        anyOption,
        // Then all selected options
        ...selectedOptions.filter((option) => option !== anyOption),
        // And at the bottom the rest of the options
        ...availableOptions.filter((option) => !selectedOptions.includes(option)),
      ]
      return {
        options,
        selected: selectedOptions,
        onSelect: (option: MultiSelectOption) => onSelectRegion(option, selectedOptions, field),

        onClean: () => setSettingOptions(section, field, []),
        onRemove: (option: MultiSelectOption) =>
          setSettingOptions(
            section,
            field,
            selectedOptions.filter((o) => o.id !== option.id)
          ),
      }
    },
    [anyOption, section, onSelectRegion, setSettingOptions]
  )

  return {
    EEZ_REGIONS,
    RFMOS_REGIONS,
    MPAS_REGIONS,
    COUNTRIES,
    getOptions,
  }
}
