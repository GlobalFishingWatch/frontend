import { Popup } from '@globalfishingwatch/react-map-gl';
import React from 'react';

function PopupWrapper ({ tooltipEvent, closeButton, closeOnClick, className, children }) {
  return <Popup
    latitude={tooltipEvent.latitude}
    longitude={tooltipEvent.longitude}
    closeButton={closeButton}
    closeOnClick={closeOnClick}
    anchor="top">
      <div className={`popup ${className}`}>
        {tooltipEvent.features.map((feature, i) => 
          <div key={i} className="popupSection">
            <h3>
              <span className="popupSectionColor" style={{backgroundColor: feature.color }} />
              {feature.title}
            </h3>
            <p>
              {feature.value} {feature.unit}
            </p>
            {/* {...children} */}
          </div>
        )}
      </div>
  </Popup>
}

export function HoverPopup({ hoverTooltipEvent }) {
  console.log(hoverTooltipEvent)
  if (hoverTooltipEvent && hoverTooltipEvent.features) {
    return <PopupWrapper tooltipEvent={hoverTooltipEvent} closeButton={false} closeOnClick={false} className={'hover'} />
  }
  return null
}

export function ClickPopup({ clickTooltipEvent }) {
  if (clickTooltipEvent && clickTooltipEvent.features) {
    return <PopupWrapper tooltipEvent={clickTooltipEvent} closeButton={true} closeOnClick={true} className={'click'} />
  }
  return null
}
