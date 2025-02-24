This monorepo hosts frontend packages and applications of the <a href="https://globalfishingwatch.org/map">GlobalFishingWatch</a> ecosystem.

## Packages

All of them availables with the `@globalfishingwatch/` prefix:

|                                                 |                                                                                             |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [api-client](libs/api-client)                   | JS library to simplify GFW API login and resources fetch                                    |
| [api-types](libs/api-types)                     | API typescript schema definitions                                                           |
| [data-transforms](libs/data-transforms)         | Set ot shared tools for data transformations                                                |
| [datasets-client](libs/datasets-client)         | A set of utils for handling api datasets                                                    |
| [dataviews-client](libs/dataviews-client)       | A set of utils for merge, combine and consume api dataviews into the apps                   |
| [deck-layer-composer](libs/deck-layer-composer) | Map integration of the deck-layers                                                          |
| [deck-layers](libs/deck-layers)                 | Deck classes for GFW layers                                                                 |
| [deck-loaders](libs/deck-loaders)               | Deck loaders for GFW layers                                                                 |
| [fourwings-aggregate](libs/fourwings-aggregate) | 🗑️ Legacy 🗑️ Logic to turn fourwings tiles or cells into meaningful values for the frontend |
| [i18n-labels](libs/i18n-labels)                 | GFW shared translations                                                                     |
| [layer-composer](libs/layer-composer)           | 🗑️ Legacy 🗑️ Orchestrates various Layer Generators to generate a Mapbox GL Style document   |
| [ocean-areas](libs/ocean-areas)                 | Small library to get ocean area / eez names by viewport or by text search                   |
| [pbf-decoders](libs/pbf-decoders)               | PBF custom responses parsers                                                                |
| [react-hooks](libs/react-hooks)                 | Set of hooks to use libraries easily in react                                               |
| [timebar](libs/timebar)                         | Timebar component, not many more to say                                                     |
| [ui-components](libs/ui-components)             | Reusable atoms components kit                                                               |

## Applications

|                                                     |                                        |
| --------------------------------------------------- | -------------------------------------- |
| [api-portal](apps/api-portal)                       | Api documentation portal               |
| [data-download-portal](apps/data-download-portal)   | The place to download datasets         |
| [fishing-map-e2e](apps/fishing-map-e2e)             | Cypress e2e testing for the map        |
| [fishing-map](apps/fishing-map)                     | Version 3.0 of the fishing map project |
| [image-labeler](apps/image-labeler)                 | Labeling tool for satellite images     |
| [port-labeler](apps/port-labeler)                   | Labeling tool for ports                |
| [user-groups-admin](applications/user-groups-admin) | Tool to manage user groups with ease   |
| [vessel-history](apps/vessel-history)               | 🗑️ Legacy 🗑️ Vessel history app        |

To create a new application using a template with sidebar + map + timebar just run:

## Other utils

|                    |                                                     |
| ------------------ | --------------------------------------------------- |
| [config](config)   | Shared generic build config                         |
| [linting](linting) | Define eslint prettier and stylelint configurations |

## See also

### 🗑️ Legacy 🗑️ MapLibre GL fork

We maintain our own forks of <a href="https://github.com/GlobalFishingWatch/maplibre-gl-js/">Mapbox GL</a> to handle gridded temporal data (see `temporalgrid` branches on both repos)

### 🗑️ Legacy 🗑️ LayerComposer / Dataviews / Workspaces

See: <a href="https://docs.google.com/presentation/d/1LdxRbB491Rjf64C5VVF9oTWwWjFVnN5dzDf1uhxcHY4/edit?ts=5f031be2#slide=id.g807f22e76b_0_78">From WebGL triangles to Dataviews - Organizing visualization of data at GFW</a>

### Dependencies

The repo is using yarn workspaces so npm is not suported yet, to install yarn [follow this instructions](https://classic.yarnpkg.com/en/docs/install/)

#### Install a new dependency

For all packages:

```bash
yarn add [package] -W
```

Only for a specific package

```bash
cd apps/[you-app]
yarn add [package]
```

### Installation

To install all packages dependencies just run:

```bash
yarn
```

### Developmment

Nx handles every app or library by its own project.json file, see for example [fishing-map](https://github.com/GlobalFishingWatch/frontend/blob/develop/apps/fishing-map/project.json):

```bash
nx start [app-name]
```

To ensure [git flow](https://guides.github.com/introduction/flow/) process, master branch will be protected to force opening PR to every change desired.
For now, the only one strong recommendation is to tag every PR to prepare the changelog automatically.

### Building

To test all packages builds process run, useful to test everything works well before publishing.

```bash
nx build [app-name] --parallel
```

### Publishing

TODO

### API DOCS

https://gateway.api.dev.globalfishingwatch.org/swagger?version=3

## Running production environment locally

To replicate the prod build and serve it locally:

```bash
nx build-serve [app-name]
```

## Generating release notes for github releases

To generate the release notes you can run
`nx release changelog [version] -i all -p [project] --from @globalfishingwatchapp/[app]@[prev-tag] --tagVersionPrefix @globalfishingwatchapp/[app] --dry-run`.
