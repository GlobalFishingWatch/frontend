import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import type { GetItemPropsOptions } from 'downshift'
import { uniq, upperFirst } from 'es-toolkit'
import type { FeatureCollection } from 'geojson'

import type { Locale } from '@globalfishingwatch/api-types'
import { API_LOGIN_REQUIRED, VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import type { Bbox } from '@globalfishingwatch/data-transforms'
import { geoJSONToSegments, segmentsToBbox } from '@globalfishingwatch/data-transforms'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import {
  FIRST_YEAR_OF_DATA,
  IconButton,
  TrackFootprint,
  YearlyTransmissionsTimeline,
} from '@globalfishingwatch/ui-components'

import { PRIVATE_ICON } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { isPrivateDataset } from 'features/datasets/datasets.utils'
import { VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import { selectVesselsDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import I18nDate from 'features/i18n/i18nDate'
import I18nFlag from 'features/i18n/i18nFlag'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { getMapCoordinatesFromBounds, useMapFitBounds } from 'features/map/map-bounds.hooks'
import { selectSearchQuery } from 'features/search/search.config.selectors'
import { cleanVesselSearchResults } from 'features/search/search.slice'
import { getSearchVesselId } from 'features/search/search.utils'
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
import { getHighlightedText } from 'utils/text'

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
  const dispatch = useAppDispatch()
  const vesselDataviews = useSelector(selectVesselsDataviews)
  const isSmallScreen = useSmallScreen()
  const searchQuery = useSelector(selectSearchQuery)
  const isStandaloneSearchLocation = useSelector(selectIsStandaloneSearchLocation)
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
  const hasPositions = positionsCounter !== undefined && positionsCounter > 0

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
      return `${t('vessel.infoSources.both')} (${selfReportedIdentitiesSources.join(', ')})`
    if (registryIdentities.length) return t('vessel.infoSources.registry')
    if (selfReportedIdentities.length)
      return `${t('vessel.infoSources.selfReported')} (${isPrivateDataset(dataset) ? `${PRIVATE_ICON} ` : ''}${selfReportedIdentitiesSources.join(', ')})`
    return EMPTY_FIELD_PLACEHOLDER
  }, [t, vessel.identities, dataset])

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
  const isSelected = vesselsSelected?.some(
    (v) => getSearchVesselId(v) === getSearchVesselId(vessel)
  )
  let tooltip: string = t('search.selectVessel')
  if (isInWorkspace) {
    tooltip = t('search.vesselAlreadyInWorkspace')
  } else if (isSelected) {
    tooltip = t('search.vesselSelected')
  }
  const { onClick, ...itemProps } = getItemProps({ item: vessel, index })

  const vesselQuery = useMemo(() => {
    const query = isStandaloneSearchLocation
      ? { start: transmissionDateFrom, end: transmissionDateTo }
      : {}
    if (trackBbox) {
      const coordinates = getMapCoordinatesFromBounds(trackBbox)
      return { ...query, ...coordinates }
    }
    return query
  }, [isStandaloneSearchLocation, trackBbox, transmissionDateFrom, transmissionDateTo])

  const onVesselClick = useCallback(
    (e: MouseEvent) => {
      if (!e.ctrlKey && !e.shiftKey && !e.metaKey) {
        dispatch(cleanVesselSearchResults())
      }
      if (isStandaloneSearchLocation) {
        if (trackBbox) {
          fitBounds(trackBbox, { fitZoom: true })
        }
        setTimerange({ start: transmissionDateFrom, end: transmissionDateTo })
      }
    },
    [
      dispatch,
      fitBounds,
      isStandaloneSearchLocation,
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
              vesselId={id}
              identity={bestIdentityMatch}
              datasetId={dataset?.id}
              onClick={onVesselClick}
              query={vesselQuery}
              fitBounds={isStandaloneSearchLocation}
            >
              {getHighlightedText((name as string) || EMPTY_FIELD_PLACEHOLDER, searchQuery, styles)}
            </VesselLink>
            <span className={styles.secondary}>{otherNamesLabel}</span>
          </div>
          <div className={styles.properties}>
            <div className={styles.property}>
              <label>{t('vessel.flag')}</label>
              <span>
                <I18nFlag iso={flag} />
              </span>
            </div>
            <div className={styles.property}>
              <label>{t('vessel.mmsi')}</label>
              <span>
                {getHighlightedText(ssvid || EMPTY_FIELD_PLACEHOLDER, searchQuery, styles)}
              </span>
            </div>
            <div className={styles.property}>
              <label>{t('vessel.imo')}</label>
              <span>{getHighlightedText(imo || EMPTY_FIELD_PLACEHOLDER, searchQuery, styles)}</span>
            </div>
            <div className={styles.property}>
              <label>{t('vessel.callsign')}</label>
              <span>
                {getHighlightedText(callsign || EMPTY_FIELD_PLACEHOLDER, searchQuery, styles)}
              </span>
            </div>
            <div className={styles.property}>
              <label>{t('vessel.vesselType')}</label>
              <span>{getVesselShipTypeLabel({ shiptypes }) || EMPTY_FIELD_PLACEHOLDER}</span>
            </div>
            <div className={styles.property}>
              <label>{t('vessel.geartype')}</label>
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
                <label>{t('vessel.matricula')}</label>
                <span>{matricula}</span>
              </div>
            )}
            {nationalId && (
              <div className={styles.property}>
                <label>{t('vessel.nationalId')}</label>
                <span>{nationalId}</span>
              </div>
            )}
            {casco && (
              <div className={styles.property}>
                <label>{t('vessel.casco')}</label>
                <span>{casco}</span>
              </div>
            )}
            {fleet && (
              <div className={styles.property}>
                <label>{t('vessel.fleet')}</label>
                <span>{formatInfoField(fleet, 'fleet')}</span>
              </div>
            )}
            {origin && (
              <div className={styles.property}>
                <label>{t('vessel.origin')}</label>
                <span>{formatInfoField(origin, 'fleet')}</span>
              </div>
            )}
            {/* {dataset && (
                    <div className={styles.property}>
                      <label>{t('vessel.source')}</label>
                      <DatasetLabel dataset={dataset} />
                    </div>
                  )} */}
            {identitySource && (
              <div className={styles.property}>
                <label>
                  {t('vessel.infoSource')}
                  <DataTerminology title={t('vessel.infoSource')} terminologyKey="registryInfo" />
                </label>
                <span>{identitySource}</span>
              </div>
            )}
          </div>
          <div className={styles.properties}>
            {transmissionDateFrom && transmissionDateTo && (
              <div className={cx(styles.property, styles.fullWidth)}>
                <span>
                  {hasPositions
                    ? `${formatI18nNumber(positionsCounter)} ${t('vessel.transmission_other')} ${t('common.from')} `
                    : `${upperFirst(t('common.from'))} `}
                  <I18nDate date={transmissionDateFrom} /> {t('common.to')}{' '}
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
