# @globalfishingwatch/responsive-visualizations

A library for creating responsive visualizations in Global Fishing Watch applications.

## Features

- Automatic switching between aggregated and individual data views
- Responsive sizing based on container dimensions
- Support for both Bar Charts and Time Series visualizations

## Installation

```bash
yarn add @globalfishingwatch/responsive-visualizations
```

## Components

### ResponsiveBarChart

A bar chart component that switches between aggregated bars and individual points based on available space.

```tsx
import { ResponsiveBarChart } from '@globalfishingwatch/responsive-visualizations'
return (
  <ResponsiveBarChart
    getAggregatedData={() => aggregatedData}
    getIndividualData={() => individualData}
    color="#123456"
    barLabel={CustomLabel}
    aggregatedTooltip={CustomTooltip}
    individualTooltip={CustomTooltip}
    onIndividualItemClick={(item) => {}}
    onAggregatedItemClick={(item) => {}}
  />
)
```

### ResponsiveTimeSeries

A time series component that switches between aggregated bars and individual points based on available space.

```tsx
import { ResponsiveTimeseries } from '@globalfishingwatch/responsive-visualizations'
return (
  <ResponsiveTimeseries
    start="2024-01-01"
    end="2024-12-31"
    getAggregatedData={() => aggregatedData}
    getIndividualData={() => individualData}
    color="#123456"
    timeseriesInterval="month"
    tickLabelFormatter={(date) => formatDate(date)}
    aggregatedTooltip={CustomTooltip}
    individualTooltip={CustomTooltip}
  />
)
```

## Build and publish

```bash
nx build responsive-visualizations
nx publish responsive-visualizations
```

## License

MIT
