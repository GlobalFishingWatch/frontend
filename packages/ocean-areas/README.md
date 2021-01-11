# Ocean Areas tool

A couple of functions to find ocean areas by coordinates or names

## Install

yarn

```bash
yarn add @globalfishingwatch/ocean-areas
```

npm

```bash
npm i @globalfishingwatch/ocean-areas --save
```

## Usage

### Find area by name

```js
import { searchOceanAreas } from '@globalfishingwatch/ocean-areas'
const areas = searchOceanAreas('coco island')
```

### Get name of an ocean area by coordinates

```js
import { getOceanAreaName } from '@globalfishingwatch/ocean-areas'
const areas = getOceanAreaName({ latitude: 40, longitude: 12, zoom: 3 })
```
