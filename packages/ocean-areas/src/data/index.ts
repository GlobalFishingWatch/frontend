import { FeatureCollection, Geometry } from 'geojson'
import { OceanAreaProperties } from '..'

const oceanAreas: FeatureCollection<Geometry, OceanAreaProperties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8444', name: 'American Samoa Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-173.77, -17.56],
            [-165.2, -17.56],
            [-165.2, -10.02],
            [-173.77, -10.02],
            [-173.77, -17.56],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8379', name: 'Ascension Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-17.78, -11.34],
            [-10.93, -11.34],
            [-10.93, -4.54],
            [-17.78, -4.54],
            [-17.78, -11.34],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8446', name: 'Cook Islands Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-168.52, -25.31],
            [-154.81, -25.31],
            [-154.81, -5.8],
            [-168.52, -5.8],
            [-168.52, -25.31],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8389',
        name: 'Overlapping claim Falkland / Malvinas Islands: UK / Argentina',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-65.02, -56.23],
            [-52.32, -56.23],
            [-52.32, -47.67],
            [-65.02, -47.67],
            [-65.02, -56.23],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8440', name: 'French Polynesian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-158.13, -31.24],
            [-131.98, -31.24],
            [-131.98, -4.54],
            [-158.13, -4.54],
            [-158.13, -31.24],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8439', name: 'Pitcairn Islands Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-133.43, -28.42],
            [-121.11, -28.42],
            [-121.11, -20.56],
            [-133.43, -20.56],
            [-133.43, -28.42],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8380', name: 'St. Helena Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-9.25, -19.38],
            [-2.17, -19.38],
            [-2.17, -12.55],
            [-9.25, -12.55],
            [-9.25, -19.38],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8445', name: 'Samoan Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-174.51, -15.88],
            [-170.54, -15.88],
            [-170.54, -10.96],
            [-174.51, -10.96],
            [-174.51, -15.88],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8448', name: 'Tongan Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-179.09, -25.7],
            [-171.31, -25.7],
            [-171.31, -14.15],
            [-179.09, -14.15],
            [-179.09, -25.7],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8382', name: 'Tristan Da Cunha Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-16.89, -43.71],
            [-5.51, -43.71],
            [-5.51, -33.72],
            [-16.89, -33.72],
            [-16.89, -43.71],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8465', name: 'Chilean Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-84.84, -59.85],
            [-65.73, -59.85],
            [-65.73, -18.35],
            [-84.84, -18.35],
            [-84.84, -59.85],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8447', name: 'Niue Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-172.03, -22.5],
            [-166.3, -22.5],
            [-166.3, -16.59],
            [-172.03, -16.59],
            [-172.03, -22.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '48961', name: 'Joint regime area Argentina / Uruguay' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-56.78, -37.53],
            [-53.53, -37.53],
            [-53.53, -34.97],
            [-56.78, -34.97],
            [-56.78, -37.53],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '48962', name: 'Joint regime area Peru / Ecuador' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-84.52, -3.56],
            [-80.38, -3.56],
            [-80.38, -3.22],
            [-84.52, -3.22],
            [-84.52, -3.56],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8467', name: 'Uruguayan Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-58.49, -37.86],
            [-50.06, -37.86],
            [-50.06, -31.52],
            [-58.49, -31.52],
            [-58.49, -37.86],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8449', name: 'Tokelau Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-175.89, -11.05],
            [-168.0, -11.05],
            [-168.0, -6.47],
            [-175.89, -6.47],
            [-175.89, -11.05],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8432', name: 'Peruvian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-84.67, -20.21],
            [-70.38, -20.21],
            [-70.38, -3.39],
            [-84.67, -3.39],
            [-84.67, -20.21],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '22756',
        name: 'Chilean Exclusive Economic Zone (San Felix and San Ambrosio islands)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.83, -29.7],
            [-76.15, -29.7],
            [-76.15, -22.94],
            [-83.83, -22.94],
            [-83.83, -29.7],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '21787',
        name: 'Chilean Exclusive Economic Zone (Easter Island)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-113.2, -30.55],
            [-101.64, -30.55],
            [-101.64, -23.12],
            [-113.2, -23.12],
            [-113.2, -30.55],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8381',
        name: 'Brazilian Exclusive Economic Zone (Trindade)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-32.9, -23.88],
            [-25.29, -23.88],
            [-25.29, -17.12],
            [-32.9, -17.12],
            [-32.9, -23.88],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8450',
        name: 'Kiribati Exclusive Economic Zone (Phoenix Islands)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-177.88, -7.78],
            [-167.37, -7.78],
            [-167.37, 0.59],
            [-177.88, 0.59],
            [-177.88, -7.78],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8466', name: 'Argentinean Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-69.6, -58.39],
            [-52.67, -58.39],
            [-52.67, -31.53],
            [-69.6, -31.53],
            [-69.6, -58.39],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8386',
        name: 'Amsterdam Island & St. Paul Island Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [73.24, -42.08],
            [81.81, -42.08],
            [81.81, -34.45],
            [73.24, -34.45],
            [73.24, -42.08],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8309', name: 'Christmas Island Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [102.15, -13.92],
            [109.03, -13.92],
            [109.03, -8.73],
            [102.15, -8.73],
            [102.15, -13.92],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8308', name: 'Cocos Islands Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [93.41, -15.56],
            [100.34, -15.56],
            [100.34, -8.47],
            [93.41, -8.47],
            [93.41, -15.56],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8334', name: 'Comoran Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [41.84, -14.46],
            [45.77, -14.46],
            [45.77, -8.11],
            [41.84, -8.11],
            [41.84, -14.46],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8385', name: 'Crozet Islands Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [45.37, -49.82],
            [57.15, -49.82],
            [57.15, -42.6],
            [45.37, -42.6],
            [45.37, -49.82],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48944',
        name: 'Overlapping claim Mayotte: France / Comoros',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [43.48, -14.53],
            [46.69, -14.53],
            [46.69, -11.14],
            [43.48, -11.14],
            [43.48, -14.53],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48946',
        name: 'Overlapping claim Ile Tromelin: Reunion / Madagascar / Mauritus',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [52.39, -18.8],
            [57.21, -18.8],
            [57.21, -12.51],
            [52.39, -12.51],
            [52.39, -18.8],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8388',
        name: 'Heard and McDonald Islands Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [67.05, -56.52],
            [79.41, -56.52],
            [79.41, -49.83],
            [67.05, -49.83],
            [67.05, -56.52],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8387', name: 'Kerguelen Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [63.3, -53.18],
            [75.65, -53.18],
            [75.65, -45.12],
            [63.3, -45.12],
            [63.3, -53.18],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8348', name: 'Madagascan Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [40.33, -28.95],
            [53.37, -28.95],
            [53.37, -10.34],
            [40.33, -10.34],
            [40.33, -28.95],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8396', name: 'South African Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [13.35, -38.18],
            [36.53, -38.18],
            [36.53, -26.86],
            [13.35, -26.86],
            [13.35, -38.18],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8312', name: 'New Caledonian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [156.26, -26.2],
            [170.55, -26.2],
            [170.55, -14.79],
            [156.26, -14.79],
            [156.26, -26.2],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8310', name: 'Norfolk Island Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [164.11, -32.48],
            [171.8, -32.48],
            [171.8, -25.85],
            [164.11, -25.85],
            [164.11, -32.48],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8343', name: 'Mauritian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [53.8, -23.81],
            [67.05, -23.81],
            [67.05, -8.44],
            [53.8, -8.44],
            [53.8, -23.81],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8338', name: 'Réunion Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [51.8, -24.74],
            [58.24, -24.74],
            [58.24, -18.29],
            [51.8, -18.29],
            [51.8, -24.74],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8313', name: 'Vanuatu Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [163.31, -21.64],
            [173.61, -21.64],
            [173.61, -12.28],
            [163.31, -12.28],
            [163.31, -21.64],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8395', name: 'Namibian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.24, -30.66],
            [16.83, -30.66],
            [16.83, -17.24],
            [8.24, -17.24],
            [8.24, -30.66],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '21791', name: 'Oecussi Ambeno Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [124.03, -9.34],
            [124.5, -9.34],
            [124.5, -8.81],
            [124.03, -8.81],
            [124.03, -9.34],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8394', name: 'Congolese Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.91, -6.73],
            [12.01, -6.73],
            [12.01, -3.93],
            [8.91, -3.93],
            [8.91, -6.73],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8478', name: 'Angolan Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.2, -17.27],
            [13.87, -17.27],
            [13.87, -5.03],
            [8.2, -5.03],
            [8.2, -17.27],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8347', name: 'Mozambican Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [32.43, -27.72],
            [43.01, -27.72],
            [43.01, -10.09],
            [32.43, -10.09],
            [32.43, -27.72],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8349', name: 'Kenyan Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [39.22, -4.9],
            [44.33, -4.9],
            [44.33, -1.65],
            [39.22, -1.65],
            [39.22, -4.9],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '21798',
        name: 'Protected Zone established under the Torres Strait Treaty',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [142.06, -9.76],
            [142.85, -9.76],
            [142.85, -9.19],
            [142.06, -9.19],
            [142.06, -9.76],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8384',
        name: 'South African Exclusive Economic Zone (Prince Edward Islands)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [32.71, -50.32],
            [42.85, -50.32],
            [42.85, -43.26],
            [32.71, -43.26],
            [32.71, -50.32],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8479', name: 'Tanzanian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [38.54, -10.91],
            [43.28, -10.91],
            [43.28, -4.68],
            [38.54, -4.68],
            [38.54, -10.91],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8314', name: 'Solomon Islands Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [154.59, -16.13],
            [173.59, -16.13],
            [173.59, -4.14],
            [154.59, -4.14],
            [154.59, -16.13],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8337', name: 'Seychellois Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [43.18, -12.76],
            [59.63, -12.76],
            [59.63, -0.36],
            [43.18, -0.36],
            [43.18, -12.76],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48945',
        name: 'Overlapping claim Glorioso Islands: France / Madagascar',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [45.77, -12.81],
            [48.49, -12.81],
            [48.49, -10.65],
            [45.77, -10.65],
            [45.77, -12.81],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8341', name: 'Ile Europa Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [38.01, -25.75],
            [41.82, -25.75],
            [41.82, -20.92],
            [38.01, -20.92],
            [38.01, -25.75],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48948',
        name: 'Overlapping claim Matthew and Hunter Islands: New Caledonia / Vanuatu',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [170.06, -25.75],
            [174.28, -25.75],
            [174.28, -20.02],
            [170.06, -20.02],
            [170.06, -25.75],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8477',
        name: 'Democratic Republic of the Congo Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [9.01, -7.07],
            [13.65, -7.07],
            [13.65, -5.53],
            [9.01, -5.53],
            [9.01, -7.07],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8323', name: 'Australian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [109.23, -47.19],
            [163.19, -47.19],
            [163.19, -8.88],
            [109.23, -8.88],
            [109.23, -47.19],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8311',
        name: 'Australian Exclusive Economic Zone (Macquarie Island)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [152.86, -58.45],
            [164.69, -58.45],
            [164.69, -51.03],
            [152.86, -51.03],
            [152.86, -58.45],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8339', name: 'Juan de Nova Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [40.94, -19.25],
            [43.31, -19.25],
            [43.31, -15.33],
            [40.94, -15.33],
            [40.94, -19.25],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8340', name: 'Bassas da India Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [37.54, -23.19],
            [41.58, -23.19],
            [41.58, -19.11],
            [37.54, -19.11],
            [37.54, -23.19],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '33176', name: 'Overlapping claim: Kenya / Somalia' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [41.57, -3.55],
            [45.95, -3.55],
            [45.95, -1.65],
            [41.57, -1.65],
            [41.57, -3.55],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8758', name: 'East Timorian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [124.94, -11.4],
            [128.5, -11.4],
            [128.5, -8.1],
            [124.94, -8.1],
            [124.94, -11.4],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8412', name: 'Anguilla Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.9, 17.94],
            [-60.74, 17.94],
            [-60.74, 21.94],
            [-63.9, 21.94],
            [-63.9, 17.94],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8414',
        name: 'Antigua and Barbuda Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-62.75, 16.61],
            [-58.37, 16.61],
            [-58.37, 20.92],
            [-62.75, 20.92],
            [-62.75, 16.61],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '26519', name: 'Aruban Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-70.42, 12.15],
            [-68.87, 12.15],
            [-68.87, 15.3],
            [-70.42, 15.3],
            [-70.42, 12.15],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8361',
        name: 'Portuguese Exclusive Economic Zone (Azores)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-35.59, 33.59],
            [-20.6, 33.59],
            [-20.6, 43.06],
            [-35.59, 43.06],
            [-35.59, 33.59],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8404', name: 'Bahamas Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-81.23, 20.37],
            [-70.51, 20.37],
            [-70.51, 30.37],
            [-81.23, 30.37],
            [-81.23, 20.37],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8418', name: 'Barbados Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-60.38, 10.69],
            [-56.0, 10.69],
            [-56.0, 16.02],
            [-60.38, 16.02],
            [-60.38, 10.69],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8429', name: 'Mexican Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-122.18, 11.87],
            [-84.64, 11.87],
            [-84.64, 32.63],
            [-122.18, 32.63],
            [-122.18, 11.87],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '26520', name: 'Bonaire Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-68.72, 11.67],
            [-67.99, 11.67],
            [-67.99, 14.27],
            [-68.72, 14.27],
            [-68.72, 11.67],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8411',
        name: 'British Virgin Islands Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-65.84, 17.96],
            [-63.26, 17.96],
            [-63.26, 22.1],
            [-65.84, 22.1],
            [-65.84, 17.96],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8362', name: 'Cape Verdean Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-28.85, 11.45],
            [-19.54, 11.45],
            [-19.54, 20.56],
            [-28.85, 20.56],
            [-28.85, 11.45],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8364',
        name: 'Spanish Exclusive Economic Zone (Canary Islands)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-21.92, 24.58],
            [-11.81, 24.58],
            [-11.81, 32.29],
            [-21.92, 32.29],
            [-21.92, 24.58],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8407', name: 'Cayman Islands Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.6, 17.58],
            [-78.73, 17.58],
            [-78.73, 20.63],
            [-83.6, 20.63],
            [-83.6, 17.58],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8401', name: 'Clipperton Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-112.62, 6.94],
            [-105.82, 6.94],
            [-105.82, 13.67],
            [-112.62, 13.67],
            [-112.62, 6.94],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8423', name: 'Panamanian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-84.32, 5.0],
            [-77.05, 5.0],
            [-77.05, 12.5],
            [-84.32, 12.5],
            [-84.32, 5.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8424', name: 'Costa Rican Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-90.44, 2.15],
            [-80.0, 2.15],
            [-80.0, 11.6],
            [-90.44, 11.6],
            [-90.44, 2.15],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '26517', name: 'Curaçaoan Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-69.55, 11.67],
            [-68.41, 11.67],
            [-68.41, 15.24],
            [-69.55, 15.24],
            [-69.55, 11.67],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8417', name: 'Dominican Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-62.81, 14.49],
            [-57.88, 14.49],
            [-57.88, 16.5],
            [-62.81, 16.5],
            [-62.81, 14.49],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8409',
        name: 'Dominican Republic Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.47, 15.01],
            [-65.82, 15.01],
            [-65.82, 24.09],
            [-73.47, 24.09],
            [-73.47, 15.01],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8430', name: 'Guatemalan Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-94.31, 10.58],
            [-88.21, 10.58],
            [-88.21, 16.07],
            [-94.31, 16.07],
            [-94.31, 10.58],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8435', name: 'Faeroe Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-14.0, 59.94],
            [-0.49, 59.94],
            [-0.49, 65.69],
            [-14.0, 65.69],
            [-14.0, 59.94],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8370', name: 'Gambian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-20.24, 13.06],
            [-15.3, 13.06],
            [-15.3, 13.64],
            [-20.24, 13.64],
            [-20.24, 13.06],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8365',
        name: 'Overlapping claim Gibraltarian Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.4, 36.01],
            [-4.97, 36.01],
            [-4.97, 36.16],
            [-5.4, 36.16],
            [-5.4, 36.01],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8419', name: 'Grenadian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.27, 11.37],
            [-60.78, 11.37],
            [-60.78, 13.35],
            [-63.27, 13.35],
            [-63.27, 11.37],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '33177', name: 'Guadeloupean Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-62.81, 15.06],
            [-57.53, 15.06],
            [-57.53, 18.54],
            [-62.81, 18.54],
            [-62.81, 15.06],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8390', name: 'Sierra Leonian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-16.55, 4.19],
            [-11.45, 4.19],
            [-11.45, 9.13],
            [-16.55, 9.13],
            [-16.55, 4.19],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5680', name: 'Icelandic Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-30.87, 59.97],
            [-5.57, 59.97],
            [-5.57, 69.58],
            [-30.87, 69.58],
            [-30.87, 59.97],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8459', name: 'Jamaican Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.83, 14.08],
            [-74.01, 14.08],
            [-74.01, 19.36],
            [-80.83, 19.36],
            [-80.83, 14.08],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8363',
        name: 'Portuguese Exclusive Economic Zone (Madeira)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-21.22, 29.25],
            [-12.59, 29.25],
            [-12.59, 36.47],
            [-21.22, 36.47],
            [-21.22, 29.25],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8369', name: 'Mauritanian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-20.27, 16.06],
            [-16.02, 16.06],
            [-16.02, 21.17],
            [-20.27, 21.17],
            [-20.27, 16.06],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8415', name: 'Montserrat Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.05, 15.84],
            [-61.83, 15.84],
            [-61.83, 16.89],
            [-63.05, 16.89],
            [-63.05, 15.84],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48951',
        name: 'Overlapping claim Navassa Island: USA / Haiti / Jamaica',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-75.83, 17.33],
            [-74.73, 17.33],
            [-74.73, 19.16],
            [-75.83, 19.16],
            [-75.83, 17.33],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8443', name: 'Palmyra Atoll Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-165.74, 2.66],
            [-159.33, 2.66],
            [-159.33, 9.79],
            [-165.74, 9.79],
            [-165.74, 2.66],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '33179', name: 'Puerto Rican Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-68.5, 14.93],
            [-65.02, 14.93],
            [-65.02, 21.81],
            [-68.5, 21.81],
            [-68.5, 14.93],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '26518', name: 'Saba Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-64.02, 16.68],
            [-63.02, 16.68],
            [-63.02, 17.95],
            [-64.02, 17.95],
            [-64.02, 16.68],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '48952', name: 'Saint-Barthélemy Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.11, 17.64],
            [-62.23, 17.64],
            [-62.23, 18.31],
            [-63.11, 18.31],
            [-63.11, 17.64],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '26526', name: 'Sint-Eustatius Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.62, 16.68],
            [-62.77, 16.68],
            [-62.77, 17.74],
            [-63.62, 17.74],
            [-63.62, 16.68],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8413',
        name: 'Saint Kitts and Nevis Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.62, 16.34],
            [-62.37, 16.34],
            [-62.37, 17.66],
            [-63.62, 17.66],
            [-63.62, 16.34],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8416', name: 'Saint Lucia Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-62.86, 13.24],
            [-60.0, 13.24],
            [-60.0, 14.27],
            [-62.86, 14.27],
            [-62.86, 13.24],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8495', name: 'Saint-Martin Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.63, 17.87],
            [-62.74, 17.87],
            [-62.74, 18.19],
            [-63.63, 18.19],
            [-63.63, 17.87],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8494',
        name: 'Saint-Pierre and Miquelon Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-57.1, 43.42],
            [-55.9, 43.42],
            [-55.9, 47.37],
            [-57.1, 47.37],
            [-57.1, 43.42],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8421',
        name: 'Saint Vincent and the Grenadines Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.37, 12.06],
            [-60.3, 12.06],
            [-60.3, 14.08],
            [-63.37, 14.08],
            [-63.37, 12.06],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '21803', name: 'Sint-Maarten Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-63.29, 17.81],
            [-62.96, 17.81],
            [-62.96, 18.06],
            [-63.29, 18.06],
            [-63.29, 17.81],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8420',
        name: 'Trinidad and Tobago Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-62.08, 9.83],
            [-57.12, 9.83],
            [-57.12, 12.35],
            [-62.08, 12.35],
            [-62.08, 9.83],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8405', name: 'Turks and Caicos Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-72.68, 20.59],
            [-68.83, 20.59],
            [-68.83, 25.03],
            [-72.68, 25.03],
            [-72.68, 20.59],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '33180', name: 'Virgin Islander Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-65.98, 15.65],
            [-63.89, 15.65],
            [-63.89, 19.62],
            [-65.98, 19.62],
            [-65.98, 15.65],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5688', name: 'Portuguese Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-13.87, 34.88],
            [-7.26, 34.88],
            [-7.26, 42.05],
            [-13.87, 42.05],
            [-13.87, 34.88],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8428', name: 'El Salvador Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-91.44, 9.94],
            [-87.6, 9.94],
            [-87.6, 13.75],
            [-91.44, 13.75],
            [-91.44, 9.94],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8457', name: 'Belizean Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-88.95, 15.89],
            [-86.17, 15.89],
            [-86.17, 18.49],
            [-88.95, 18.49],
            [-88.95, 15.89],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8406', name: 'Cuban Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-86.94, 18.83],
            [-73.58, 18.83],
            [-73.58, 25.22],
            [-86.94, 25.22],
            [-86.94, 18.83],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8408', name: 'Haitian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.96, 14.88],
            [-71.76, 14.88],
            [-71.76, 20.72],
            [-74.96, 20.72],
            [-74.96, 14.88],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '33178', name: 'Martinican Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-62.81, 14.08],
            [-57.53, 14.08],
            [-57.53, 16.49],
            [-62.81, 16.49],
            [-62.81, 14.08],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48964',
        name: 'Joint regime area Senegal / Guinea Bissau',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-20.19, 9.34],
            [-16.89, 9.34],
            [-16.89, 12.33],
            [-20.19, 12.33],
            [-20.19, 9.34],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48965',
        name: 'Overlapping claim: Venezuela / Aruba / Dominican Republic',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-70.42, 15.18],
            [-68.86, 15.18],
            [-68.86, 15.41],
            [-70.42, 15.41],
            [-70.42, 15.18],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '48966', name: 'Joint regime area Spain / France' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.67, 45.01],
            [-5.0, 45.01],
            [-5.0, 45.5],
            [-5.67, 45.5],
            [-5.67, 45.01],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48967',
        name: 'Joint regime area United Kingdom / Denmark (Faeroe Islands)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-11.27, 59.83],
            [-4.74, 59.83],
            [-4.74, 60.4],
            [-11.27, 60.4],
            [-11.27, 59.83],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '48943', name: 'Overlapping claim: Canada / USA' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-141.0, 69.65],
            [-137.5, 69.65],
            [-137.5, 73.4],
            [-141.0, 73.4],
            [-141.0, 69.65],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48968',
        name: 'Joint regime area Costa Rica / Ecuador (Galapagos)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-90.47, 1.98],
            [-86.98, 1.98],
            [-86.98, 4.72],
            [-90.47, 4.72],
            [-90.47, 1.98],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8425', name: 'Nicaraguan Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-89.42, 9.72],
            [-79.24, 9.72],
            [-79.24, 16.01],
            [-89.42, 16.01],
            [-89.42, 9.72],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8460', name: 'Guyanese Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-59.84, 6.0],
            [-55.77, 6.0],
            [-55.77, 10.7],
            [-59.84, 10.7],
            [-59.84, 6.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '48969', name: 'Joint regime area Guyana / Barbados' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-57.17, 10.6],
            [-57.08, 10.6],
            [-57.08, 10.74],
            [-57.17, 10.74],
            [-57.17, 10.6],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48970',
        name: 'Joint regime area Colombia / Dominican Republic',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-73.34, 14.67],
            [-71.67, 14.67],
            [-71.67, 15.37],
            [-73.34, 15.37],
            [-73.34, 14.67],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48971',
        name: 'Overlapping claim: Venezuela / Colombia / Dominican Republic',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-71.68, 14.96],
            [-70.42, 14.96],
            [-70.42, 15.18],
            [-71.68, 15.18],
            [-71.68, 14.96],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5681', name: 'Irish Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-16.07, 48.18],
            [-5.27, 48.18],
            [-5.27, 56.7],
            [-16.07, 56.7],
            [-16.07, 48.18],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '21788', name: 'Guernsey Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.67, 49.22],
            [-2.05, 49.22],
            [-2.05, 50.15],
            [-3.67, 50.15],
            [-3.67, 49.22],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '21789', name: 'Jersey Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.56, 48.87],
            [-1.83, 48.87],
            [-1.83, 49.43],
            [-2.56, 49.43],
            [-2.56, 48.87],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8371', name: 'Senegalese Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-20.21, 10.65],
            [-15.21, 10.65],
            [-15.21, 16.53],
            [-20.21, 16.53],
            [-20.21, 10.65],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8471', name: 'Guinea Bissau Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-19.8, 8.64],
            [-14.82, 8.64],
            [-14.82, 12.41],
            [-19.8, 12.41],
            [-19.8, 8.64],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8472', name: 'Guinean Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-17.93, 7.48],
            [-13.09, 7.48],
            [-13.09, 11.3],
            [-17.93, 11.3],
            [-17.93, 7.48],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8473', name: 'Ivory Coast Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-7.59, 1.01],
            [-2.85, 1.01],
            [-2.85, 5.54],
            [-7.59, 5.54],
            [-7.59, 1.01],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '33185',
        name: 'Overlapping claim: Trinidad and Tobago / Venezuela / Guyana',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-58.82, 10.17],
            [-57.11, 10.17],
            [-57.11, 10.98],
            [-58.82, 10.98],
            [-58.82, 10.17],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8391', name: 'Liberian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-13.57, 1.0],
            [-7.33, 1.0],
            [-7.33, 6.94],
            [-13.57, 6.94],
            [-13.57, 1.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '21792', name: 'Joint regime area Colombia / Jamaica' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.02, 14.49],
            [-78.43, 14.49],
            [-78.43, 16.17],
            [-80.02, 16.17],
            [-80.02, 14.49],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48972',
        name: 'Joint regime area Honduras / Cayman Islands',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-84.2, 18.42],
            [-83.63, 18.42],
            [-83.63, 18.95],
            [-84.2, 18.95],
            [-84.2, 18.42],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48973',
        name: 'Joint regime area Iceland / Denmark (Faeroe Islands)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-12.15, 62.54],
            [-10.09, 62.54],
            [-10.09, 63.5],
            [-12.15, 63.5],
            [-12.15, 62.54],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8433', name: 'Venezuelan Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-72.76, 8.3],
            [-58.82, 8.3],
            [-58.82, 16.75],
            [-72.76, 16.75],
            [-72.76, 8.3],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8427', name: 'Honduran Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-88.24, 12.98],
            [-80.22, 12.98],
            [-80.22, 19.54],
            [-88.24, 19.54],
            [-88.24, 12.98],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '48974', name: 'Joint regime area Ecuador / Colombia' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.98, 1.29],
            [-79.04, 1.29],
            [-79.04, 1.62],
            [-83.98, 1.62],
            [-83.98, 1.29],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48975',
        name: 'Joint regime area Iceland / Norway (Jan Mayen)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-10.5, 68.0],
            [-6.5, 68.0],
            [-6.5, 70.58],
            [-10.5, 70.58],
            [-10.5, 68.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8493', name: 'Canadian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-141.0, 40.05],
            [-47.69, 40.05],
            [-47.69, 86.43],
            [-141.0, 86.43],
            [-141.0, 40.05],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8368',
        name: 'Overlapping claim Western Saharan Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-20.67, 19.33],
            [-13.17, 19.33],
            [-13.17, 27.83],
            [-20.67, 27.83],
            [-20.67, 19.33],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8461', name: 'Surinamese Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-57.34, 5.1],
            [-52.52, 5.1],
            [-52.52, 9.35],
            [-57.34, 9.35],
            [-57.34, 5.1],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8462', name: 'French Guiana Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-54.39, 3.85],
            [-49.41, 3.85],
            [-49.41, 8.83],
            [-54.39, 8.83],
            [-54.39, 3.85],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48982',
        name: 'Overlapping claim: Puerto Rico / Dominican Republic',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-67.78, 18.88],
            [-65.84, 18.88],
            [-65.84, 21.85],
            [-67.78, 21.85],
            [-67.78, 18.88],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8452', name: 'Johnston Atoll Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-173.03, 13.36],
            [-165.98, 13.36],
            [-165.98, 20.13],
            [-173.03, 20.13],
            [-173.03, 13.36],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8426', name: 'Colombian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-84.81, 1.38],
            [-70.7, 1.38],
            [-70.7, 15.03],
            [-84.81, 15.03],
            [-84.81, 1.38],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '62596',
        name: 'Colombian Exclusive Economic Zone (Serrana)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.58, 14.08],
            [-80.02, 14.08],
            [-80.02, 14.67],
            [-80.58, 14.67],
            [-80.58, 14.08],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '62598',
        name: 'Colombian Exclusive Economic Zone (Quitasueño)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-81.45, 13.91],
            [-80.9, 13.91],
            [-80.9, 14.7],
            [-81.45, 14.7],
            [-81.45, 13.91],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48984',
        name: 'Colombian Exclusive Economic Zone (Serranilla)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.06, 15.6],
            [-79.65, 15.6],
            [-79.65, 16.0],
            [-80.06, 16.0],
            [-80.06, 15.6],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48985',
        name: 'Colombian Exclusive Economic Zone (Bajo Nuevo)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-78.84, 15.65],
            [-78.43, 15.65],
            [-78.43, 16.05],
            [-78.84, 16.05],
            [-78.84, 15.65],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8367', name: 'Moroccan Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-13.66, 27.67],
            [-2.06, 27.67],
            [-2.06, 36.01],
            [-13.66, 36.01],
            [-13.66, 27.67],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '49000',
        name: 'Overlapping claim Melilla: Spain / Morocco',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.95, 35.27],
            [-2.88, 35.27],
            [-2.88, 35.35],
            [-2.95, 35.35],
            [-2.95, 35.27],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '49001',
        name: 'Overlapping claim Alhucemas Islands: Spain / Morocco',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.91, 35.21],
            [-3.85, 35.21],
            [-3.85, 35.27],
            [-3.91, 35.27],
            [-3.91, 35.21],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48998',
        name: 'Overlapping claim Perejil Island: Spain / Morocco',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.43, 35.91],
            [-5.41, 35.91],
            [-5.41, 35.92],
            [-5.43, 35.92],
            [-5.43, 35.91],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '49002', name: 'Overlapping claim Ceuta: Spain / Morocco' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.39, 35.82],
            [-5.28, 35.82],
            [-5.28, 35.92],
            [-5.39, 35.92],
            [-5.39, 35.82],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48999',
        name: 'Overlapping claim Peñón de Vélez de la Gomera: Spain / Morocco',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-4.32, 35.17],
            [-4.29, 35.17],
            [-4.29, 35.2],
            [-4.32, 35.2],
            [-4.32, 35.17],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48997',
        name: 'Overlapping claim Chafarinas Islands: Spain / Morocco',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.52, 35.15],
            [-2.38, 35.15],
            [-2.38, 35.19],
            [-2.52, 35.19],
            [-2.52, 35.15],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8360',
        name: 'United Arab Emirates Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [51.52, 23.96],
            [57.13, 23.96],
            [57.13, 26.15],
            [51.52, 26.15],
            [51.52, 23.96],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8376', name: 'Cypriote Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [29.85, 32.89],
            [35.19, 32.89],
            [35.19, 36.22],
            [29.85, 36.22],
            [29.85, 32.89],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48947',
        name: 'Overlapping claim: Iran / United Arab Emirates',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [54.75, 25.5],
            [55.73, 25.5],
            [55.73, 26.41],
            [54.75, 26.41],
            [54.75, 25.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48956',
        name: 'Overlapping claim Doumeira Islands: Djibouti / Eritrea',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [43.13, 12.68],
            [43.3, 12.68],
            [43.3, 12.86],
            [43.13, 12.86],
            [43.13, 12.68],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8490', name: 'Egyptian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [25.14, 23.09],
            [37.26, 23.09],
            [37.26, 33.82],
            [25.14, 33.82],
            [25.14, 23.09],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8351', name: 'Eritrean Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [38.57, 12.71],
            [43.25, 12.71],
            [43.25, 18.1],
            [38.57, 18.1],
            [38.57, 12.71],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5678', name: 'Georgian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [38.98, 41.52],
            [42.35, 41.52],
            [42.35, 43.39],
            [38.98, 43.39],
            [38.98, 41.52],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8469', name: 'Iranian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [48.1, 23.35],
            [61.61, 23.35],
            [61.61, 38.71],
            [48.1, 38.71],
            [48.1, 23.35],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8374', name: 'Lebanese Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [33.69, 33.1],
            [35.99, 33.1],
            [35.99, 34.81],
            [33.69, 34.81],
            [33.69, 33.1],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8372', name: 'Libyan Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [11.56, 30.27],
            [26.19, 30.27],
            [26.19, 35.43],
            [11.56, 35.43],
            [11.56, 30.27],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5685', name: 'Maltese Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [13.42, 34.21],
            [17.5, 34.21],
            [17.5, 36.51],
            [13.42, 36.51],
            [13.42, 34.21],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8354', name: 'Omani Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [53.11, 13.76],
            [63.37, 13.76],
            [63.37, 26.74],
            [53.11, 26.74],
            [53.11, 13.76],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8356', name: 'Saudi Arabian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [34.46, 16.29],
            [51.68, 16.29],
            [51.68, 29.38],
            [34.46, 29.38],
            [34.46, 16.29],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8346', name: 'Sri Lankan Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [77.02, 2.57],
            [85.23, 2.57],
            [85.23, 11.45],
            [77.02, 11.45],
            [77.02, 2.57],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8355', name: 'Sudanese Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [36.85, 18.02],
            [39.74, 18.02],
            [39.74, 22.0],
            [36.85, 22.0],
            [36.85, 18.02],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8373', name: 'Syrian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [34.96, 34.6],
            [35.97, 34.6],
            [35.97, 36.06],
            [34.96, 36.06],
            [34.96, 34.6],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8392', name: 'Togolese Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [1.2, 2.88],
            [2.42, 2.88],
            [2.42, 6.24],
            [1.2, 6.24],
            [1.2, 2.88],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5679', name: 'Greek Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [18.26, 33.28],
            [30.1, 33.28],
            [30.1, 41.09],
            [18.26, 41.09],
            [18.26, 33.28],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5697', name: 'Turkish Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [25.44, 34.21],
            [41.55, 34.21],
            [41.55, 43.45],
            [25.44, 43.45],
            [25.44, 34.21],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '21790', name: 'Monégasque Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [7.42, 42.95],
            [7.76, 42.95],
            [7.76, 43.75],
            [7.42, 43.75],
            [7.42, 42.95],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8366', name: 'Tunisian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [7.82, 33.16],
            [13.68, 33.16],
            [13.68, 38.41],
            [7.82, 38.41],
            [7.82, 33.16],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5691', name: 'Montenegrin Exclusive economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [18.02, 41.44],
            [19.39, 41.44],
            [19.39, 42.52],
            [18.02, 42.52],
            [18.02, 41.44],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5670', name: 'Albanian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [18.32, 39.64],
            [20.02, 39.64],
            [20.02, 42.01],
            [18.32, 42.01],
            [18.32, 39.64],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5672', name: 'Bulgarian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [27.44, 41.98],
            [31.33, 41.98],
            [31.33, 43.74],
            [27.44, 43.74],
            [27.44, 41.98],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '48953', name: 'Palestinian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [34.01, 31.34],
            [34.47, 31.34],
            [34.47, 31.79],
            [34.01, 31.79],
            [34.01, 31.34],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8357', name: 'Kuwaiti Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [47.7, 28.53],
            [49.55, 28.53],
            [49.55, 30.03],
            [47.7, 30.03],
            [47.7, 28.53],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8470', name: 'Iraqi Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [47.83, 29.48],
            [48.86, 29.48],
            [48.86, 30.45],
            [47.83, 30.45],
            [47.83, 29.48],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8358', name: 'Bahraini Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [50.27, 25.54],
            [51.12, 25.54],
            [51.12, 27.17],
            [50.27, 27.17],
            [50.27, 25.54],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8468', name: 'Qatari Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [50.56, 24.51],
            [53.03, 24.51],
            [53.03, 27.04],
            [50.56, 27.04],
            [50.56, 24.51],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8353', name: 'Yemeni Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [41.08, 8.95],
            [57.95, 8.95],
            [57.95, 16.65],
            [41.08, 16.65],
            [41.08, 8.95],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8375', name: 'Israeli Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [32.97, 29.45],
            [35.11, 29.45],
            [35.11, 33.48],
            [32.97, 33.48],
            [32.97, 29.45],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8491', name: 'Jordanian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [34.89, 29.36],
            [35.0, 29.36],
            [35.0, 29.54],
            [34.89, 29.54],
            [34.89, 29.36],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8352', name: 'Djiboutian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [42.51, 11.46],
            [44.14, 11.46],
            [44.14, 12.71],
            [42.51, 12.71],
            [42.51, 11.46],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8481', name: 'Bangladeshi Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [88.93, 17.86],
            [92.43, 17.86],
            [92.43, 24.38],
            [88.93, 24.38],
            [88.93, 17.86],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8474', name: 'Nigerian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2.68, 1.92],
            [8.65, 1.92],
            [8.65, 6.62],
            [2.68, 6.62],
            [2.68, 1.92],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8475', name: 'Cameroonian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.33, 2.23],
            [10.13, 2.23],
            [10.13, 4.93],
            [8.33, 4.93],
            [8.33, 2.23],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '21797',
        name: 'Joint regime area Nigeria / Sao Tome and Principe',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [3.58, 1.15],
            [7.61, 1.15],
            [7.61, 3.04],
            [3.58, 3.04],
            [3.58, 1.15],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '48976', name: 'Joint regime area Italy / France' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [9.0, 41.27],
            [9.1, 41.27],
            [9.1, 41.34],
            [9.0, 41.34],
            [9.0, 41.27],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '22491',
        name: 'Bosnian and Herzegovinian Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [17.54, 42.88],
            [17.65, 42.88],
            [17.65, 42.94],
            [17.54, 42.94],
            [17.54, 42.88],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '48957', name: 'Guam Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [141.2, 10.95],
            [148.08, 10.95],
            [148.08, 15.73],
            [141.2, 15.73],
            [141.2, 10.95],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8318', name: 'Marshall Islands Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [157.46, 1.78],
            [175.52, 1.78],
            [175.52, 17.95],
            [157.46, 17.95],
            [157.46, 1.78],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '48980', name: 'Northern Mariana Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [141.33, 12.23],
            [149.53, 12.23],
            [149.53, 23.9],
            [141.33, 23.9],
            [141.33, 12.23],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8315', name: 'Palau Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [129.51, 1.62],
            [136.95, 1.62],
            [136.95, 11.56],
            [129.51, 11.56],
            [129.51, 1.62],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8322', name: 'Philippines Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [113.68, 3.11],
            [129.94, 3.11],
            [129.94, 22.25],
            [113.68, 22.25],
            [113.68, 3.11],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48954',
        name: 'Overlapping claim Senkaku Islands: Japan / China / Taiwan',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [122.61, 25.05],
            [125.68, 25.05],
            [125.68, 28.31],
            [122.61, 28.31],
            [122.61, 25.05],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8485', name: 'Singaporean Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [103.55, 1.13],
            [104.1, 1.13],
            [104.1, 1.48],
            [103.55, 1.48],
            [103.55, 1.13],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8332', name: 'Thailand Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [95.53, 5.95],
            [103.05, 5.95],
            [103.05, 13.73],
            [95.53, 13.73],
            [95.53, 5.95],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8319', name: 'Wake Island Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [163.07, 16.05],
            [170.19, 16.05],
            [170.19, 22.67],
            [163.07, 22.67],
            [163.07, 16.05],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8484', name: 'Vietnamese Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [102.2, 6.1],
            [112.88, 6.1],
            [112.88, 21.55],
            [102.2, 21.55],
            [102.2, 6.1],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '21796', name: 'Joint regime area Japan / Korea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [125.93, 28.6],
            [129.15, 28.6],
            [129.15, 32.95],
            [125.93, 32.95],
            [125.93, 28.6],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '26521', name: 'Bruneian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [111.73, 4.55],
            [115.26, 4.55],
            [115.26, 7.59],
            [111.73, 7.59],
            [111.73, 4.55],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8321', name: 'Taiwanese Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.24, 17.26],
            [123.54, 17.26],
            [123.54, 26.93],
            [114.24, 26.93],
            [114.24, 17.26],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8328', name: 'North Korean Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [123.56, 36.97],
            [133.18, 36.97],
            [133.18, 42.43],
            [123.56, 42.43],
            [123.56, 36.97],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8331', name: 'Cambodian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [101.3, 8.78],
            [104.52, 8.78],
            [104.52, 11.83],
            [101.3, 11.83],
            [101.3, 8.78],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8486', name: 'Chinese Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [107.16, 15.98],
            [126.19, 15.98],
            [126.19, 41.16],
            [107.16, 41.16],
            [107.16, 15.98],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5675', name: 'Estonian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [20.37, 57.59],
            [28.21, 57.59],
            [28.21, 59.99],
            [20.37, 59.99],
            [20.37, 57.59],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5676', name: 'Finnish Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [19.08, 58.84],
            [27.83, 58.84],
            [27.83, 66.78],
            [19.08, 66.78],
            [19.08, 58.84],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5694', name: 'Swedish Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.03, 54.96],
            [24.19, 54.96],
            [24.19, 67.08],
            [10.03, 67.08],
            [10.03, 54.96],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5684', name: 'Lithuanian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [19.02, 55.18],
            [21.54, 55.18],
            [21.54, 56.07],
            [19.02, 56.07],
            [19.02, 55.18],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '48977', name: 'Joint regime area Sweden / Norway' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.27, 58.76],
            [10.64, 58.76],
            [10.64, 58.89],
            [10.27, 58.89],
            [10.27, 58.76],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '3293', name: 'Belgian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2.24, 51.09],
            [3.37, 51.09],
            [3.37, 51.88],
            [2.24, 51.88],
            [2.24, 51.09],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5668', name: 'Dutch Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2.54, 51.04],
            [7.21, 51.04],
            [7.21, 55.77],
            [2.54, 55.77],
            [2.54, 51.04],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5669', name: 'German Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [3.35, 52.87],
            [14.75, 52.87],
            [14.75, 55.92],
            [3.35, 55.92],
            [3.35, 52.87],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5674', name: 'Danish Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [3.25, 54.36],
            [16.51, 54.36],
            [16.51, 58.26],
            [3.25, 58.26],
            [3.25, 54.36],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5683', name: 'Latvian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [19.1, 56.04],
            [24.41, 56.04],
            [24.41, 58.02],
            [19.1, 58.02],
            [19.1, 56.04],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5673', name: 'Croatian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [13.01, 41.63],
            [18.55, 41.63],
            [18.55, 45.56],
            [13.01, 45.56],
            [13.01, 41.63],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5682', name: 'Italian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [5.89, 35.06],
            [19.0, 35.06],
            [19.0, 45.81],
            [5.89, 45.81],
            [5.89, 35.06],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '5695',
        name: 'Overlapping claim Ukrainian Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [29.6, 43.19],
            [38.34, 43.19],
            [38.34, 47.31],
            [29.6, 47.31],
            [29.6, 43.19],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5689', name: 'Romanian Exclusive economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [28.53, 43.44],
            [31.41, 43.44],
            [31.41, 45.21],
            [28.53, 45.21],
            [28.53, 43.44],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8487', name: 'Japanese Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [122.39, 17.07],
            [157.64, 17.07],
            [157.64, 46.1],
            [122.39, 46.1],
            [122.39, 17.07],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48950',
        name: 'Overlapping claim Kuril Islands: Japan / Russia',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [145.23, 40.32],
            [151.04, 40.32],
            [151.04, 47.73],
            [145.23, 47.73],
            [145.23, 40.32],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8333',
        name: 'Indian Exclusive Economic Zone (Andaman and Nicobar Islands)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [88.8, 3.84],
            [95.7, 3.84],
            [95.7, 15.72],
            [88.8, 15.72],
            [88.8, 3.84],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8359', name: 'Pakistani Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [61.42, 20.98],
            [68.91, 20.98],
            [68.91, 25.6],
            [61.42, 25.6],
            [61.42, 20.98],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '26523', name: 'Turkmen Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [51.38, 37.32],
            [54.01, 37.32],
            [54.01, 41.76],
            [51.38, 41.76],
            [51.38, 37.32],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '26524', name: 'Azerbaijanis Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [48.59, 38.29],
            [51.82, 38.29],
            [51.82, 42.61],
            [48.59, 42.61],
            [48.59, 38.29],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '26522', name: 'Kazakh Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [49.0, 41.22],
            [53.85, 41.22],
            [53.85, 47.13],
            [49.0, 47.13],
            [49.0, 41.22],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8482', name: 'Myanmar Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [90.14, 9.43],
            [99.14, 9.43],
            [99.14, 21.13],
            [90.14, 21.13],
            [90.14, 9.43],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5687', name: 'Polish Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [14.2, 52.65],
            [19.8, 52.65],
            [19.8, 55.92],
            [14.2, 55.92],
            [14.2, 52.65],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8480', name: 'Indian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [65.64, 4.79],
            [89.37, 4.79],
            [89.37, 23.99],
            [65.64, 23.99],
            [65.64, 4.79],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '26582', name: 'Overlapping claim: Sudan / Egypt' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [35.61, 21.89],
            [37.83, 21.89],
            [37.83, 23.33],
            [35.61, 23.33],
            [35.61, 21.89],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8393', name: 'Beninese Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [1.63, 2.97],
            [2.98, 2.97],
            [2.98, 6.51],
            [1.63, 6.51],
            [1.63, 2.97],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5692', name: 'Slovenian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [13.39, 45.47],
            [13.75, 45.47],
            [13.75, 45.63],
            [13.39, 45.63],
            [13.39, 45.47],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8483', name: 'Malaysian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [98.03, 1.21],
            [119.49, 1.21],
            [119.49, 8.99],
            [98.03, 8.99],
            [98.03, 1.21],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '49003', name: 'Overlapping claim South China Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [109.57, 6.1],
            [116.57, 6.1],
            [116.57, 18.23],
            [109.57, 18.23],
            [109.57, 6.1],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '50167', name: 'Joint regime area Croatia / Slovenia' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [13.21, 45.4],
            [13.45, 45.4],
            [13.45, 45.56],
            [13.21, 45.56],
            [13.21, 45.4],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8327', name: 'South Korean Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [122.9, 30.77],
            [133.81, 30.77],
            [133.81, 39.84],
            [122.9, 39.84],
            [122.9, 30.77],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '48955',
        name: 'Overlapping claim Liancourt Rocks: Japan / South Korea',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [131.61, 37.04],
            [132.12, 37.04],
            [132.12, 37.45],
            [131.61, 37.45],
            [131.61, 37.04],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '50170',
        name: 'Overlapping claim Qatar / Saudi Arabia / United Arab Emirates',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [51.44, 24.64],
            [51.73, 24.64],
            [51.73, 24.75],
            [51.44, 24.75],
            [51.44, 24.64],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8442', name: 'Jarvis Island Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-163.35, -3.73],
            [-157.0, -3.73],
            [-157.0, 2.04],
            [-163.35, 2.04],
            [-163.35, -3.73],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8451',
        name: 'Howland and Baker Islands Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-179.95, -3.01],
            [-173.14, -3.01],
            [-173.14, 4.17],
            [-179.95, 4.17],
            [-179.95, -3.01],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8464', name: 'Brazilian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-54.58, -35.79],
            [-26.01, -35.79],
            [-26.01, 7.05],
            [-54.58, 7.05],
            [-54.58, -35.79],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8441',
        name: 'Kiribati Exclusive Economic Zone (Line Islands)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-163.06, -13.84],
            [-146.81, -13.84],
            [-146.81, 7.88],
            [-163.06, 7.88],
            [-163.06, -13.84],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8403',
        name: 'Ecuadorian Exclusive Economic Zone (Galapagos)',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-95.34, -4.76],
            [-85.91, -4.76],
            [-85.91, 5.03],
            [-95.34, 5.03],
            [-95.34, -4.76],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8431', name: 'Ecuadorian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-84.49, -3.44],
            [-78.76, -3.44],
            [-78.76, 1.46],
            [-84.49, 1.46],
            [-84.49, -3.44],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8397',
        name: 'Sao Tome and Principe Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [3.2, -1.48],
            [8.55, -1.48],
            [8.55, 2.71],
            [3.2, 2.71],
            [3.2, -1.48],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8316', name: 'Micronesian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [135.31, -1.17],
            [165.68, -1.17],
            [165.68, 13.45],
            [135.31, 13.45],
            [135.31, -1.17],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8398',
        name: 'Equatorial Guinean Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [2.29, -4.82],
            [9.92, -4.82],
            [9.92, 4.12],
            [2.29, 4.12],
            [2.29, -4.82],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8345', name: 'Maldives Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [69.21, -3.31],
            [77.11, -3.31],
            [77.11, 8.09],
            [69.21, 8.09],
            [69.21, -3.31],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8324', name: 'Papua New Guinean Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [139.2, -14.75],
            [162.8, -14.75],
            [162.8, 2.6],
            [139.2, 2.6],
            [139.2, -14.75],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8350', name: 'Somali Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [41.57, -1.65],
            [54.45, -1.65],
            [54.45, 13.52],
            [41.57, 13.52],
            [41.57, -1.65],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8317', name: 'Nauruan Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [163.58, -3.91],
            [168.56, -3.91],
            [168.56, 2.69],
            [163.58, 2.69],
            [163.58, -3.91],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8476', name: 'Gabonese Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [6.92, -6.45],
            [11.18, -6.45],
            [11.18, 1.07],
            [6.92, 1.07],
            [6.92, -6.45],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8492', name: 'Indonesian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [92.05, -13.94],
            [141.4, -13.94],
            [141.4, 7.78],
            [92.05, 7.78],
            [92.05, -13.94],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5677', name: 'French Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-9.88, 41.24],
            [10.22, 41.24],
            [10.22, 51.56],
            [-9.88, 51.56],
            [-9.88, 41.24],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8378', name: 'Algerian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.21, 35.07],
            [8.64, 35.07],
            [8.64, 38.8],
            [-2.21, 38.8],
            [-2.21, 35.07],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8400', name: 'Ghanaian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.79, 1.39],
            [2.17, 1.39],
            [2.17, 6.12],
            [-3.79, 6.12],
            [-3.79, 1.39],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8438', name: 'Greenlandic Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-75.0, 56.39],
            [7.97, 56.39],
            [7.97, 86.99],
            [-75.0, 86.99],
            [-75.0, 56.39],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5696', name: 'United Kingdom Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-14.9, 47.44],
            [3.4, 47.44],
            [3.4, 63.89],
            [-14.9, 63.89],
            [-14.9, 47.44],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '33181', name: 'Svalbard Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-3.34, 72.17],
            [38.0, 72.17],
            [38.0, 84.15],
            [-3.34, 84.15],
            [-3.34, 72.17],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5686', name: 'Norwegian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.49, 56.09],
            [36.54, 56.09],
            [36.54, 74.5],
            [-0.49, 74.5],
            [-0.49, 56.09],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8437', name: 'Jan Mayen Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-13.63, 67.61],
            [2.39, 67.61],
            [2.39, 74.36],
            [-13.63, 74.36],
            [-13.63, 67.61],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '5693', name: 'Spanish Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-13.85, 35.67],
            [6.3, 35.67],
            [6.3, 46.87],
            [-13.85, 46.87],
            [-13.85, 35.67],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '62589',
        name: 'Chagos Archipelago Exclusive Economic Zone',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [67.88, -10.8],
            [75.85, -10.8],
            [75.85, -2.29],
            [67.88, -2.29],
            [67.88, -10.8],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'EEZ',
        mrgid: '8383',
        name: 'Overlapping claim South Georgia and South Sandwich Islands: UK / Argentina',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-43.96, -62.79],
            [-19.9, -62.79],
            [-19.9, -50.64],
            [-43.96, -50.64],
            [-43.96, -62.79],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8402', name: 'Bermudian Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-68.92, 28.91],
            [-60.7, 28.91],
            [-60.7, 35.81],
            [-68.92, 35.81],
            [-68.92, 28.91],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'EEZ', mrgid: '8456', name: 'United States Exclusive Economic Zone' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-129.23, 23.83],
            [-65.7, 23.83],
            [-65.7, 49.09],
            [-129.23, 49.09],
            [-129.23, 23.83],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4325', name: 'Rio de La Plata' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-59.77, -36.36],
            [-54.94, -36.36],
            [-54.94, -31.52],
            [-59.77, -31.52],
            [-59.77, -36.36],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4366', name: 'Bass Strait' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [143.53, -41.44],
            [149.91, -41.44],
            [149.91, -37.46],
            [143.53, -37.46],
            [143.53, -41.44],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4276', name: 'Great Australian Bight' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [117.61, -43.57],
            [146.23, -43.57],
            [146.23, -31.46],
            [117.61, -31.46],
            [117.61, -43.57],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4365', name: 'Tasman Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [146.87, -50.87],
            [175.29, -50.87],
            [175.29, -30.0],
            [146.87, -30.0],
            [146.87, -50.87],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4261', name: 'Mozambique Channel' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [32.43, -26.84],
            [49.24, -26.84],
            [49.24, -10.5],
            [32.43, -10.5],
            [32.43, -26.84],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4343', name: 'Savu Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [118.5, -10.92],
            [125.01, -10.92],
            [125.01, -8.21],
            [118.5, -8.21],
            [118.5, -10.92],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4344', name: 'Timor Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [122.85, -15.8],
            [132.93, -15.8],
            [132.93, -8.18],
            [122.85, -8.18],
            [122.85, -15.8],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4340', name: 'Bali Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [114.34, -9.0],
            [117.17, -9.0],
            [117.17, -7.01],
            [114.34, -7.01],
            [114.34, -9.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4364', name: 'Coral Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [141.02, -30.0],
            [169.87, -30.0],
            [169.87, -6.79],
            [141.02, -6.79],
            [141.02, -30.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4341', name: 'Flores Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [117.13, -8.74],
            [122.94, -8.74],
            [122.94, -5.51],
            [117.13, -5.51],
            [117.13, -8.74],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4361', name: 'Solomon Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [146.95, -11.88],
            [162.35, -11.88],
            [162.35, -4.83],
            [146.95, -4.83],
            [146.95, -11.88],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4347', name: 'Arafura Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [130.76, -18.01],
            [142.2, -18.01],
            [142.2, -2.9],
            [130.76, -2.9],
            [130.76, -18.01],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4350', name: 'Gulf of Boni' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.19, -5.62],
            [121.87, -5.62],
            [121.87, -2.58],
            [120.19, -2.58],
            [120.19, -5.62],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4338', name: 'Java Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [104.53, -7.81],
            [119.49, -7.81],
            [119.49, -1.55],
            [104.53, -1.55],
            [104.53, -7.81],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4351', name: 'Ceram Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [125.92, -5.27],
            [134.03, -5.27],
            [134.03, -1.19],
            [125.92, -1.19],
            [125.92, -5.27],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4360', name: 'Bismarck Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [141.99, -5.96],
            [152.88, -5.96],
            [152.88, -1.07],
            [141.99, -1.07],
            [141.99, -5.96],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4349', name: 'Banda Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.47, -8.86],
            [133.15, -8.86],
            [133.15, -0.84],
            [120.47, -0.84],
            [120.47, -8.86],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4314', name: 'Gulf of California' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-115.04, 22.88],
            [-106.79, 22.88],
            [-106.79, 31.95],
            [-115.04, 31.95],
            [-115.04, 22.88],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4289', name: 'Bay of Fundy' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-67.32, 44.09],
            [-63.3, 44.09],
            [-63.3, 46.2],
            [-67.32, 46.2],
            [-67.32, 44.09],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '3346', name: 'Strait of Gibraltar' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-6.03, 35.78],
            [-5.28, 35.78],
            [-5.28, 36.19],
            [-6.03, 36.19],
            [-6.03, 35.78],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '3324', name: 'Alboran Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.35, 35.07],
            [-1.19, 35.07],
            [-1.19, 36.84],
            [-5.35, 36.84],
            [-5.35, 35.07],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4287', name: 'Caribbean Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-89.41, 7.71],
            [-59.42, 7.71],
            [-59.42, 22.71],
            [-89.41, 22.71],
            [-89.41, 7.71],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4312', name: 'Gulf of Alaska' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-163.36, 54.3],
            [-136.62, 54.3],
            [-136.62, 61.55],
            [-163.36, 61.55],
            [-163.36, 54.3],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4310', name: 'Bering Sea' },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [180.0, 51.35],
              [180.0, 66.56],
              [-180.0, 66.56],
              [-180.0, 51.35],
              [180.0, 51.35],
            ],
          ],
          [
            [
              [-180.0, 66.56],
              [-180.0, 51.35],
              [-180.0, 51.35],
              [-180.0, 66.56],
              [-180.0, 66.56],
            ],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4257', name: 'Chukchi Sea' },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [180.0, 65.93],
              [180.0, 71.71],
              [180.0, 71.71],
              [180.0, 65.93],
              [180.0, 65.93],
            ],
          ],
          [
            [
              [-180.0, 65.93],
              [-180.0, 65.93],
              [-180.0, 71.71],
              [-180.0, 71.71],
              [-180.0, 65.93],
            ],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4256', name: 'Beaufort Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-156.66, 67.6],
            [-122.65, 67.6],
            [-122.65, 76.36],
            [-156.66, 76.36],
            [-156.66, 67.6],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4291', name: 'Labrador Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-64.31, 47.39],
            [-43.67, 47.39],
            [-43.67, 60.4],
            [-64.31, 60.4],
            [-64.31, 47.39],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4251', name: 'Hudson Strait' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-80.95, 55.84],
            [-64.43, 55.84],
            [-64.43, 64.98],
            [-80.95, 64.98],
            [-80.95, 55.84],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4250', name: 'Davis Strait' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-70.14, 59.89],
            [-44.46, 59.89],
            [-44.46, 70.07],
            [-70.14, 70.07],
            [-70.14, 59.89],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4253', name: 'Baffin Bay' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-82.2, 69.62],
            [-50.52, 69.62],
            [-50.52, 82.45],
            [-82.2, 82.45],
            [-82.2, 69.62],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4254', name: 'Lincoln Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-70.2, 81.5],
            [-37.01, 81.5],
            [-37.01, 83.56],
            [-70.2, 83.56],
            [-70.2, 81.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '3141', name: 'Bristol Channel' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-4.92, 50.99],
            [-2.35, 50.99],
            [-2.35, 51.82],
            [-4.92, 51.82],
            [-4.92, 50.99],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '2357', name: "Irish Sea and St. George's Channel" },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-6.57, 51.9],
            [-2.64, 51.9],
            [-2.64, 55.0],
            [-6.57, 55.0],
            [-6.57, 51.9],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'Ocean Area',
        mrgid: '4283',
        name: 'Inner Seas off the West Coast of Scotland',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-8.25, 54.34],
            [-4.46, 54.34],
            [-4.46, 58.62],
            [-8.25, 58.62],
            [-8.25, 54.34],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4265', name: 'Gulf of Aden' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [42.51, 10.38],
            [51.29, 10.38],
            [51.29, 15.22],
            [42.51, 15.22],
            [42.51, 10.38],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4267', name: 'Gulf of Oman' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [56.27, 22.47],
            [61.78, 22.47],
            [61.78, 25.94],
            [56.27, 25.94],
            [56.27, 22.47],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4264', name: 'Red Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [33.64, 12.46],
            [43.51, 12.46],
            [43.51, 28.14],
            [33.64, 28.14],
            [33.64, 12.46],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4263', name: 'Gulf of Aqaba' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [34.33, 27.9],
            [35.0, 27.9],
            [35.0, 29.55],
            [34.33, 29.55],
            [34.33, 27.9],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4266', name: 'Persian Gulf' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [47.7, 23.96],
            [57.34, 23.96],
            [57.34, 31.19],
            [47.7, 31.19],
            [47.7, 23.96],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '3351', name: 'Ionian Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [15.08, 36.41],
            [23.22, 36.41],
            [23.22, 40.52],
            [15.08, 40.52],
            [15.08, 36.41],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '3386', name: 'Tyrrhenian Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [8.65, 37.8],
            [16.22, 37.8],
            [16.22, 44.11],
            [8.65, 44.11],
            [8.65, 37.8],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '3314', name: 'Adriatic Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [12.07, 39.74],
            [20.02, 39.74],
            [20.02, 45.81],
            [12.07, 45.81],
            [12.07, 39.74],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4262', name: 'Gulf of Suez' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [32.34, 27.45],
            [34.23, 27.45],
            [34.23, 30.07],
            [32.34, 30.07],
            [32.34, 27.45],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4280', name: 'Mediterranean Sea - Eastern Basin' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [10.02, 30.07],
            [36.22, 30.07],
            [36.22, 37.8],
            [10.02, 37.8],
            [10.02, 30.07],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '3315', name: 'Aegean Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [22.53, 35.11],
            [28.33, 35.11],
            [28.33, 41.09],
            [22.53, 41.09],
            [22.53, 35.11],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '3369', name: 'Sea of Marmara' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [26.17, 40.0],
            [29.94, 40.0],
            [29.94, 41.23],
            [26.17, 41.23],
            [26.17, 40.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4336', name: 'Singapore Strait' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [103.35, 1.07],
            [104.58, 1.07],
            [104.58, 1.7],
            [103.35, 1.7],
            [103.35, 1.07],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4359', name: 'Celebes Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [116.72, 0.8],
            [125.61, 0.8],
            [125.61, 7.85],
            [116.72, 7.85],
            [116.72, 0.8],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4275', name: 'Malacca Strait' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [95.44, 0.86],
            [103.51, 0.86],
            [103.51, 8.45],
            [95.44, 8.45],
            [95.44, 0.86],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4358', name: 'Sulu Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [116.74, 5.02],
            [123.42, 5.02],
            [123.42, 13.45],
            [116.74, 13.45],
            [116.74, 5.02],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4334', name: 'Gulf of Thailand' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [99.13, 5.39],
            [105.36, 5.39],
            [105.36, 13.73],
            [99.13, 13.73],
            [99.13, 5.39],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4302', name: 'Eastern China Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [118.48, 24.06],
            [131.13, 24.06],
            [131.13, 33.37],
            [118.48, 33.37],
            [118.48, 24.06],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4306', name: 'Seto Naikai or Inland Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [130.84, 33.2],
            [135.67, 33.2],
            [135.67, 34.86],
            [130.84, 34.86],
            [130.84, 33.2],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4300', name: 'Philippine Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.1, 2.5],
            [146.05, 2.5],
            [146.05, 35.26],
            [120.1, 35.26],
            [120.1, 2.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4303', name: 'Yellow Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [117.52, 33.28],
            [127.46, 33.28],
            [127.46, 41.16],
            [117.52, 41.16],
            [117.52, 33.28],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '2409', name: 'Gulf of Riga' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [21.73, 56.8],
            [24.62, 56.8],
            [24.62, 59.21],
            [21.73, 59.21],
            [21.73, 56.8],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '2401', name: 'Baltic Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [9.52, 52.65],
            [23.51, 52.65],
            [23.51, 59.94],
            [9.52, 59.94],
            [9.52, 52.65],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '2407', name: 'Gulf of Finland' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [22.91, 59.21],
            [37.47, 59.21],
            [37.47, 62.92],
            [22.91, 62.92],
            [22.91, 59.21],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '2402', name: 'Gulf of Bothnia' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [17.04, 59.72],
            [25.49, 59.72],
            [25.49, 67.08],
            [17.04, 67.08],
            [17.04, 59.72],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4248', name: 'White Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [32.13, 60.95],
            [45.67, 60.95],
            [45.67, 68.66],
            [32.13, 68.66],
            [32.13, 60.95],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4244', name: 'East Siberian Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [139.03, 64.32],
            [180.0, 64.32],
            [180.0, 77.1],
            [139.03, 77.1],
            [139.03, 64.32],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '1914', name: 'South Atlantic Ocean' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-69.6, -60.0],
            [20.01, -60.0],
            [20.01, 0.08],
            [-69.6, 0.08],
            [-69.6, -60.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '1907', name: 'Southern Ocean' },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [180.0, -85.56],
              [180.0, -60.0],
              [-180.0, -60.0],
              [-180.0, -85.56],
              [180.0, -85.56],
            ],
          ],
          [
            [
              [-180.0, -60.0],
              [-180.0, -85.56],
              [-180.0, -85.56],
              [-180.0, -60.0],
              [-180.0, -60.0],
            ],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '1910', name: 'South Pacific Ocean' },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [180.0, -60.0],
              [180.0, 3.39],
              [-180.0, 3.39],
              [-180.0, -60.0],
              [180.0, -60.0],
            ],
          ],
          [
            [
              [-180.0, 3.39],
              [-180.0, -60.0],
              [-180.0, -60.0],
              [-180.0, 3.39],
              [-180.0, 3.39],
            ],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4355', name: 'Gulf of Tomini' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [120.01, -1.44],
            [123.41, -1.44],
            [123.41, 0.56],
            [120.01, 0.56],
            [120.01, -1.44],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4339', name: 'Makassar Strait' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [115.95, -5.6],
            [120.83, -5.6],
            [120.83, 1.32],
            [115.95, 1.32],
            [115.95, -5.6],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4353', name: 'Halmahera Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [127.55, -1.68],
            [130.93, -1.68],
            [130.93, 2.49],
            [127.55, 2.49],
            [127.55, -1.68],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4354', name: 'Molukka Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [123.29, -1.84],
            [128.57, -1.84],
            [128.57, 4.49],
            [123.29, 4.49],
            [123.29, -1.84],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '1904', name: 'Indian Ocean' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [20.0, -60.0],
            [146.9, -60.0],
            [146.9, 10.44],
            [20.0, 10.44],
            [20.0, -60.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4273', name: 'Bay of Bengal' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [78.9, 5.73],
            [95.05, 5.73],
            [95.05, 24.38],
            [78.9, 24.38],
            [78.9, 5.73],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4332', name: 'South China Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [102.24, -3.23],
            [122.15, -3.23],
            [122.15, 25.57],
            [102.24, 25.57],
            [102.24, -3.23],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4268', name: 'Arabian Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [51.02, -0.7],
            [74.34, -0.7],
            [74.34, 25.6],
            [51.02, 25.6],
            [51.02, -0.7],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '1908', name: 'North Pacific Ocean' },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [180.0, 0.0],
              [180.0, 58.21],
              [-180.0, 58.21],
              [-180.0, 0.0],
              [180.0, 0.0],
            ],
          ],
          [
            [
              [-180.0, 58.21],
              [-180.0, 0.0],
              [-180.0, 0.0],
              [-180.0, 58.21],
              [-180.0, 58.21],
            ],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'Ocean Area',
        mrgid: '4313',
        name: 'The Coastal Waters of Southeast Alaska and British Columbia',
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-137.13, 47.02],
            [-122.15, 47.02],
            [-122.15, 59.5],
            [-137.13, 59.5],
            [-137.13, 47.02],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4288', name: 'Gulf of Mexico' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-98.05, 17.41],
            [-80.43, 17.41],
            [-80.43, 31.46],
            [-98.05, 31.46],
            [-98.05, 17.41],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '1912', name: 'North Atlantic Ocean' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.01, -0.0],
            [6.62, -0.0],
            [6.62, 68.64],
            [-83.01, 68.64],
            [-83.01, -0.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4290', name: 'Gulf of St. Lawrence' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-74.86, 44.96],
            [-54.7, 44.96],
            [-54.7, 52.22],
            [-74.86, 52.22],
            [-74.86, 44.96],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '3322', name: 'Balearic (Iberian Sea)' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-0.37, 38.65],
            [4.29, 38.65],
            [4.29, 41.87],
            [-0.37, 41.87],
            [-0.37, 38.65],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '2359', name: 'Bay of Biscay' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-7.9, 43.27],
            [-0.15, 43.27],
            [-0.15, 47.99],
            [-7.9, 47.99],
            [-7.9, 43.27],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '2351', name: 'Celtic Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-11.5, 46.5],
            [-4.14, 46.5],
            [-4.14, 52.4],
            [-11.5, 52.4],
            [-11.5, 46.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4279', name: 'Mediterranean Sea - Western Basin' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-2.19, 35.57],
            [12.42, 35.57],
            [12.42, 43.92],
            [-2.19, 43.92],
            [-2.19, 35.57],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4252', name: 'Hudson Bay' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-95.35, 51.14],
            [-75.88, 51.14],
            [-75.88, 66.03],
            [-95.35, 66.03],
            [-95.35, 51.14],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '5698', name: 'The Northwestern Passages' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-128.01, 63.76],
            [-69.09, 63.76],
            [-69.09, 81.7],
            [-128.01, 81.7],
            [-128.01, 63.76],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '1906', name: 'Arctic Ocean' },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [
            [
              [180.0, 71.39],
              [180.0, 90.0],
              [-180.0, 90.0],
              [-180.0, 71.39],
              [180.0, 71.39],
            ],
          ],
          [
            [
              [-180.0, 90.0],
              [-180.0, 90.0],
              [-180.0, 71.39],
              [-180.0, 71.39],
              [-180.0, 90.0],
            ],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '2389', name: 'English Channel' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-5.71, 48.5],
            [1.93, 48.5],
            [1.93, 51.17],
            [-5.71, 51.17],
            [-5.71, 48.5],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4247', name: 'Barentsz Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [16.58, 65.88],
            [68.58, 65.88],
            [68.58, 81.85],
            [16.58, 81.85],
            [16.58, 65.88],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '2356', name: 'Greenland Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-35.99, 65.01],
            [17.48, 65.01],
            [17.48, 82.78],
            [-35.99, 82.78],
            [-35.99, 65.01],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '2350', name: 'North Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-4.45, 51.0],
            [12.01, 51.0],
            [12.01, 61.02],
            [-4.45, 61.02],
            [-4.45, 51.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4274', name: 'Andaman or Burma Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [92.39, 5.53],
            [99.14, 5.53],
            [99.14, 17.75],
            [92.39, 17.75],
            [92.39, 5.53],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '3319', name: 'Black Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [27.44, 40.91],
            [42.35, 40.91],
            [42.35, 47.31],
            [27.44, 47.31],
            [27.44, 40.91],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '3320', name: 'Sea of Azov' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [34.52, 45.1],
            [40.43, 45.1],
            [40.43, 47.38],
            [34.52, 47.38],
            [34.52, 45.1],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4307', name: 'Japan Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [125.8, 32.58],
            [142.26, 32.58],
            [142.26, 51.75],
            [125.8, 51.75],
            [125.8, 32.58],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4309', name: 'Sea of Okhotsk' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [135.17, 43.22],
            [167.17, 43.22],
            [167.17, 62.92],
            [135.17, 62.92],
            [135.17, 43.22],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4246', name: 'Kara Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [54.93, 64.43],
            [107.61, 64.43],
            [107.61, 81.27],
            [54.93, 81.27],
            [54.93, 64.43],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4245', name: 'Laptev Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [93.66, 63.69],
            [141.23, 63.69],
            [141.23, 81.27],
            [93.66, 81.27],
            [93.66, 63.69],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '2374', name: 'Kattegat' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [9.37, 54.63],
            [13.06, 54.63],
            [13.06, 58.08],
            [9.37, 58.08],
            [9.37, 54.63],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4269', name: 'Laccadive Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [71.98, -0.69],
            [80.59, -0.69],
            [80.59, 14.79],
            [71.98, 14.79],
            [71.98, -0.69],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '2379', name: 'Skagerrak' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [7.0, 57.1],
            [11.92, 57.1],
            [11.92, 59.92],
            [7.0, 59.92],
            [7.0, 57.1],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '2353', name: 'Norwegian Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-13.5, 60.86],
            [25.79, 60.86],
            [25.79, 76.56],
            [-13.5, 76.56],
            [-13.5, 60.86],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '3363', name: 'Ligurian Sea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [7.54, 42.86],
            [9.85, 42.86],
            [9.85, 44.43],
            [7.54, 44.43],
            [7.54, 42.86],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { type: 'Ocean Area', mrgid: '4286', name: 'Gulf of Guinea' },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-7.73, -0.94],
            [10.18, -0.94],
            [10.18, 6.62],
            [-7.73, 6.62],
            [-7.73, -0.94],
          ],
        ],
      },
    },
  ],
}

export default oceanAreas
