import React, { Component, Fragment, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import cx from 'classnames'
import countryflag from 'countryflag'
import GFWAPI from '@globalfishingwatch/api-client'
import MiniGlobe, { MiniglobeBounds } from '@globalfishingwatch/ui-components/dist/miniglobe'
import { Button, Icon, Logo } from '@globalfishingwatch/ui-components'
import CountryFlag from '@globalfishingwatch/ui-components/dist/countryflag'
import { selectVessels } from 'features/vessels/vessels.slice'
import { ReactComponent as LocationIcon } from 'assets/icons/location.svg'
import { ReactComponent as SpeedIcon } from 'assets/icons/speed.svg'
import { ReactComponent as BearingIcon } from 'assets/icons/bearing.svg'
import { ReactComponent as PortIcon } from 'assets/icons/port.svg'
import MapButtton from './MapButtton'
import styles from './Info.module.css'

interface InfoProps {
  vesselID: string
  lastPosition: any
  lastPortVisit: any
}

const Info: React.FC<InfoProps> = (props): React.ReactElement => {
  const vesselID = props.vesselID
  const [vessel, setVessel] = useState(null)
  const vessels = useSelector(selectVessels)
  //const vessel = vessels && vessels[vesselID] ? vessels[vesselID] : null
  useMemo(() => {
    GFWAPI.fetch(`/vessels/${vesselID}`)
      .then((json: any) => {
        setVessel(json)
      })
      .catch((error) => console.log(error))
  }, [vesselID])

  /*const seeEventOnGFWMap = () => {
    const GFWMapUrl = process.env.REACT_APP_GFW_VESSEL_MAP
    const tileSet = process.env.REACT_APP_GFW_TILESET
    const zoom = 6
    const parameters = {
      zoom,
      vessels: [[vessel.id, tileSet]],
    }
    const paramsPlainText = JSON.stringify(parameters)
    window.open(`${GFWMapUrl}?paramsPlainText=${paramsPlainText}`, '_blank')
  }*/

  const { lastPosition, lastPortVisit } = props

  return (
    <Fragment>
      <div className={styles.infoContainer}>
        {vessel && (
          <div className={styles.identifiers}>
            <div>
              <label>Type</label>
              <span>Fishing Vessel</span>
            </div>
            <div>
              <label>FLAG</label>
              <span>Chinese Taipei</span>
            </div>
            <div>
              <label>MMSI</label>
              <span>31306526</span>
            </div>
            <div>
              <label>CALLSIGN</label>
              <span>407201</span>
            </div>
            <div>
              <label>GEAR TYPE</label>
              <span>Longline Tuna</span>
            </div>
            <div>
              <label>LENGTH</label>
              <span>19.4</span>
            </div>
            <div>
              <label>GROSS TONNAGE</label>
              <span>68</span>
            </div>
            <div>
              <label>DEPTH</label>
              <span>6</span>
            </div>
            <div>
              <label>AUTORIZATIONS</label>
              <span>CCSBT</span>
              <br />
              <span>ICCAT</span>
              <br />
              <span>IOTC</span>
              <br />
            </div>
            <div>
              <label>BUILT</label>
              <span>Ulsan, 1996</span>
            </div>
            <div>
              <label>OWNER</label>
              <span>NENG DE OCEAN COMPANY LTD</span>
            </div>
            <div>
              <label>OPERATOR</label>
              <span>NENG DE OCEAN COMPANY LTD</span>
            </div>
          </div>
        )}
        <Button className={styles.saveButton} type="secondary">
          SAVE VESSEL FOR OFFLINE VIEW
        </Button>
      </div>
    </Fragment>
  )
}

export default Info
