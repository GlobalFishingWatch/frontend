import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { GetItemPropsOptions } from 'downshift'
import { Fragment } from 'react'
import { FIRST_YEAR_OF_DATA } from 'data/config'
import DatasetLabel from 'features/datasets/DatasetLabel'
import { VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import i18n from 'features/i18n/i18n'
import I18nDate from 'features/i18n/i18nDate'
import I18nFlag from 'features/i18n/i18nFlag'
import { formatInfoField, EMPTY_FIELD_PLACEHOLDER } from 'utils/info'
import { selectVesselsDataviews } from 'features/dataviews/dataviews.slice'
import { VesselWithDatasets } from 'features/search/search.slice'
import { Locale } from '../../../../libs/api-types/src/i18n'
import { Icon } from '../../../../libs/ui-components/src/icon'
import { TransmissionsTimeline } from '../../../../libs/ui-components/src/transmissions-timeline'
import styles from './SearchResults.module.css'

type SearchResultsProps = {
  searchResults: VesselWithDatasets[]
  highlightedIndex: number
  getItemProps: (options: GetItemPropsOptions<VesselWithDatasets>) => VesselWithDatasets
  vesselsSelected: VesselWithDatasets[]
}

function SearchResults({
  searchResults,
  highlightedIndex,
  getItemProps,
  vesselsSelected,
}: SearchResultsProps) {
  const { t } = useTranslation()
  const vesselDataviews = useSelector(selectVesselsDataviews)
  return (
    <Fragment>
      {searchResults?.map((entry, index: number) => {
        const {
          id,
          shipname,
          flag,
          fleet,
          mmsi,
          imo,
          callsign,
          geartype,
          origin,
          casco,
          nationalId,
          matricula,
          dataset,
          firstTransmissionDate,
          lastTransmissionDate,
        } = entry
        const isInWorkspace = vesselDataviews?.some(
          (vessel) => vessel.id === `${VESSEL_LAYER_PREFIX}${id}`
        )
        const isSelected = vesselsSelected?.some((vessel) => vessel.id === id)
        return (
          <li
            {...getItemProps({ item: entry, index })}
            className={cx(styles.searchResult, {
              [styles.highlighted]: highlightedIndex === index,
              [styles.inWorkspace]: isInWorkspace,
              [styles.selected]: isSelected,
            })}
            key={`${id}-${index}`}
          >
            <div className={styles.name}>
              {formatInfoField(shipname, 'name') || EMPTY_FIELD_PLACEHOLDER}
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
                <span>{mmsi || EMPTY_FIELD_PLACEHOLDER}</span>
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
                <label>{t('vessel.geartype', 'Gear Type')}</label>
                <span>
                  {geartype !== undefined
                    ? t(`vessel.gearTypes.${geartype}` as any, EMPTY_FIELD_PLACEHOLDER)
                    : EMPTY_FIELD_PLACEHOLDER}
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
              {firstTransmissionDate && lastTransmissionDate && (
                <div className={cx(styles.property, styles.fullWidth)}>
                  <label>{t('vessel.transmission_other', 'Transmissions')}</label>
                  <span>
                    from <I18nDate date={firstTransmissionDate} /> to{' '}
                    <I18nDate date={lastTransmissionDate} />
                  </span>
                  <TransmissionsTimeline
                    firstTransmissionDate={firstTransmissionDate}
                    lastTransmissionDate={lastTransmissionDate}
                    firstYearOfData={FIRST_YEAR_OF_DATA}
                    locale={i18n.language as Locale}
                  />
                </div>
              )}
              {dataset && (
                <div className={styles.property}>
                  <label>{t('vessel.source', 'Source')}</label>
                  <DatasetLabel dataset={dataset} />
                </div>
              )}
            </div>
            {isSelected && (
              <span className={styles.alreadyAddedMsg}>
                <Icon icon="tick" />
                {t('search.vesselSelected', 'Vessel selected')}
              </span>
            )}
            {isInWorkspace && (
              <span className={styles.alreadyAddedMsg}>
                <Icon icon="tick" />
                {t('search.vesselAlreadyInWorkspace', 'This vessel is already in your workspace')}
              </span>
            )}
          </li>
        )
      })}
    </Fragment>
  )
}

export default SearchResults
