# libs/ocean-areas/src/scripts/lib/port-sources.ts · [[ocean-areas-data-preparation-scripts]]

Module that exports port source type and utility function to extract AIS and VMS data sources from port feature properties.

- PortSource · type · L3-L3 — Union type representing the two possible data sources for port activity data: AIS or VMS.
- getPortSources · function · L5-L9 — Extracts which port data sources (AIS, VMS) are present in a port feature by filtering available source indicators.
