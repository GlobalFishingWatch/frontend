// // import the original type declarations
// import 'i18next'
// // import all namespaces (for the default language, only)
// /**
//  * If you want to enable locale keys typechecking and enhance IDE experience.
//  *
//  * Requires `resolveJsonModule:true` in your tsconfig.json.
//  *
//  * @link https://www.i18next.com/overview/typescript
//  */

// import { datasets, flags, timebar } from '@globalfishingwatch/i18n-labels'
// import translations from '../../public/locales/source/translations.json'
// import helphints from '../../public/locales/source/helphints.json'
// import dataTerminology from '../../public/locales/source/data-terminology.json'

// export declare module 'i18next' {
//   // Extend CustomTypeOptions
//   interface CustomTypeOptions {
//     // custom namespace type, if you changed it
//     defaultNS: 'translations'
//     // custom resources type
//     resources: {
//       translations: typeof translations
//       helphints: typeof helphints
//       'data-terminology': typeof dataTerminology
//       datasets: typeof datasets
//       timebar: typeof timebar
//       flags: typeof flags
//     }
//   }
// }
