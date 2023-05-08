import { memo, useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useCombobox, UseComboboxStateChange } from 'downshift'
import { DateTime } from 'luxon'
import { InputText, IconButton, TextArea } from '@globalfishingwatch/ui-components'
import type {
  searchOceanAreas as searchOceanAreasType,
  OceanAreaLocale,
  OceanArea,
} from '@globalfishingwatch/ocean-areas'
import { Bbox } from 'types'
import Hint from 'features/help/Hint'
import { setHintDismissed } from 'features/help/hints.slice'
import { useAppDispatch } from 'features/app/app.hooks'
import { AiMetadata, DateEntity, Entity, Intent } from 'types/ai-metadata'
import { selectContextAreasDataviews } from 'features/dataviews/dataviews.selectors'
import { selectDataviewInstancesResolved } from 'features/dataviews/dataviews.slice'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { useMapFitBounds } from '../map-viewport.hooks'
import styles from './MapSearch.module.css'

const MapSearch = () => {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const [query, setQuery] = useState<string>('')
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [areasMatching, setAreasMatching] = useState<OceanArea[]>([])
  const searchOceanAreas = useRef<typeof searchOceanAreasType>()
  const dataviews = useSelector(selectDataviewInstancesResolved)
  const fitBounds = useMapFitBounds()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { setTimerange } = useTimerangeConnect()
  const onSelectResult = ({ selectedItem }: UseComboboxStateChange<OceanArea>) => {
    const bounds = selectedItem?.properties.bounds as Bbox
    if (bounds) {
      fitBounds(bounds)
    }
  }

  const findAndSetVisibilityLayer = useCallback(
    async (dataviewName: string, visible: boolean) => {
      console.log(dataviewName, visible)
      const dataview = dataviews.find((dv) => dv.id == dataviewName || dv.name === dataviewName)
      console.log(dataview)
      if (dataview) {
        upsertDataviewInstance({
          id: dataview.id,
          config: {
            visible,
          },
        })
      }
    },
    [dataviews]
  )
  const findAndSetVisibilityLayers = useCallback(
    async (showLayers: string[], hideLayers: string[]) => {
      const updateddataviews = dataviews.map((dv) => ({
        id: dv.id,
        config: {
          visible:
            showLayers.includes(dv.id) || showLayers.includes(dv.name)
              ? true
              : hideLayers.includes(dv.id) || hideLayers.includes(dv.name)
              ? false
              : dv.config.visible,
        },
      }))

      upsertDataviewInstance(updateddataviews)
    },
    [dataviews]
  )

  const getIntent = (intents: Intent[]): string => {
    let maxConfidence = 0
    let maxIntent: string = null
    intents.forEach((intent) => {
      if (intent.confidence > maxConfidence) {
        maxConfidence = intent.confidence
        maxIntent = intent.name
      }
    })

    return maxIntent
  }
  const updateTimebarRange = (entities: DateEntity[]) => {
    const entity: DateEntity = entities[0]
    if (entity.grain) {
      const end = DateTime.fromISO(entity.value)
        .plus({ [entity.grain + 's']: 1 })
        .toISO()
      setTimerange({
        start: entity.value,
        end,
      })
    } else if (entity.start && entity.end) {
      setTimerange({
        start: entity.from.value,
        end: entity.to.value,
      })
    }
  }

  const focusLayer = useCallback(
    (layers, type) => {
      const partern = layers[0].value.toLowerCase().replace(type, '').trim()
      const areas = searchOceanAreas.current(partern, {
        locale: i18n.language as OceanAreaLocale,
      })
      console.log(areas)
      if (areas && areas.length) {
        const bounds = (areas.find((area) => area.type === type) || areas[0]).properties
          .bounds as Bbox
        if (bounds) {
          fitBounds(bounds)
        }
      }
    },
    [searchOceanAreas]
  )

  const applyIntent = useCallback(
    (metadata: AiMetadata) => {
      const intent = getIntent(metadata.intents)
      console.log(dataviews)
      console.log(metadata)
      if (intent === 'search') {
        if (metadata.entities['wit$datetime:datetime']) {
          updateTimebarRange(metadata.entities['wit$datetime:datetime'])
        }
        const contextLayers = []
        if (metadata.entities['EEZ:EEZ']) {
          contextLayers.push('context-layer-eez')
          console.log(metadata.entities['EEZ:EEZ'])
          focusLayer(metadata.entities['EEZ:EEZ'], 'eez')
        }
        if (metadata.entities['RFMO:RFMO']) {
          contextLayers.push('context-layer-rfmo')
        }
        if (metadata.entities['MPA:MPA']) {
          contextLayers.push('context-layer-mpa')
          focusLayer(metadata.entities['MPA:MPA'], 'mpa')
        }
        if (metadata.entities['activity:activity']) {
          metadata.entities['activity:activity'].forEach((activity) => {
            if (activity.value === 'Non-fishing') {
              findAndSetVisibilityLayers(['presence', 'encounter-events'].concat(contextLayers), [
                'fishing-ais',
                'vms-with-norway',
              ])
            }
            if (activity.value === 'fishing') {
              findAndSetVisibilityLayers(['fishing-ais', 'vms-with-norway'].concat(contextLayers), [
                'presence',
                'encounter-events',
              ])
            }
            if (activity.value === 'encounters') {
              findAndSetVisibilityLayers(['encounter-events'].concat(contextLayers), [])
            }
          })
        }
      }
    },
    [findAndSetVisibilityLayer, focusLayer]
  )

  const delayDebounceFn = useRef<NodeJS.Timeout>()

  const onInputChange = useCallback(
    (e) => {
      const inputValue = e.target.value
      setQuery(inputValue)
      if (delayDebounceFn.current) {
        clearTimeout(delayDebounceFn.current)
      }

      delayDebounceFn.current = setTimeout(() => {
        if (inputValue.length > 5) {
          const CLIENT_TOKEN = 'CUBLTH4NXTUMDWKFUFQ7CFEZ4O4ZVV4T'
          const q = encodeURIComponent(inputValue)
          const uri = 'https://api.wit.ai/message?v=20230215&q=' + q
          const auth = 'Bearer ' + CLIENT_TOKEN
          fetch(uri, { headers: { Authorization: auth } })
            .then((res) => res.json())
            .then((metadata) => applyIntent(metadata))
        }
        // Send Axios request here
      }, 2000)
    },
    [delayDebounceFn]
  )

  const onToggleSearch = {
    onClick: async () => {
      if (!searchOceanAreas.current) {
        searchOceanAreas.current = await import('@globalfishingwatch/ocean-areas').then(
          (module) => module.searchOceanAreas
        )
      }
      setIsOpen(!isOpen)
      dispatch(setHintDismissed('areaSearch'))
      setTimeout(() => {
        inputRef.current?.focus()
      }, 1)
    },
  }

  return (
    <div className={styles.container}>
      <IconButton
        {...onToggleSearch}
        icon="search"
        type="map-tool"
        //onClick={() => setIsOpen(!isOpen)}
        tooltip={isOpen ? t('search.close', 'Close search') : t('map.search', 'Search areas')}
        className={cx({ [styles.active]: isOpen })}
      ></IconButton>

      <Hint id="areaSearch" className={styles.helpHint} />
      <div className={cx(styles.searchContainer, { [styles.hidden]: !isOpen })}>
        <TextArea
          onChange={onInputChange}
          className={styles.input}
          placeholder={t('map.search', 'Search areas')}
          value={query}
        />
      </div>
    </div>
  )
}

export default memo(MapSearch)
