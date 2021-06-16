# Marine Regions

A set of datasets, functions and tools to search, get and list marine regions

## Install

yarn

```bash
yarn add @globalfishingwatch/marine-regions
```

npm

```bash
npm i @globalfishingwatch/marine-regions --save
```

## Usage

### Get regions by type

```js
import { listRegionsByType } from '@globalfishingwatch/marine-regions'
const regions = listRegionsByType('EEZ')
```

<details>
<summary>Output</summary>
<p>

```js
console.log(regions)
[
    {
		"type": 'Feature',
		"geometry": {
			"type": 'Polygon',
			"coordinates": [
			[
				[-52.67, -37.86],
				[-54.49, -36.9],
				[-55.87, -35.63],
				[-58.49, -33.68],
				[-57.65, -30.19],
				[-53.85, -27.16],
				[-54.59, -25.59],
				[-57.57, -25.54],
				[-62.64, -22.25],
				[-67.18, -22.81],
				[-68.57, -24.79],
				[-70.57, -31.6],
				[-69.8, -34.24],
				[-71.96, -40.74],
				[-71.65, -46.69],
				[-73.48, -50.12],
				[-71.92, -52],
				[-68.42, -52.33],
				[-68.44, -52.4],
				[-67.27, -58.37],
				[-62.39, -58.06],
				[-58.54, -56.23],
				[-64.78, -52.43],
				[-64.57, -50.36],
				[-60.77, -47.67],
				[-60.57, -45.26],
				[-57.96, -41.92],
				[-53.92, -39.88],
				[-52.67, -37.86],
			],
			],
		},
		"properties": {
			"name": 'Argentina',
			"area": 3851647,
			"type": 'eez'
		},
    },
	{
		"type": 'Feature',
		"geometry": {
			"type": 'Polygon',
			"coordinates": [
				[
				[20.4, 58.02],
				[24.34, 57.88],
				[24.41, 57.87],
				[27.35, 57.52],
				[28.2, 59.38],
				[28.15, 59.42],
				[26.34, 59.99],
				[20.48, 58.84],
				[20.4, 58.02],
				],
			],
		},
		"properties": {
			"name": 'Estonia',
			"area": 81842,
			"type": 'eez'
		},
	},
  ....
]
```

</p>
</details>
