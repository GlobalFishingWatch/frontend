import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { GetItemPropsOptions } from 'downshift'
import { Fragment, useCallback, useState } from 'react'
import { IconButton, YearlyTransmissionsTimeline } from '@globalfishingwatch/ui-components'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import { Locale } from '@globalfishingwatch/api-types'
import { FIRST_YEAR_OF_DATA } from 'data/config'
import { VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import i18n from 'features/i18n/i18n'
import I18nDate from 'features/i18n/i18nDate'
import I18nFlag from 'features/i18n/i18nFlag'
import { formatInfoField, EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { selectVesselsDataviews } from 'features/dataviews/dataviews.slice'
import TrackFootprint from 'features/search/TrackFootprint'
import { VesselWithDatasetsResolved, cleanVesselSearchResults } from 'features/search/search.slice'
import VesselLink from 'features/vessel/VesselLink'
import { useAppDispatch } from 'features/app/app.hooks'
import useAddVesselDataviewInstance from 'features/vessel/vessel.hooks'
import { selectCurrentWorkspaceId } from 'features/workspace/workspace.selectors'
import styles from './SearchBasicResults.module.css'

type SearchBasicResultsProps = {
  searchResults: VesselWithDatasetsResolved[]
  highlightedIndex: number
  setHighlightedIndex: (index: number) => void
  getItemProps: (options: GetItemPropsOptions<VesselWithDatasetsResolved>) => any
  vesselsSelected: VesselWithDatasetsResolved[]
}

function SearchBasicResults({
  searchResults,
  highlightedIndex,
  setHighlightedIndex,
  getItemProps,
  vesselsSelected,
}: SearchBasicResultsProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const workspaceId = useSelector(selectCurrentWorkspaceId)
  const vesselDataviews = useSelector(selectVesselsDataviews)
  const isSmallScreen = useSmallScreen()
  const [highlightedYear, setHighlightedYear] = useState<number>()
  const addVesselDataviewInstance = useAddVesselDataviewInstance()

  const onVesselClick = useCallback(
    (vessel: VesselWithDatasetsResolved) => {
      if (workspaceId) {
        addVesselDataviewInstance(vessel)
      }
      dispatch(cleanVesselSearchResults())
    },
    [addVesselDataviewInstance, dispatch, workspaceId]
  )

  const onYearHover = useCallback(
    (year: number) => {
      if (!isSmallScreen) {
        setHighlightedYear(year)
      }
    },
    [isSmallScreen]
  )

  return (
    <Fragment>
      {searchResults?.map((entry, index: number) => {
        const {
          id,
          dataset,
          trackDatasetId,
          shipname,
          flag,
          ssvid,
          imo,
          callsign,
          geartype,
          shiptype,
          transmissionDateFrom,
          transmissionDateTo,
          infoSource,
        } = entry
        // TODO decide how we manage VMS properties
        const { fleet, origin, casco, nationalId, matricula } = entry as any
        const shiptypes = shiptype?.split('|').map((shiptype) => shiptype.toLowerCase())
        const geartypes = geartype?.split('|').map((geartype) => geartype.toLowerCase())
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
        const { onClick, ...itemProps } = getItemProps({ item: entry, index })
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
          >
            <div className={styles.container}>
              <IconButton
                onClick={isInWorkspace ? undefined : onClick}
                icon={isSelected || isInWorkspace ? 'tick' : undefined}
                type="border"
                className={cx({ [styles.selectedIcon]: isSelected || isInWorkspace })}
                size="tiny"
                tooltip={tooltip}
              />
              <div className={styles.fullWidth}>
                <div className={styles.name}>
                  <VesselLink
                    vesselId={id}
                    datasetId={dataset?.id}
                    onClick={() => onVesselClick(entry)}
                  >
                    {formatInfoField(shipname, 'name') || EMPTY_FIELD_PLACEHOLDER}
                  </VesselLink>
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
                      {shiptypes
                        ?.map((shiptype) => t(`vessel.vesselTypes.${shiptype}` as any, shiptype))
                        .join(', ') || EMPTY_FIELD_PLACEHOLDER}
                    </span>
                  </div>
                  <div className={styles.property}>
                    <label>{t('vessel.geartype', 'Gear Type')}</label>
                    <span>
                      {geartypes
                        ?.map((geartype) => t(`vessel.gearTypes.${geartype}` as any, geartype))
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
                  {infoSource && (
                    <div className={styles.property}>
                      <label>{t('vessel.infoSource', 'Info Source')}</label>
                      <span>{t(`vessel.infoSources.${infoSource}` as any, infoSource)}</span>
                    </div>
                  )}
                </div>
                <div className={styles.properties}>
                  {transmissionDateFrom && transmissionDateTo && (
                    <div className={cx(styles.property, styles.fullWidth)}>
                      <span>
                        {t('common.active', 'Active')} {t('common.from', 'from')}{' '}
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
                  vesselId={id}
                  trackDatasetId={trackDatasetId}
                  highlightedYear={highlightedYear}
                />
              )}
            </div>
          </li>
        )
      })}
    </Fragment>
  )
}

export default SearchBasicResults
