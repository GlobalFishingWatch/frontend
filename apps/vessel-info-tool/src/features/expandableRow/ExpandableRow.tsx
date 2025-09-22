import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Row } from '@tanstack/react-table'
import { upperFirst } from 'es-toolkit'
import type { FeatureCollection } from 'geojson'

import type { Vessel } from '@/types/vessel.types'
import { getVesselsFromAPI } from '@/utils/vessels'
import { type IdentityVessel, type Locale } from '@globalfishingwatch/api-types'
import type { Bbox } from '@globalfishingwatch/data-transforms'
import { geoJSONToSegments, segmentsToBbox } from '@globalfishingwatch/data-transforms'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import {
  Button,
  FIRST_YEAR_OF_DATA,
  Icon,
  Spinner,
  TrackFootprint,
  YearlyTransmissionsTimeline,
} from '@globalfishingwatch/ui-components'

import I18nDate from '../i18n/i18nDate'

import styles from '../../styles/global.module.css'

interface ExpandableRowProps {
  rowId: string
}

function ExpandableRow({ rowId }: ExpandableRowProps) {
  const { t, i18n } = useTranslation()
  const [vesselMatch, setVesselMatch] = useState<(IdentityVessel & { track: string }) | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const isSmallScreen = useSmallScreen()
  const [highlightedYear, setHighlightedYear] = useState<number>()
  const [trackBbox, setTrackBbox] = useState<Bbox>()

  const navigate = () => {
    let url = ''
    if (!vesselMatch) url = 'https://globalfishingwatch.org/map'
    else
      url = `https://globalfishingwatch.org/map/fishing-activity/default-public/vessel/${vesselMatch.selfReportedInfo[0].id}/`
    window.open(url, '_blank')
  }

  const onYearHover = useCallback((year?: number) => {
    setHighlightedYear(year)
  }, [])

  const onTrackFootprintLoad = useCallback((data: FeatureCollection) => {
    const segments = geoJSONToSegments(data)
    const bbox = segments?.length ? segmentsToBbox(segments) : undefined
    setTrackBbox(bbox)
  }, [])

  useEffect(() => {
    const fetchVessel = async () => {
      setIsLoading(true)
      try {
        const vessel = await getVesselsFromAPI({ id: rowId })
        setVesselMatch(vessel ?? null)
      } catch (error) {
        console.error('Error fetching vessel:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVessel()
  }, [rowId])

  if (isLoading)
    return (
      <div className="!w-screen sticky left-0 !px-[6rem] !py-[3rem] h-[180px]">
        <Spinner />
      </div>
    )
  if (!vesselMatch) {
    return (
      <div className="!w-screen sticky left-0 !px-[6rem] !py-[3rem] h-[180px] flex items-center gap-16">
        <img
          src="/vessel-search-no-results.svg"
          className="!flex-shrink-0 max-h-full"
          alt={t('expanded_row.not_found_alt', 'No results found')}
        />
        <p>{t('expanded_row.not_found')}</p>
      </div>
    )
  }
  const { ssvid, transmissionDateFrom, transmissionDateTo, positionsCounter } =
    vesselMatch.selfReportedInfo[0]
  const hasPositions = positionsCounter !== undefined && positionsCounter > 0

  return (
    <div className="!w-screen sticky left-0 !px-[6rem] !py-[3rem]">
      <div className="grid [grid-template-columns:repeat(3,minmax(max-content,min-content))] gap-16">
        <div className="flex flex-col max-h-[125px]">
          {!isSmallScreen && (
            <TrackFootprint
              vesselIds={[vesselMatch.selfReportedInfo[0].id]}
              trackDatasetId={vesselMatch.track}
              highlightedYear={highlightedYear}
              onDataLoad={onTrackFootprintLoad}
            />
          )}
        </div>
        <div className="flex flex-col items-start justify-between">
          <h4 className="font-semibold mb-2">{t('expanded_row.title', 'Vessel Viewer')}</h4>
          {transmissionDateFrom && transmissionDateTo && (
            <div className={styles.expanded}>
              <span className="whitespace-nowrap">
                {hasPositions
                  ? `${positionsCounter} ${t('expanded_row.transmission_other', 'transmissions')} ${t('expanded_row.from', 'from')} `
                  : `${upperFirst(t('expanded_row.from', 'from'))} `}
                <I18nDate date={transmissionDateFrom} /> {t('expanded_row.to')}{' '}
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
          <Button className={styles.downloadButton} size="medium" onClick={navigate}>
            {t('expanded_row.see_more', 'See more')}
          </Button>
        </div>
        <div className="flex flex-col justify-between">
          <h4 className="font-semibold mb-2">
            {t('expanded_row.external_links', 'External Links')}
          </h4>
          <div>
            <a
              href={`https://www.marinetraffic.com/${i18n.language}/ais/details/ships/mmsi:${ssvid}`}
              target="_blank"
              className="flex self-center h-12 underline"
            >
              Marine Traffic
              <Icon icon="external-link" type="default" />
            </a>
            <a
              href={`https://sc-production.skylight.earth/vesselsearch?mmsi=${ssvid}`}
              target="_blank"
              className="flex self-center h-12 underline"
            >
              Skylight
              <Icon icon="external-link" type="default" />
            </a>
            <a
              href={`https://app.triton.fish/search?name=${ssvid}`}
              target="_blank"
              className="flex self-center h-12 underline"
            >
              Triton
              <Icon icon="external-link" type="default" />
            </a>
            {/* https://www.iattc.org/en-US/Management/Vessel-register?vesselno=18597
            https://globalrecord.fao.org/vessels/view/0469f642-b37d-4da5-9691-673d62bed9f0
             */}
          </div>
        </div>
      </div>
    </div>
  )
}

export const renderExpandedRow = ({ row }: { row: Row<Vessel> }) => {
  const rowId = row.id || row.original.imo
  if (!rowId) {
    return <p>No vessel ID available</p>
  }
  return <ExpandableRow rowId={rowId} />
}
