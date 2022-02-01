# Global Fishing Watch - Carrier Vessel Portal - Download Feature

## Encounter Events CSV Download

### Encounter Definition

Identified from AIS data as locations where two vessels, a carrier and fishing vessel, were within 500 meters for at least 2 hours and traveling at a median speed <2 knots, while at least 10 km from a coastal anchorage.

### Encounter events CSV Column Definition

* `start`: start time of encounter in UTC (Universal Time Coordinated).
* `end`: end time of encounter in UTC (Universal Time Coordinated).
* `latitude`: mean latitude of the encounter.
* `longitude`: mean longitude of encounter.
* `rfmos`: If the encounter happened within an RFMO.
* `eezs`: If the encounter happened within an EEZ the eez it happened within using the Marine Regions EEZ code.
* `vessel.flag/encounter.vessel.flag`: The most likely flag associated with the MMSI given the most reported value by AIS and any publicly available registry information.
* `vessel.name/encounter.vessel.name`: Most common ship name reported by AIS associated with the MMSI.
* `vessel.type/encounter.vessel.type`: Whether the vessel was considered a carrier or fishing vessel.
* `vessel.ssvid/encounter.vessel.ssvid`: The MMSI (Marine Mobile Service Identity) associated with the vessel.
* `encounter.medianDistanceKilometers`: Median distance (kilometers) of encounter event
* `encounter.medianSpeedKnots`: Median speed (knots) of encounter event obtained from the duration of the event and the distance between the start and end point.
* `encounter.authorized`: Boolean flag of the authorization status of encounter (true or false).
* `encounter.authorizationStatus`: Authorization status of encounter ('matched', 'partially', or 'unmatched').
  * `Matched`: The carrier participating in the encounter has matching registry records from all the highlighted RFMOs where the event is taking place and during the time it took place. Registry records are obtained by GFW from the different RFMO public registry sites, both historic and current records.
  * `Partially`: The carrier participating in the encounter has matching registry records from at least one highlighted RFMO where the event is taking place and during the time it took place. Registry records are obtained by GFW from the different RFMO public registry sites, both historic and current records.
  * `Unmatched`: No matching registry records within the highlighted RFMOs were identified for the carrier participating in the encounter where the event is taking place and during the time it took place. Registry records are obtained by GFW from the different RFMO public registry sites, both historic and current records.
* `encounter.regionAuthorizations`:  Denotes if the carrier and/or fishing vessel was on the registry during the time of the encounter event based on the publicly available historical registry data. "authorized":false indicated that no public registry data from that RFMO was identified for the encounter event period.

## Loitering Events CSV Download

### Loitering Definition

Loitering is when a single vessel exhibits behavior indicative of a potential encounter event. Loitering occurs when a carrier vessel travels at average speeds of < 2 knots, while at least an average of 20 nautical miles from shore.

### Loitering events CSV Column Definition

* `start`: start time of encounter in UTC (Universal Time Coordinated).
* `end`: end time of encounter in UTC (Universal Time Coordinated).
* `latitude`: mean latitude of the encounter.
* `longitude`: mean longitude of encounter.
* `rfmos`: If the encounter happened within an RFMO.
* `eezs`: If the encounter happened within an EEZ the eez it happened within using the Marine Regions EEZ code.
* `vessel.flag`: The most likely flag associated with the MMSI given the most reported value by AIS and any publicly available registry information.
* `vessel.name`: Most common ship name reported by AIS associated with the MMSI.
* `vessel.ssvid`: The MMSI (Marine Mobile Service Identity) associated with the vessel.
* `loitering.totalTimeHours`: Duration (hours) of the loitering event.
* `loitering.totalDistanceKilometers`: Distance (kilometers) of the loitering event.
* `loitering.medianSpeedKnots`: Median speed (knots) of the loitering event.

## Vessel history CSV Download

### Vessel history CSV Column Definition

* `start`: start time of encounter in UTC (Universal Time Coordinated).
* `end`: end time of encounter in UTC (Universal Time Coordinated).
* `latitude`: mean latitude of the encounter.
* `longitude`: mean longitude of encounter.
* `rfmos`: If the encounter happened within an RFMO.
* `eezs`: If the encounter happened within an EEZ the eez it happened within using the Marine Regions EEZ code.
* `type`: Event type - encounter, loitering, or port event.
* `vessel.flag`: The most likely flag associated with the MMSI given the most reported value by AIS and any publicly available registry information.
* `vessel.name`: Most common ship name reported by AIS associated with the MMSI.
* `vessel.ssvid`: The MMSI (Marine Mobile Service Identity) associated with the vessel.
* `vessel.flag/encounter.vessel.flag`: The most likely flag associated with the MMSI given the most reported value by AIS and any publicly available registry information.
* `vessel.name/encounter.vessel.name`: Most common ship name reported by AIS associated with the MMSI.
* `vessel.type/encounter.vessel.type`: Whether the vessel was considered a carrier or fishing vessel.
* `vessel.ssvid/encounter.vessel.ssvid`: The MMSI (Marine Mobile Service Identity) associated with the vessel.
* `encounter.medianDistanceKilometers`: Median distance (kilometers) of encounter event
* `encounter.medianSpeedKnots`: Median speed (knots) of encounter event obtained from the duration of the event and the distance between the start and end point.
* `encounter.authorized`: Boolean flag of the authorization status of encounter (true or false).
* `encounter.authorizationStatus`: Authorization status of encounter ('matched', 'partially', or 'unmatched').
  * `Matched`: The carrier participating in the encounter has matching registry records from all the highlighted RFMOs where the event is taking place and during the time it took place. Registry records are obtained by GFW from the different RFMO public registry sites, both historic and current records.
  * `Partially`: The carrier participating in the encounter has matching registry records from at least one highlighted RFMO where the event is taking place and during the time it took place. Registry records are obtained by GFW from the different RFMO public registry sites, both historic and current records.
  * `Unmatched`: No matching registry records within the highlighted RFMOs were identified for the carrier participating in the encounter where the event is taking place and during the time it took place. Registry records are obtained by GFW from the different RFMO public registry sites, both historic and current records..
* `encounter.regionAuthorizations`:  Denotes if the carrier and/or fishing vessel was on the registry during the time of the encounter event based on the publicly available historical registry data. "authorized":false indicated that no public registry data from that RFMO was identified for the encounter event period.
* `loitering.totalTimeHours`: Duration (hours) of the loitering event.
* `loitering.totalDistanceKilometers`: Distance (kilometers) of the loitering event.
* `loitering.medianSpeedKnots`: Median speed (knots) of the loitering event.
* `port.name`:  Label associated with the anchorage visted after the encounter (see https://globalfishingwatch.org/datasets-and-code/anchorages/).
* `port.flag`: Three letter ISO 3 country code of next anchorage visited after the encounter (https://unstats.un.org).
* `port.latitude`:  latitude of the port event using the point at which the vessel first enters within 3 kilometers of an anchorage location and has stopped (speed of less than 0.2 knots).
* `port.longitude`: longitude of the port event using the point at which the vessel first enters within 3 kilometers of an anchorage location and has stopped (speed of less than 0.2 knots).
