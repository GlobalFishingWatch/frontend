import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Modal } from '@globalfishingwatch/ui-components'

import { DEFAULT_VESSEL_MAP_ZOOM } from 'data/config'
import DateRangeLabel from 'features/date-range-label/date-range-label'
import { formatI18nSpecialDate } from 'features/i18n/i18nDate'
import useMapEvents from 'features/map/map-events.hooks'
import useViewport from 'features/map/map-viewport.hooks'
import ActivityModalContent from 'features/profile/components/activity/ActivityModalContent'
import AisCoverage from 'features/profile/components/activity/AisCoverage'
import RiskIdentityFlagsOnMouIndicator from 'features/risk-identity-flags-on-mou-indicator/risk-identity-flags-on-mou-indicator'
import RiskIdentityIndicator from 'features/risk-identity-indicator/risk-identity-indicator'
import RiskIndicator from 'features/risk-indicator/risk-indicator'
import useRiskIndicator from 'features/risk-indicator/risk-indicator.hook'
import {
  selectIndicatorsRequests,
  selectIndicatorsStatus,
} from 'features/risk-indicator/risk-indicator.slice'
import RiskIuuIndicator from 'features/risk-iuu-indicator/risk-iuu-indicator'
import RiskSection from 'features/risk-section/risk-section'
import TerminologyAisDisabling from 'features/terminology/terminology-ais-disabling'
import TerminologyEncounterEvents from 'features/terminology/terminology-encounter-events'
import TerminologyFishingEvents from 'features/terminology/terminology-fishing-events'
import TerminologyIuu from 'features/terminology/terminology-iuu'
import TerminologyLoiteringEvents from 'features/terminology/terminology-loitering-events'
import TerminologyPortVisitEvents from 'features/terminology/terminology-port-visit-events'
import TerminologyRiskIdentity from 'features/terminology/terminology-risk-identity'
import { useUser } from 'features/user/user.hooks'
import type { RenderedEvent } from 'features/vessels/activity/vessels-activity.selectors'
import { IndicatorType } from 'types/risk-indicator'
import { VesselFieldLabel } from 'types/vessel'
import type { Voyage } from 'types/voyage';
import { EventTypeVoyage } from 'types/voyage'

import styles from './risk-summary.module.css'

export interface RiskSummaryProps {
  onMoveToMap?: () => void
}

export function RiskSummary(props: RiskSummaryProps) {
  const { t } = useTranslation()
  const { authorizedIdentityIndicators: showIdentityIndicators } = useUser()
  const {
    coverage,
    encountersInForeignEEZ,
    encountersInMPA,
    encountersInRFMOWithoutAuthorization,
    encountersRFMOsAreasWithoutAuthorization,
    eventsLoading,
    fishingInMPA,
    fishingInRFMOWithoutAuthorization,
    fishingRFMOsAreasWithoutAuthorization,
    gapsIntentionalDisabling,
    indicatorsLoading,
    iuuBlacklisted,
    loiteringInMPA,
    portVisitsToNonPSMAPortState,
    vesselFlagsOnMOU,
    flagsHistory,
    namesHistory,
    ownersHistory,
    operatorsHistory,
    uniqueFlags,
    uniqueNames,
    uniqueOperators,
    uniqueOwners,
    vessel,
  } = useRiskIndicator(showIdentityIndicators)
  const { highlightEvent } = useMapEvents()
  const { viewport, setMapCoordinates } = useViewport()

  const [isModalOpen, setIsOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<RenderedEvent>()
  const openModal = useCallback((event: RenderedEvent) => {
    setSelectedEvent(event)
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => setIsOpen(false), [])
  const indicatorsLoadingList = useSelector(selectIndicatorsRequests)

  const onEventMapClick = useCallback(
    (event: RenderedEvent | Voyage) => {
      if (event.type !== EventTypeVoyage.Voyage) {
        highlightEvent(event)

        setMapCoordinates({
          latitude: event.position.lat,
          longitude: event.position.lon,
          zoom: viewport.zoom ?? DEFAULT_VESSEL_MAP_ZOOM,
          bearing: 0,
          pitch: 0,
        })
      }

      props.onMoveToMap && props.onMoveToMap()
    },
    [highlightEvent, props, setMapCoordinates, viewport.zoom]
  )
  const hasEncountersInForeignEEZs = encountersInForeignEEZ.length > 0
  const hasEncountersInMPAs = encountersInMPA.length > 0
  const hasEncountersInRFMOWithoutAuthorization = encountersInRFMOWithoutAuthorization.length > 0
  const encountersRFMOsWithoutAuth = useMemo(
    () => encountersRFMOsAreasWithoutAuthorization.join(', '),
    [encountersRFMOsAreasWithoutAuthorization]
  )

  const hasFishingInMPAs = fishingInMPA.length > 0
  const hasFishingInRFMOWithoutAuthorization = fishingInRFMOWithoutAuthorization.length > 0
  const fishingRFMOsWithoutAuth = useMemo(
    () => fishingRFMOsAreasWithoutAuthorization.join(', '),
    [fishingRFMOsAreasWithoutAuthorization]
  )
  const hasGapsIntentionalDisabling = gapsIntentionalDisabling.length > 0
  const hasLoiteringInMPAs = loiteringInMPA.length > 0
  const hasPortVisitsToNonPSMAPortState = portVisitsToNonPSMAPortState.length > 0

  const hasVesselFlagsOnMOU = vesselFlagsOnMOU.length > 0
  const hasChangedFlags = uniqueFlags.length > 1
  const hasChangedNames = uniqueNames.length > 1
  const hasChangedOperators = uniqueOperators.length > 1
  const hasChangedOwners = uniqueOwners.length > 1
  const coverageLevel = useMemo(() => {
    if (!coverage?.percentage) {
      return 'none'
    }
    if (coverage.percentage < 33) {
      return 'high'
    }
    if (coverage.percentage < 66) {
      return 'medium'
    }
    return 'low'
  }, [coverage])
  const vesselFlagsPerMOU = useMemo(
    () => Array.from(new Set(vesselFlagsOnMOU.map((item) => item.name))),
    [vesselFlagsOnMOU]
  )

  const hasIUUIndicators = iuuBlacklisted

  // I think this is not more necessary as every section has its own spinner
  // if (eventsLoading || indicatorsLoading) return <Spinner className={styles.spinnerFull} />
  const hasEncountersIndicators =
    hasEncountersInMPAs || hasEncountersInForeignEEZs || hasEncountersInRFMOWithoutAuthorization
  const hasFishingIndicators = hasFishingInMPAs || hasFishingInRFMOWithoutAuthorization

  const isSectionLoading = useCallback(
    (indicator) => {
      return indicatorsLoadingList.some((requestId) => requestId.includes(indicator))
    },
    [indicatorsLoadingList]
  )

  return (
    <div className={styles['container']}>
      <RiskSection severity={coverageLevel} loading={false}>
        <div className={styles.heading}>
          <AisCoverage value={coverage?.percentage} className={styles.aisCoverage} />
          <div className={styles.headingButtons}>
            <DateRangeLabel type="secondary" className={styles.filterBtn} />
          </div>
        </div>
      </RiskSection>
      {hasIUUIndicators && (
        <RiskSection
          severity="high"
          title={t('event.iuu', 'iuu')}
          loading={isSectionLoading(IndicatorType.vesselIdentity)}
          titleInfo={<TerminologyIuu />}
        >
          <RiskIuuIndicator
            title={
              t(
                'risk.currentlyPresentOnARfmoIUUList',
                'Vessel is currently present on an RFMO IUU blacklist'
              ) as string
            }
            subtitle={`(${
              vessel.iuuListing.source +
              ' ' +
              formatI18nSpecialDate({
                date: vessel.iuuListing.originalFirstSeen,
                format: { year: 'numeric' },
              })
            })`}
            history={vessel.history.iuuListing?.byDate}
            field={VesselFieldLabel.iuuStatus}
            vesselName={vessel.shipname}
          />
        </RiskSection>
      )}
      {hasGapsIntentionalDisabling && (
        <RiskSection
          icon="event-gap"
          severity="medium"
          title={t('risk.aisDisabling', 'AIS Disabling')}
          titleInfo={<TerminologyAisDisabling />}
          loading={isSectionLoading(IndicatorType.gap)}
        >
          <RiskIndicator
            title={
              t(
                'risk.likelyIntentionalDisablingEvent',
                '{{count}} likely intentional disabling events',
                {
                  count: gapsIntentionalDisabling.length,
                }
              ) as string
            }
            subtitle={' '}
            section="gaps"
            events={gapsIntentionalDisabling}
            onEventInfoClick={openModal}
            onEventMapClick={onEventMapClick}
          ></RiskIndicator>
        </RiskSection>
      )}
      {hasFishingIndicators && (
        <RiskSection
          icon="event-fishing"
          severity="medium"
          title={t('event.fishing', 'fishing')}
          titleInfo={<TerminologyFishingEvents />}
          loading={isSectionLoading(IndicatorType.fishing)}
        >
          {hasFishingInRFMOWithoutAuthorization && (
            <RiskIndicator
              title={
                t(
                  'risk.fishingEventInRFMOWithoutAuthorization',
                  '{{count}} fishing event outside known authorised area',
                  {
                    count: fishingInRFMOWithoutAuthorization.length,
                  }
                ) as string
              }
              section="fishing-rmfo"
              // The list of regions will be visible once the dataset (proto)
              // that includes events authorizations is used to get the resources
              subtitle={!!fishingRFMOsWithoutAuth && `(${fishingRFMOsWithoutAuth})`}
              events={fishingInRFMOWithoutAuthorization}
              onEventInfoClick={openModal}
              onEventMapClick={onEventMapClick}
            ></RiskIndicator>
          )}
          {hasFishingInMPAs && (
            <RiskIndicator
              title={
                t('risk.fishingEventInMPA', 'fishing event in a MPA', {
                  count: fishingInMPA.length,
                }) as string
              }
              section="fishing-mpa"
              events={fishingInMPA}
              onEventInfoClick={openModal}
              onEventMapClick={onEventMapClick}
            ></RiskIndicator>
          )}
        </RiskSection>
      )}
      {hasEncountersIndicators && (
        <RiskSection
          icon="event-encounter"
          severity="medium"
          title={t('event.encounter', 'encounter', { count: 2 })}
          titleInfo={<TerminologyEncounterEvents />}
          loading={isSectionLoading(IndicatorType.encounter)}
        >
          {hasEncountersInRFMOWithoutAuthorization && (
            <RiskIndicator
              title={
                t(
                  'risk.encounterEventInRFMOWithoutAuthorization',
                  '{{count}} encounter outside known authorised area',
                  {
                    count: encountersInRFMOWithoutAuthorization.length,
                  }
                ) as string
              }
              section="encounters"
              // The list of regions will be visible once the dataset (proto)
              // that includes events authorizations is used to get the resources
              subtitle={!!encountersRFMOsWithoutAuth && `(${encountersRFMOsWithoutAuth})`}
              events={encountersInRFMOWithoutAuthorization}
              onEventInfoClick={openModal}
              onEventMapClick={onEventMapClick}
            ></RiskIndicator>
          )}
          {hasEncountersInMPAs && (
            <RiskIndicator
              title={
                t('risk.encounterEventInMPA', 'encounters in a MPA', {
                  count: encountersInMPA.length,
                }) as string
              }
              section="encounters-mpa"
              events={encountersInMPA}
              onEventInfoClick={openModal}
              onEventMapClick={onEventMapClick}
            ></RiskIndicator>
          )}
          {hasEncountersInForeignEEZs && (
            <RiskIndicator
              title={
                t('risk.encounterEventInForeignEEZ', 'encounters in a foreign EEZ', {
                  count: encountersInForeignEEZ.length,
                }) as string
              }
              section="encounters-eez"
              events={encountersInForeignEEZ}
              onEventInfoClick={openModal}
              onEventMapClick={onEventMapClick}
            ></RiskIndicator>
          )}
        </RiskSection>
      )}
      {hasLoiteringInMPAs && (
        <RiskSection
          icon="event-loitering"
          severity="medium"
          title={t('event.loitering', 'loitering')}
          titleInfo={<TerminologyLoiteringEvents />}
          loading={eventsLoading}
        >
          <RiskIndicator
            title={
              t('risk.loiteringEventInMPA', 'loitering event in a MPA', {
                count: loiteringInMPA.length,
              }) as string
            }
            section="loitering-mpa"
            events={loiteringInMPA}
            onEventInfoClick={openModal}
            onEventMapClick={onEventMapClick}
          ></RiskIndicator>
        </RiskSection>
      )}
      {hasPortVisitsToNonPSMAPortState && (
        <RiskSection
          icon="event-port_visit"
          severity="medium"
          title={t('event.portVisitEvents', 'Port Visits')}
          titleInfo={<TerminologyPortVisitEvents />}
          loading={isSectionLoading(IndicatorType.portVisit)}
        >
          <RiskIndicator
            title={
              t(
                'risk.portVisitsToNonPSMAPortState',
                '{{count}} visits to a port in a country that has not ratified the PSMA state',
                {
                  count: portVisitsToNonPSMAPortState.length / 3,
                }
              ) as string
            }
            section="port-visits"
            events={portVisitsToNonPSMAPortState}
            onEventInfoClick={openModal}
            onEventMapClick={onEventMapClick}
          ></RiskIndicator>
        </RiskSection>
      )}
      {(hasVesselFlagsOnMOU ||
        hasChangedFlags ||
        (showIdentityIndicators &&
          (hasChangedOwners || hasChangedNames || hasChangedOperators))) && (
        <RiskSection
          severity="medium"
          title={t('risk.identity', 'Identity')}
          titleInfo={<TerminologyRiskIdentity />}
          loading={isSectionLoading(IndicatorType.vesselIdentity)}
        >
          {vesselFlagsPerMOU.map((mou, index) => (
            <RiskIdentityFlagsOnMouIndicator
              key={`${mou}-${index}`}
              name={mou}
              flags={vesselFlagsOnMOU
                .filter((item) => item.name === mou)
                .map((item) => item.flags)
                .flat()}
              vesselName={vessel.shipname}
              flagsHistory={flagsHistory}
            ></RiskIdentityFlagsOnMouIndicator>
          ))}
          {showIdentityIndicators && hasChangedOwners && (
            <RiskIdentityIndicator
              field={VesselFieldLabel.owner}
              history={ownersHistory}
              title={
                t('risk.identityChangedOwners', '{{count}} owner change', {
                  count: uniqueOwners.length - 1,
                }) as string
              }
              subtitle={`(${uniqueOwners.join(', ')})`}
              vesselName={vessel.shipname}
            />
          )}
          {showIdentityIndicators && hasChangedOperators && (
            <RiskIdentityIndicator
              field={VesselFieldLabel.operator}
              history={operatorsHistory}
              title={
                t('risk.identityChangedOperators', '{{count}} operator change', {
                  count: uniqueOperators.length - 1,
                }) as string
              }
              subtitle={`(${uniqueOperators.join(', ')})`}
              vesselName={vessel.shipname}
            />
          )}
          {hasChangedFlags && (
            <RiskIdentityIndicator
              field={VesselFieldLabel.flag}
              history={flagsHistory}
              title={
                t('risk.identityChangedFlags', '{{count}} flag change', {
                  count: uniqueFlags.length - 1,
                }) as string
              }
              subtitle={`(${uniqueFlags.join(', ')})`}
              vesselName={vessel.shipname}
            />
          )}
          {showIdentityIndicators && hasChangedNames && (
            <RiskIdentityIndicator
              field={VesselFieldLabel.name}
              history={namesHistory}
              title={
                t('risk.identityChangedNames', '{{count}} name change', {
                  count: uniqueNames.length - 1,
                }) as string
              }
              subtitle={`(${uniqueNames.join(', ')})`}
              vesselName={vessel.shipname}
            />
          )}
        </RiskSection>
      )}
      {(!hasFishingIndicators ||
        !hasEncountersIndicators ||
        !hasLoiteringInMPAs ||
        !hasPortVisitsToNonPSMAPortState ||
        !hasVesselFlagsOnMOU ||
        !hasIUUIndicators ||
        !hasGapsIntentionalDisabling) && (
        <RiskSection
          severity="none"
          title={t('risk.noRiskDetected', 'No risk detected') as string}
          loading={false}
        >
          {!hasGapsIntentionalDisabling && (
            <RiskSection
              icon="event-gap"
              className={styles.naSubSection}
              title={t('risk.aisDisabling', 'AIS Disabling')}
              loading={isSectionLoading(IndicatorType.vesselIdentity)}
            >
              {!hasGapsIntentionalDisabling && (
                <RiskIndicator
                  title={
                    t(
                      'risk.noIntentionalDisablingEvents',
                      'No intentional disabling events detected'
                    ) as string
                  }
                ></RiskIndicator>
              )}
            </RiskSection>
          )}
          {!hasIUUIndicators && (
            <RiskSection
              className={styles.naSubSection}
              title={t('event.iuu', 'iuu')}
              loading={isSectionLoading(IndicatorType.vesselIdentity)}
            >
              {!hasIUUIndicators && (
                <RiskIndicator
                  title={
                    iuuBlacklisted === false
                      ? (t(
                          'risk.notPresentOnARFMOIUUList',
                          'The vessel is not present on an RFMO IUU blacklist'
                        ) as string)
                      : (t(
                          'risk.undeterminedPresenceOnARFMOIUUList',
                          'Unable to determine if the vessel is present on a RFMO IUU list or not'
                        ) as string)
                  }
                ></RiskIndicator>
              )}
            </RiskSection>
          )}
          {(!hasFishingInMPAs || !hasFishingInRFMOWithoutAuthorization) && (
            <RiskSection
              className={styles.naSubSection}
              icon="event-fishing"
              title={t('event.fishing', 'fishing')}
              loading={isSectionLoading(IndicatorType.fishing) || eventsLoading}
            >
              {!hasFishingInRFMOWithoutAuthorization && (
                <RiskIndicator
                  title={
                    t(
                      'risk.noFishingEventInRFMOWithoutAuthorization',
                      'No fishing event detected outside known authorised areas'
                    ) as string
                  }
                  events={fishingInRFMOWithoutAuthorization}
                  onEventInfoClick={openModal}
                  onEventMapClick={onEventMapClick}
                ></RiskIndicator>
              )}
              {!hasFishingInMPAs && (
                <RiskIndicator
                  title={
                    t('risk.noFishingEventInMPA', 'No fishing event detected in an MPA') as string
                  }
                  events={fishingInMPA}
                  onEventInfoClick={openModal}
                  onEventMapClick={onEventMapClick}
                ></RiskIndicator>
              )}
            </RiskSection>
          )}
          {(!hasEncountersInMPAs ||
            !hasEncountersInForeignEEZs ||
            !hasEncountersInRFMOWithoutAuthorization) && (
            <RiskSection
              icon="event-encounter"
              className={styles.naSubSection}
              title={t('event.encounter', 'encounter', { count: 2 })}
              loading={isSectionLoading(IndicatorType.encounter) || eventsLoading}
            >
              {!hasEncountersInRFMOWithoutAuthorization && (
                <RiskIndicator
                  title={
                    t(
                      'risk.noEncounterEventInRFMOWithoutAuthorization',
                      'No encounters detected outside known authorised areas'
                    ) as string
                  }
                  events={encountersInRFMOWithoutAuthorization}
                  onEventInfoClick={openModal}
                  onEventMapClick={onEventMapClick}
                ></RiskIndicator>
              )}
              {!hasEncountersInMPAs && (
                <RiskIndicator
                  title={
                    t('risk.noEncounterEventInMPA', 'No encounters detected in an MPA') as string
                  }
                  events={encountersInMPA}
                  onEventInfoClick={openModal}
                  onEventMapClick={onEventMapClick}
                ></RiskIndicator>
              )}
              {!hasEncountersInForeignEEZs && (
                <RiskIndicator
                  title={
                    t(
                      'risk.noEncounterEventInForeignEEZ',
                      'No encounters detected in foreign EEZ'
                    ) as string
                  }
                  events={encountersInForeignEEZ}
                  onEventInfoClick={openModal}
                  onEventMapClick={onEventMapClick}
                ></RiskIndicator>
              )}
            </RiskSection>
          )}
          {!hasLoiteringInMPAs && (
            <RiskSection
              icon="event-loitering"
              className={styles.naSubSection}
              title={t('event.loitering', 'loitering')}
              loading={eventsLoading}
            >
              <RiskIndicator
                title={
                  t('risk.noLoiteringEventInMPA', 'No loitering event detected in an MPA') as string
                }
                events={loiteringInMPA}
                onEventInfoClick={openModal}
                onEventMapClick={onEventMapClick}
              ></RiskIndicator>
            </RiskSection>
          )}
          {!hasPortVisitsToNonPSMAPortState && (
            <RiskSection
              icon="event-port_visit"
              className={styles.naSubSection}
              title={t('event.portVisitEvents', 'Port Visits')}
              loading={isSectionLoading(IndicatorType.portVisit) || eventsLoading}
            >
              <RiskIndicator
                title={
                  t(
                    'risk.noPortVisitsToNonPSMAPortState',
                    'No visit to a port in a country that has not ratified the PSMA state detected'
                  ) as string
                }
                events={portVisitsToNonPSMAPortState}
                onEventInfoClick={openModal}
                onEventMapClick={onEventMapClick}
              ></RiskIndicator>
            </RiskSection>
          )}
          {(!hasVesselFlagsOnMOU ||
            !hasChangedFlags ||
            (showIdentityIndicators &&
              (!hasChangedOwners || !hasChangedNames || !hasChangedOperators))) && (
            <RiskSection
              className={styles.naSubSection}
              title={t('risk.identity', 'Identity')}
              loading={isSectionLoading(IndicatorType.vesselIdentity)}
            >
              {!hasVesselFlagsOnMOU && (
                <RiskIndicator
                  title={
                    t(
                      'risk.noVesselFlagsOnMOU',
                      "The vessel's flag(s) are not listed on either the Paris or Tokyo MOU black or grey list"
                    ) as string
                  }
                ></RiskIndicator>
              )}
              {showIdentityIndicators && !hasChangedOwners && (
                <RiskIndicator
                  title={t('risk.noOwnerChanges', 'The vessel did not changed owners') as string}
                ></RiskIndicator>
              )}
              {showIdentityIndicators && !hasChangedOperators && (
                <RiskIndicator
                  title={
                    t('risk.noOperatorChanges', 'The vessel did not changed operators') as string
                  }
                ></RiskIndicator>
              )}
              {!hasChangedFlags && (
                <RiskIndicator
                  title={t('risk.noFlagChanges', 'The vessel did not changed flags') as string}
                ></RiskIndicator>
              )}
              {showIdentityIndicators && !hasChangedNames && (
                <RiskIndicator
                  title={t('risk.noNameChanges', 'The vessel did not changed names') as string}
                ></RiskIndicator>
              )}
            </RiskSection>
          )}
        </RiskSection>
      )}
      <Modal
        appSelector="__next"
        title={selectedEvent?.description ?? ''}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        {selectedEvent && <ActivityModalContent event={selectedEvent}></ActivityModalContent>}
      </Modal>
    </div>
  )
}

export default RiskSummary
