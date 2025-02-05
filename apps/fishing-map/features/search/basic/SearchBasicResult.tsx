import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import type { GetItemPropsOptions } from 'downshift'
import { uniq } from 'es-toolkit'
import type { FeatureCollection } from 'geojson'

import type { Locale } from '@globalfishingwatch/api-types'
import { API_LOGIN_REQUIRED, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import type { Bbox } from '@globalfishingwatch/data-transforms'
import { geoJSONToSegments, segmentsToBbox } from '@globalfishingwatch/data-transforms'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import {
  FIRST_YEAR_OF_DATA,
  IconButton,
  YearlyTransmissionsTimeline,
} from '@globalfishingwatch/ui-components'

import { useAppDispatch } from 'features/app/app.hooks'
import { VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import { selectVesselsDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import I18nDate from 'features/i18n/i18nDate'
import I18nFlag from 'features/i18n/i18nFlag'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { getMapCoordinatesFromBounds, useMapFitBounds } from 'features/map/map-bounds.hooks'
import { useDeckMap } from 'features/map/map-context.hooks'
import TrackFootprint from 'features/search/basic/TrackFootprint'
import { cleanVesselSearchResults } from 'features/search/search.slice'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import DataTerminology from 'features/vessel/identity/DataTerminology'
import VesselIdentityFieldLogin from 'features/vessel/identity/VesselIdentityFieldLogin'
import type { IdentityVesselData } from 'features/vessel/vessel.slice'
import {
  getBestMatchCriteriaIdentity,
  getOtherVesselNames,
  getSearchIdentityResolved,
  getVesselIdentities,
  getVesselProperty,
} from 'features/vessel/vessel.utils'
import VesselLink from 'features/vessel/VesselLink'
import { selectIsStandaloneSearchLocation } from 'routes/routes.selectors'
import {
  EMPTY_FIELD_PLACEHOLDER,
  formatInfoField,
  getVesselGearTypeLabel,
  getVesselOtherNamesLabel,
  getVesselShipTypeLabel,
} from 'utils/info'

import styles from './SearchBasicResult.module.css'

type SearchBasicResultProps = {
  vessel: IdentityVesselData
  index: number
  highlightedIndex: number
  setHighlightedIndex: (index: number) => void
  getItemProps: (options: GetItemPropsOptions<IdentityVesselData>) => any
  vesselsSelected: IdentityVesselData[]
}

function SearchBasicResult({
  vessel,
  index,
  highlightedIndex,
  setHighlightedIndex,
  getItemProps,
  vesselsSelected,
}: SearchBasicResultProps) {
  const { t, i18n } = useTranslation()
  const map = useDeckMap()
  const dispatch = useAppDispatch()
  const vesselDataviews = useSelector(selectVesselsDataviews)
  const isSmallScreen = useSmallScreen()
  const isSearchLocation = useSelector(selectIsStandaloneSearchLocation)
  const [highlightedYear, setHighlightedYear] = useState<number>()
  const [trackBbox, setTrackBbox] = useState<Bbox>()
  const fitBounds = useMapFitBounds()
  const { setTimerange } = useTimerangeConnect()

  const { dataset, track } = vessel
  const vesselData = getSearchIdentityResolved(vessel)
  const {
    id,
    flag,
    shipname,
    nShipname,
    ssvid,
    imo,
    callsign,
    transmissionDateFrom,
    transmissionDateTo,
    positionsCounter,
  } = vesselData
  const shiptypes = getVesselProperty(vessel, 'shiptypes')
  const geartypes = getVesselGearTypeLabel({ geartypes: getVesselProperty(vessel, 'geartypes') })
  const bestIdentityMatch = getBestMatchCriteriaIdentity(vessel)
  const otherNamesLabel = getVesselOtherNamesLabel(getOtherVesselNames(vessel, nShipname))
  const name = shipname ? formatInfoField(shipname, 'shipname') : EMPTY_FIELD_PLACEHOLDER

  const identitySource = useMemo(() => {
    const registryIdentities = vessel.identities.filter(
      ({ identitySource }) => identitySource === VesselIdentitySourceEnum.Registry
    )
    const selfReportedIdentities = vessel.identities.filter(
      ({ identitySource }) => identitySource === VesselIdentitySourceEnum.SelfReported
    )
    const selfReportedIdentitiesSources = uniq(
      selfReportedIdentities.flatMap(({ sourceCode }) => sourceCode || [])
    )
    if (registryIdentities.length && selfReportedIdentities.length)
      return `${t(
        'vessel.infoSources.both',
        'Registry and self reported'
      )} (${selfReportedIdentitiesSources.join(', ')})`
    if (registryIdentities.length) return t('vessel.infoSources.registry', 'Registry')
    if (selfReportedIdentities.length)
      return `${t(
        'vessel.infoSources.selfReported',
        'Self reported'
      )} (${selfReportedIdentitiesSources.join(', ')})`
    return EMPTY_FIELD_PLACEHOLDER
  }, [t, vessel.identities])

  const selfReportedVesselIds = useMemo(() => {
    const identities = getVesselIdentities(vessel, {
      identitySource: VesselIdentitySourceEnum.SelfReported,
    })
    return identities.map((i) => i.id)
  }, [vessel])

  // TODO decide how we manage VMS properties
  const { fleet, origin, casco, nationalId, matricula } = vessel as any

  const isInWorkspace = vesselDataviews?.some(
    (vessel) => vessel.id === `${VESSEL_LAYER_PREFIX}${id}`
  )
  const isSelected = vesselsSelected?.some((vessel) => vessel?.id === id)
  let tooltip = t('search.selectVessel', 'Select Vessel')
  if (isInWorkspace) {
    tooltip = t('search.vesselAlreadyInWorkspace', 'This vessel is already in your workspace')
  } else if (isSelected) {
    tooltip = t('search.vesselSelected', 'Vessel selected')
  }
  const { onClick, onMouseDown, ...itemProps } = getItemProps({ item: vessel, index })

  const vesselQuery = useMemo(() => {
    const query = { start: transmissionDateFrom, end: transmissionDateTo }
    if (trackBbox) {
      const coordinates = getMapCoordinatesFromBounds(trackBbox)
      return { ...query, ...coordinates }
    }
    return query
  }, [trackBbox, transmissionDateFrom, transmissionDateTo])

  const onVesselClick = useCallback(
    (e: MouseEvent) => {
      if (!e.ctrlKey && !e.shiftKey && !e.metaKey) {
        dispatch(cleanVesselSearchResults())
      }
      if (isSearchLocation) {
        if (trackBbox) {
          fitBounds(trackBbox)
        }
        setTimerange({ start: transmissionDateFrom, end: transmissionDateTo })
      }
    },
    [
      dispatch,
      fitBounds,
      isSearchLocation,
      setTimerange,
      trackBbox,
      transmissionDateFrom,
      transmissionDateTo,
    ]
  )

  const onYearHover = useCallback(
    (year?: number) => {
      if (!isSmallScreen) {
        setHighlightedYear(year)
      }
    },
    [isSmallScreen]
  )

  const onTrackFootprintLoad = useCallback((data: FeatureCollection) => {
    const segments = geoJSONToSegments(data)
    const bbox = segments?.length ? segmentsToBbox(segments) : undefined
    setTrackBbox(bbox)
  }, [])

  return (
    <li
      {...itemProps}
      onMouseOut={() => setHighlightedIndex(-1)}
      onBlur={() => setHighlightedIndex(-1)}
      className={cx(styles.searchResult, {
        [styles.highlighted]: highlightedIndex === index,
        [styles.inWorkspace]: isInWorkspace,
        [styles.selected]: isSelected,
      })}
      key={`${index} - ${dataset?.id} - ${id}`}
      data-test={`search-vessels-option-${id}-${index}`}
    >
      <div className={styles.container}>
        <IconButton
          icon={isSelected || isInWorkspace ? 'tick' : undefined}
          type="border"
          testId={`search-vessels-option-selection-${index}`}
          className={cx(styles.icon, { [styles.selectedIcon]: isSelected || isInWorkspace })}
          size="tiny"
          tooltip={tooltip}
          onClick={isInWorkspace ? undefined : onClick}
        />
        <div className={styles.fullWidth}>
          <div className={styles.name}>
            <VesselLink
              vesselId={vesselData.id}
              identity={bestIdentityMatch}
              datasetId={dataset?.id}
              onClick={onVesselClick}
              query={vesselQuery}
              fitBounds={isSearchLocation}
            >
              {name}
            </VesselLink>
            <span className={styles.secondary}>{otherNamesLabel}</span>
          </div>
          <div className={styles.properties}>
            <div className={styles.property}>
              <label>{t('vessel.flag', 'Flag')}</label>
              <span>
                <I18nFlag iso={flag} />
              </span>
            </div>
            <div className={styles.property}>
              <label>{t('vessel.mmsi', 'MMSI')}</label>
              <span>{ssvid || EMPTY_FIELD_PLACEHOLDER}</span>
            </div>
            <div className={styles.property}>
              <label>{t('vessel.imo', 'IMO')}</label>
              <span>{imo || EMPTY_FIELD_PLACEHOLDER}</span>
            </div>
            <div className={styles.property}>
              <label>{t('vessel.callsign', 'Callsign')}</label>
              <span>{callsign || EMPTY_FIELD_PLACEHOLDER}</span>
            </div>
            <div className={styles.property}>
              <label>{t('vessel.vesselType', 'Vessel Type')}</label>
              <span>{getVesselShipTypeLabel({ shiptypes }) || EMPTY_FIELD_PLACEHOLDER}</span>
            </div>
            <div className={styles.property}>
              <label>{t('vessel.geartype', 'Gear Type')}</label>
              <span>
                {geartypes === API_LOGIN_REQUIRED ? (
                  <VesselIdentityFieldLogin />
                ) : (
                  geartypes || EMPTY_FIELD_PLACEHOLDER
                )}
              </span>
            </div>
            {matricula && (
              <div className={styles.property}>
                <label>{t('vessel.matricula', 'Matricula')}</label>
                <span>{matricula}</span>
              </div>
            )}
            {nationalId && (
              <div className={styles.property}>
                <label>{t('vessel.nationalId', 'National Id')}</label>
                <span>{nationalId}</span>
              </div>
            )}
            {casco && (
              <div className={styles.property}>
                <label>{t('vessel.casco', 'Casco')}</label>
                <span>{casco}</span>
              </div>
            )}
            {fleet && (
              <div className={styles.property}>
                <label>{t('vessel.fleet', 'Fleet')}</label>
                <span>{formatInfoField(fleet, 'fleet')}</span>
              </div>
            )}
            {origin && (
              <div className={styles.property}>
                <label>{t('vessel.origin', 'Origin')}</label>
                <span>{formatInfoField(origin, 'fleet')}</span>
              </div>
            )}
            {/* {dataset && (
                    <div className={styles.property}>
                      <label>{t('vessel.source', 'Source')}</label>
                      <DatasetLabel dataset={dataset} />
                    </div>
                  )} */}
            {identitySource && (
              <div className={styles.property}>
                <label>
                  {t('vessel.infoSource', 'Info Source')}
                  <DataTerminology
                    title={t('vessel.infoSource', 'Info Source')}
                    terminologyKey="registryInfo"
                  />
                </label>
                <span>{identitySource}</span>
              </div>
            )}
          </div>
          <div className={styles.properties}>
            {transmissionDateFrom && transmissionDateTo && (
              <div className={cx(styles.property, styles.fullWidth)}>
                <span>
                  {positionsCounter && positionsCounter > 0 && formatI18nNumber(positionsCounter)}{' '}
                  {t('vessel.transmission_other', 'transmissions')} {t('common.from', 'from')}{' '}
                  <I18nDate date={transmissionDateFrom} /> {t('common.to', 'to')}{' '}
                  <I18nDate date={transmissionDateTo} />
                </span>

                <YearlyTransmissionsTimeline
                  firstTransmissionDate={transmissionDateFrom}
                  lastTransmissionDate={transmissionDateTo}
                  firstYearOfData={FIRST_YEAR_OF_DATA}
                  locale={i18n.language as Locale}
                  onYearHover={onYearHover}
                  showLastTimePoint
                />
              </div>
            )}
          </div>
        </div>
        {!isSmallScreen && (
          <TrackFootprint
            vesselIds={selfReportedVesselIds}
            trackDatasetId={track}
            highlightedYear={highlightedYear}
            onDataLoad={onTrackFootprintLoad}
          />
        )}
      </div>
    </li>
  )
}

export default SearchBasicResult
