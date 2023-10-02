# Global Fishing Watch Map Tracks

The downloaded file provides basic track information for a vessel of interest.

## Schema

Lon: longitude in decimal degrees
Lat: latitude decimal degrees
Timestamp: timestamp for AIS position in UTC
Speed: speed (knots) of vessel transmitted by AIS
Course: course (direction) of vessel transmitted by AIS
Seg_id: Unique identifier for the segment of AIS
Vessel_id: Unique identifier for the vessel based on identity characteristics (shipname, IMO, MMSI, callsign) transmitted by the vessel

## Caveats

The track information is derived from the AIS sources [ADD HERE]. Segment ID is an internal unit used at Global Fishing Watch as part of the process for ensuring valid AIS positional data is linked together into a coherent track. Vessel ID is also an internal unit derived from all the identity characteristics (eg shipname, imo, mmsi, callsign) associated with a vessel. A single physical hull with two Vessel IDs can meaningfully result from a change in what identity characteristics a vessel is transmitting, but can also result from more trivial changes in transmitted identity characteristic, such as a vessel having associated imo value during part of its segment and no imo value during part of its segment.

AIS data is limited by those vessels that transmit AIS data and do so by entering accurate vessel identity information in the transmitter. Track information, vessel ID, and segment ID are all impacted by quality of AIS data. Vessels transmitting in low reception areas, with class B AIS, transmitting intermittently, or vessels that turn their AIS off for long periods of time (when in port for example) are more likely to have numerous Vessel IDs associated with the same physical vessel, gaps in track information, or other possible inconsistencies.

While there is no definitive solution to this issue since it is inherent to the nature of AIS, GFW continues to develop methods to identify the true track for a single physical vessel over time.

## License

Non-Commercial Use Only. The Site and the Services are provided for Non-Commercial use only in accordance with the CC BY-NC 4.0 license. If you would like to use the Site and/or the Services for commercial purposes, please contact us.
