# Marine Regions

A set of functions to retrieve localized list of marine regions

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

### Get EEZ regions

```js
import { getEEZ } from '@globalfishingwatch/marine-regions'
const regions = getEEZ({ locale: MarineRegionsLocale.en })
```

<details>
<summary>Output</summary>
<p>

```js
console.log(regions)
[
  { id: 5670, label: 'Albanian Exclusive Economic Zone' },
  { id: 8378, label: 'Algerian Exclusive Economic Zone' },
  { id: 8444, label: 'American Samoa Exclusive Economic Zone' },
  ....
]
```

</p>
</details>

### Get MPA regions

```js
import { getMPA } from '@globalfishingwatch/marine-regions'
const regions = getMPA()
```

<details>
<summary>Output</summary>
<p>

```js
console.log(regions)
[
  {"id": 12880, "label": "100_Daeseom"},
  {"id": 12910, "label": "101_Hogamseom"},
  {"id": 12892, "label": "102_Galmaeseom"},
  ....
]
```

</p>
</details>

### Get RFMO regions

```js
import { getRFMO } from '@globalfishingwatch/marine-regions'
const regions = getRFMO({ locale: MarineRegionsLocale.en })
```

<details>
<summary>Output</summary>
<p>

```js
console.log(regions)
[
  { id: 'CCSBT', label: 'CCSBT' },
  { id: 'IATTC', label: 'IATTC' },
  { id: 'ICCAT', label: 'ICCAT' },
  { id: 'IOTC', label: 'IOTC' },
  { id: 'WCPFC', label: 'WCPFC' },
  ....
]
```

</p>
</details>
