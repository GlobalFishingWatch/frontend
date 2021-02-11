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

<details>
<summary>Output</summary>
<p>

```js
console.log(areas)
[
  {
    "type": "Feature",
    "properties": {
        "type": "EEZ",
        "mrgid": "8308",
        "name": "Cocos Islands Exclusive Economic Zone",
        "bounds": [ 93.41, -15.56, 100.34, -8.47 ]
    },
    "geometry": {
      "type": "Polygon",
      "coordinates": [ [ [ 93.41, -15.56 ], [ 100.34, -15.56 ], [ 100.34, -8.47 ], [ 93.41, -8.47 ], [ 93.41, -15.56 ] ] ] }
  }
  ....
]
```

</p>
</details>

### Get all underlying areas by coordinates

```js
import { getOceanAreas } from '@globalfishingwatch/ocean-areas'
const name = getOceanAreas({ latitude: 16.11, longitude: 86.49 })
// console.log(areas) "[{"type":"ocean","name":"Bay of Bengal","area":2207565},{"name":"India","area":4804666,"type":"eez"}]"
```

### Get name of an ocean area by coordinates

```js
import { getOceanAreaName } from '@globalfishingwatch/ocean-areas'
const name = getOceanAreaName({ latitude: -15, longitude: 28, zoom: 5 })
// console.log(name) Spanish Exclusive Economic Zone (Canary Islands)
```

Set `combineWithEEZ` to true in order to get both EEZ and ocean name when available.

