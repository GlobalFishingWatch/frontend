import cx from 'classnames'
import { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { GetItemPropsOptions } from 'downshift'
import { FeatureCollection } from 'geojson'
import { Locale } from '@globalfishingwatch/api-types'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import {
  YearlyTransmissionsTimeline,
  FIRST_YEAR_OF_DATA,
  IconButton,
} from '@globalfishingwatch/ui-components'
import { Bbox, geoJSONToSegments, segmentsToBbox } from '@globalfishingwatch/data-transforms'
import { VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import I18nDate from 'features/i18n/i18nDate'
import I18nFlag from 'features/i18n/i18nFlag'
import TrackFootprint from 'features/search/TrackFootprint'
import { VesselLastIdentity, cleanVesselSearchResults } from 'features/search/search.slice'
import VesselLink from 'features/vessel/VesselLink'
import useAddVesselDataviewInstance from 'features/vessel/vessel.hooks'
import { formatInfoField, EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectVesselsDataviews } from 'features/dataviews/dataviews.slice'
import { selectCurrentWorkspaceId } from 'features/workspace/workspace.selectors'
import { getMapCoordinatesFromBounds, useMapFitBounds } from 'features/map/map-viewport.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { selectIsStandaloneSearchLocation } from 'routes/routes.selectors'
import {
  getRelatedIdentityVesselIds,
  getSelfReportedVesselIdentityResolved,
  getVesselIdentityProperties,
} from 'features/vessel/vessel.utils'
import { IdentityVesselData } from 'features/vessel/vessel.slice'
import useMapInstance from 'features/map/map-context.hooks'
import { formatI18nNumber } from 'features/i18n/i18nNumber'
import { VesselIdentitySourceEnum } from 'features/search/search.config'
import DataTerminology from 'features/vessel/identity/DataTerminology'
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
  const map = useMapInstance()
  const dispatch = useAppDispatch()
  const workspaceId = useSelector(selectCurrentWorkspaceId)
  const vesselDataviews = useSelector(selectVesselsDataviews)
  const isSmallScreen = useSmallScreen()
  const isSearchLocation = useSelector(selectIsStandaloneSearchLocation)
  const [highlightedYear, setHighlightedYear] = useState<number>()
  const [trackBbox, setTrackBbox] = useState<Bbox>()
  const addVesselDataviewInstance = useAddVesselDataviewInstance()
  const fitBounds = useMapFitBounds()
  const { setTimerange } = useTimerangeConnect()

  const { dataset, track } = vessel
  const vesselData = getSelfReportedVesselIdentityResolved(vessel)
  const {
    id,
    flag,
    ssvid,
    imo,
    callsign,
    geartype,
    shiptype,
    transmissionDateFrom,
    transmissionDateTo,
    messagesCounter,
  } = vesselData
  const [shipname, ...names] = getVesselIdentityProperties(vessel, 'shipname')
  const name = shipname ? formatInfoField(shipname, 'name') : EMPTY_FIELD_PLACEHOLDER

  const identitySource = useMemo(() => {
    const hasRegistryIdentity = vessel.identities.some(
      ({ identitySource }) => identitySource === VesselIdentitySourceEnum.Registry
    )
    const hasSelfReportedIdentity = vessel.identities.some(
      ({ identitySource }) => identitySource === VesselIdentitySourceEnum.SelfReported
    )
    if (hasRegistryIdentity && hasSelfReportedIdentity)
      return t('vessel.infoSources.both', 'Registry and self reported')
    if (hasRegistryIdentity) return t('vessel.infoSources.registry', 'Registry')
    if (hasSelfReportedIdentity) return t('vessel.infoSources.self-reported', 'Self reported')
    return ''
  }, [t, vessel.identities])

  const selfReportedVesselIds = useMemo(() => {
    return [vessel.id, ...getRelatedIdentityVesselIds(vessel)]
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
  const { onClick, ...itemProps } = getItemProps({ item: vessel, index })

  const vesselQuery = useMemo(() => {
    const query = { start: transmissionDateFrom, end: transmissionDateTo }
    if (trackBbox) {
      const coordinates = getMapCoordinatesFromBounds(map, trackBbox)
      return { ...query, ...coordinates }
    }
    return query
  }, [map, trackBbox, transmissionDateFrom, transmissionDateTo])

  const onVesselClick = useCallback(
    (vessel: VesselLastIdentity) => {
      if (workspaceId) {
        addVesselDataviewInstance(vessel)
      }
      dispatch(cleanVesselSearchResults())
      if (isSearchLocation) {
        if (trackBbox) {
          fitBounds(trackBbox)
        }
        setTimerange({ start: transmissionDateFrom, end: transmissionDateTo })
      }
    },
    [
      addVesselDataviewInstance,
      dispatch,
      fitBounds,
      isSearchLocation,
      setTimerange,
      trackBbox,
      transmissionDateFrom,
      transmissionDateTo,
      workspaceId,
    ]
  )

  const onYearHover = useCallback(
    (year: number) => {
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
      className={cx(styles.searchResult, {
        [styles.highlighted]: highlightedIndex === index,
        [styles.inWorkspace]: isInWorkspace,
        [styles.selected]: isSelected,
      })}
      key={`${index} - ${dataset?.id} - ${id}`}
      data-test={`search-vessels-option-${id}-${index}`}
      onClick={isInWorkspace ? undefined : onClick}
    >
      <div className={styles.container}>
        <IconButton
          icon={isSelected || isInWorkspace ? 'tick' : undefined}
          type="border"
          className={cx({ [styles.selectedIcon]: isSelected || isInWorkspace })}
          size="tiny"
          tooltip={tooltip}
        />
        <div className={styles.fullWidth}>
          <div className={styles.name} data-test="vessel-name">
            <VesselLink
              vesselId={id}
              datasetId={dataset?.id}
              onClick={() => onVesselClick(vesselData)}
              query={vesselQuery}
            >
              {name}
            </VesselLink>
            <span className={styles.secondary}>
              {names?.length > 0 &&
                ` (${t('common.previously', 'Previously')}: ${names
                  .map((name) => formatInfoField(name, 'name'))
                  .join(', ')})`}
            </span>
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
              <span>
                {shiptype
                  ? t(`vessel.vesselTypes.${shiptype.toLowerCase()}` as any, shiptype)
                  : EMPTY_FIELD_PLACEHOLDER}
              </span>
            </div>
            <div className={styles.property}>
              <label>{t('vessel.geartype', 'Gear Type')}</label>
              <span>
                {geartype
                  ?.map((geartype) =>
                    t(`vessel.gearTypes.${geartype.toLowerCase()}` as any, geartype)
                  )
                  .join(', ') || EMPTY_FIELD_PLACEHOLDER}
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
                    size="tiny"
                    type="default"
                    title={t('vessel.infoSource', 'Info Source')}
                  >
                    {t('vessel.terminology.infoSource', 'Info source terminology')}
                  </DataTerminology>
                </label>
                <span>{identitySource}</span>
              </div>
            )}
          </div>
          <div className={styles.properties}>
            {transmissionDateFrom && transmissionDateTo && (
              <div className={cx(styles.property, styles.fullWidth)}>
                <span>
                  {messagesCounter && messagesCounter > 0 && formatI18nNumber(messagesCounter)}{' '}
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
