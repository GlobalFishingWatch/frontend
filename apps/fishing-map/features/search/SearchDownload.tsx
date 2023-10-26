import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { CSVLink } from 'react-csv'
import { IconButton } from '@globalfishingwatch/ui-components'
import { getSearchIdentityResolved, getVesselProperty } from 'features/vessel/vessel.utils'
import { formatInfoField, getVesselGearType, getVesselShipType } from 'utils/info'
import { selectSearchResults, selectSelectedVessels } from './search.slice'

function SearchDownload() {
  const { t } = useTranslation()
  const searchResults = useSelector(selectSearchResults)
  const vesselsSelected = useSelector(selectSelectedVessels)
  const [vesselsSelectedDownload, setVesselsSelectedDownload] = useState([])

  const getDownloadVessels = async (_: any, done: any) => {
    if (vesselsSelected) {
      const vesselsParsed = vesselsSelected.map((vessel) => {
        return {
          name: formatInfoField(getVesselProperty(vessel, 'shipname'), 'shipname'),
          ssvid: getVesselProperty(vessel, 'ssvid'),
          imo: getVesselProperty(vessel, 'imo'),
          'call sign': getVesselProperty(vessel, 'callsign'),
          flag: t(`flags:${getVesselProperty(vessel, 'flag')}` as any),
          'vessel type': getVesselShipType({ shiptype: getVesselProperty(vessel, 'shiptype') }),
          'gear type': getVesselGearType({
            geartype: getVesselProperty(vessel, 'geartype'),
          }),
          owner: formatInfoField(getVesselProperty(vessel, 'owner'), 'owner'),
          transmissions: getSearchIdentityResolved(vessel).positionsCounter,
          'transmissions start': getVesselProperty(vessel, 'transmissionDateFrom'),
          'transmissions end': getVesselProperty(vessel, 'transmissionDateTo'),
          dataset: vessel.dataset.id,
        }
      })
      await setVesselsSelectedDownload(vesselsParsed as any)
      done(true)
    }
  }

  if (!searchResults) {
    return null
  }

  return (
    <CSVLink
      filename={`gfw-search-results-selection.csv`}
      asyncOnClick={true}
      data={vesselsSelectedDownload}
      onClick={getDownloadVessels}
    >
      <IconButton
        icon="download"
        type="border"
        size="medium"
        disabled={vesselsSelected.length <= 0}
        tooltip={
          vesselsSelected.length
            ? `${t('search.downloadSelected', 'Download CSV of selected vessels')} (${
                vesselsSelected.length
              })`
            : t('search.downloadDisabled', 'Select vessels to download their info')
        }
        tooltipPlacement="top"
      />
    </CSVLink>
  )
}

export default SearchDownload
