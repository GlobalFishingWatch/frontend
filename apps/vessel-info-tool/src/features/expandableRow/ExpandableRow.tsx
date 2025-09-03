import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Row } from '@tanstack/react-table'
import { upperFirst } from 'es-toolkit'
import type { FeatureCollection } from 'geojson'

import type { Vessel } from '@/types/vessel.types'
import { getVesselsFromAPI } from '@/utils/vessels'
import type { IdentityVessel, Locale } from '@globalfishingwatch/api-types'
import type { Bbox} from '@globalfishingwatch/data-transforms';
import { geoJSONToSegments, segmentsToBbox } from '@globalfishingwatch/data-transforms'
import { useSmallScreen } from '@globalfishingwatch/react-hooks'
import {
  Button,
  FIRST_YEAR_OF_DATA,
  Icon,
  YearlyTransmissionsTimeline,
} from '@globalfishingwatch/ui-components'

interface ExpandableRowProps {
  vessel: IdentityVessel
  track?: string
  isLoading?: boolean
}

function ExpandableRow({ vessel, track, isLoading }: ExpandableRowProps) {
  const { t, i18n } = useTranslation()

  const isSmallScreen = useSmallScreen()
  const [highlightedYear, setHighlightedYear] = useState<number>()
  const [trackBbox, setTrackBbox] = useState<Bbox>()

  const { ssvid, transmissionDateFrom, transmissionDateTo, positionsCounter } =
    vessel.selfReportedInfo[0]
  const hasPositions = positionsCounter !== undefined && positionsCounter > 0

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
    <div>
      <div className="grid grid-cols-3 gap-4">
        {/* <div className="flex flex-col">
          {!isSmallScreen && (
            <TrackFootprint
              vesselIds={['ef9f4545a-a733-e7a5-4cb3-b9cc3cbf66c0']}
              trackDatasetId={track}
              highlightedYear={highlightedYear}
              onDataLoad={onTrackFootprintLoad}
            />
          )}
        </div> */}
        <div className="flex flex-col">
          <h4 className="font-semibold mb-2">Vessel Viewer</h4>
          {transmissionDateFrom && transmissionDateTo && (
            <div className="flex-1">
              <span className="whitespace-nowrap">
                {hasPositions
                  ? `${positionsCounter} ${t('vessel.transmission_other')} ${t('common.from')} `
                  : `${upperFirst(t('common.from'))} `}
                {transmissionDateFrom} {t('common.to')} {transmissionDateTo}
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
          <Button>See more</Button>
        </div>
        <div className="flex flex-col">
          <h4 className="font-semibold mb-2">External Links</h4>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export const renderExpandedRow = async ({ row }: { row: Row<Vessel> }) => {
  return <div>Loading...</div>
  const rowId = row.original.imo || row.original.id || row.original.mmsi
  if (!rowId) {
    return <div>No vessel ID available</div>
  }
  const vesselMatch = await getVesselsFromAPI({ id: rowId })
  if (!vesselMatch) {
    return <div>Couldn't find vessel information</div>
  }
  // const trackDatasetId = await getVesselTracks()

  // if (!vesselMatch || !trackDatasetId) {
  //   return <div>Couldn't find vessel information</div>
  // }
  // return <ExpandableRow vessel={vesselMatch} />
}
