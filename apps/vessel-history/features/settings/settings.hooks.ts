import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { capitalize } from 'lodash'

import type { MultiSelectOption } from '@globalfishingwatch/ui-components'

import flags from 'data/flags'
import { TrackCategory,trackEvent } from 'features/app/analytics.hooks'
import { selectEEZs, selectMPAs, selectRFMOs } from 'features/regions/regions.selectors'
import type { Region} from 'features/regions/regions.slice';
import { anyRegion } from 'features/regions/regions.slice'

import type {
  SettingEventSectionName,
  Settings,
  SettingsEvents,
  SettingsPortVisits} from './settings.slice';
import {
  selectSettings,
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
    if (settingType !== 'portVisits') {
      const setting = newSettings[settingType as keyof Settings] as SettingsEvents
      trackEvent({
        category: TrackCategory.HighlightEvents,
        action: `Configure ${settingType} events highlights`,
        label: JSON.stringify({
          eez: setting.eezs?.[0] === '0-any' ? 'any' : setting.eezs?.length || 0,
          mpa: setting.mpas?.[0] === '0-any' ? 'any' : setting.mpas?.length || 0,
          rfmo: setting.rfmos?.[0] === '0-any' ? 'any' : setting.rfmos?.length || 0,
          duration: setting.duration,
          distance_from_shore: setting.distanceShoreLonger,
          distance_from_port: setting.distancePortLonger,
        }),
      })
    } else {
      trackEvent({
        category: TrackCategory.HighlightEvents,
        action: `Configure ${settingType} events highlights`,
        label: JSON.stringify({
          flags:
            newSettings.portVisits.flags?.[0] === '0-any'
              ? 'any'
              : newSettings.portVisits.flags?.length || 0,
          duration: newSettings.portVisits.duration,
          distance_from_shore: newSettings.portVisits.distanceShoreLonger,
        }),
      })
    }
    dispatch(updateSettings(newSettings))
  }

  const setSettingOptions = (section: string, field: string, values: Region[]) => {
    const key = section as keyof Settings
    const newSettings = {
      ...(settings[key] as SettingsEvents),
      [field]: values.map((v) => v.id),
    }
    mergeSettings(section, newSettings)
  }

  const setSetting = (section: string, field: string, value: number) => {
    const key = section as keyof Settings
    const newSettings: SettingsEvents = {
      ...(settings[key] as SettingsEvents),
      [field]: value >= 0 ? value : undefined,
    }
    mergeSettings(section, newSettings)
  }

  const setFiltersStatus = (status: boolean) => {
    const newSettings: Settings = {
      ...settings,
      enabled: status,
    }
    dispatch(updateSettings(newSettings))
  }

  return {
    setSetting,
    setSettingOptions,
    setFiltersStatus,
  }
}

const onlyUnique = (value: Region, index: number, self: Region[]) => {
  return self.map((item) => item.id).indexOf(value.id) === index
}

export const useSettingsRegionsConnect = (section: SettingEventSectionName) => {
  const { t } = useTranslation()
  const { setSettingOptions } = useSettingsConnect()

  const EEZ_REGIONS = useSelector(selectEEZs)
  const RFMOS_REGIONS = useSelector(selectRFMOs)?.filter(onlyUnique)
  const MPAS_REGIONS = useSelector(selectMPAs)
  const COUNTRIES: Region[] = flags

  const anyOption: MultiSelectOption<string, string> = useMemo(
    () => ({
      ...anyRegion,
      label: t(`common.${anyRegion.label}` as any, capitalize(anyRegion.label)) as string,
      disabled: false,
    }),
    [t]
  )

  const onSelectRegion = useCallback(
    (
      selected: MultiSelectOption<string, string>,
      currentSelected: MultiSelectOption<string, string>[],
      field: string
    ) => {
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
    (
      availableOptions: MultiSelectOption<string, string>[] | undefined = [],
      field: string,
      selected?: string | string[]
    ) => {
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
        onClean: () => setSettingOptions(section, field, []),
        onRemove: (option: MultiSelectOption<string, string>) =>
          setSettingOptions(
            section,
            field,
            selectedOptions.filter((o) => o.id !== option.id)
          ),
        onSelect: (option: MultiSelectOption<string, string>) => {
          onSelectRegion(option, selectedOptions, field)
        },
        selected: selectedOptions,
      }
    },
    [anyOption, section, onSelectRegion, setSettingOptions]
  )

  return {
    anyOption,
    EEZ_REGIONS,
    RFMOS_REGIONS,
    MPAS_REGIONS,
    COUNTRIES,
    getOptions,
  }
}
