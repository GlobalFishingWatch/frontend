import { Popup } from '@globalfishingwatch/react-map-gl';
import React from 'react';

function PopupWrapper ({ tooltipEvent, closeButton, closeOnClick, className, onClose }) {
  return <Popup
    latitude={tooltipEvent.latitude}
    longitude={tooltipEvent.longitude}
    closeButton={closeButton}
    closeOnClick={closeOnClick}
    onClose={onClose}
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
          </div>
        )}
      </div>
  </Popup>
}

export function HoverPopup({ event }) {
  if (event && event.features) {
    return <PopupWrapper tooltipEvent={event} closeButton={false} closeOnClick={false} className={'hover'} />
  }
  return null
}

export function ClickPopup({ event, onClose }) {
  if (event && event.features) {
    return <PopupWrapper tooltipEvent={event} closeButton={true} closeOnClick={true} className={'click'} onClose={onClose} />
  }
  return null
}
