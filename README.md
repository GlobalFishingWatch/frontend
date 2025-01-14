This monorepo hosts frontend packages and applications of the <a href="https://globalfishingwatch.org/map">GlobalFishingWatch</a> ecosystem.

## Packages

All of them availables with the `@globalfishingwatch/` prefix:

|                                                 |                                                                                |
| ----------------------------------------------- | ------------------------------------------------------------------------------ |
| [api-client](libs/api-client)                   | JS library to simplify GFW API login and resources fetch                       |
| [api-types](libs/api-types)                     | API typescript schema definitions                                              |
| [data-transforms](libs/data-transforms)         | Set ot shared tools for data transformations                                   |
| [datasets-client](libs/datasets-client)         | A set of utils for handling api datasets                                       |
| [dataviews-client](libs/dataviews-client)       | A set of utils for merge, combine and consume api dataviews into the apps      |
| [deck-layer-composer](libs/deck-layer-composer) | Map integration of the deck-layers                                             |
| [deck-layers](libs/deck-layers)                 | Deck classes for GFW layers                                                    |
| [deck-loaders](libs/deck-loaders)               | Deck loaders for GFW layers                                                    |
| [fourwings-aggregate](libs/fourwings-aggregate) | Logic to turn fourwings tiles or cells into meaningful values for the frontend |
| [i18n-labels](libs/i18n-labels)                 | GFW shared translations                                                        |
| [layer-composer](libs/layer-composer)           | Orchestrates various Layer Generators to generate a Mapbox GL Style document   |
| [ocean-areas](libs/ocean-areas)                 | Small library to get ocean area / eez names by viewport or by text search      |
| [pbf-decoders](libs/pbf-decoders)               | PBF custom responses parsers                                                   |
| [react-hooks](libs/react-hooks)                 | Set of hooks to use libraries easily in react                                  |
| [timebar](libs/timebar)                         | Timebar component, not many more to say                                        |
| [ui-components](libs/ui-components)             | Reusable atoms components kit                                                  |

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
| [vessel-history](apps/vessel-history)               | Vessel history app                     |

To create a new application using a template with sidebar + map + timebar just run:

```shell
nx workspace-generator app [your-name]
```

```shell
nx start [your-name]
```

## Other utils

|                    |                                                            |
| ------------------ | ---------------------------------------------------------- |
| [config](config)   | Shared generic build config as tsconfig, rollup or postcss |
| [linting](linting) | Define eslint prettier and stylelint configurations        |

## See also

### MapLibre GL fork

We maintain our own forks of <a href="https://github.com/GlobalFishingWatch/maplibre-gl-js/">Mapbox GL</a> to handle gridded temporal data (see `temporalgrid` branches on both repos)

### LayerComposer / Dataviews / Workspaces

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

https://gateway.api.dev.globalfishingwatch.org/swagger#/

## Docker Compose

To replicate the prod environment where the apps run on a path (not the root) and with https we use a nginx proxy that runs on SSL and maps all the incoming request to its corresponding app.

### Setup

1. Generate the ssl certificates:

```bash
./generate-certificate.sh
```

2. Set the proper environment variables to build each app, lookt at the build.env.sample file for reference:

```bash
cp apps/fishing-map/.build.env.sample apps/fishing-map/.build.env
# Edit apps/fishing-map/.build.env and save your changes
cp apps/vessel-history/.build.env.sample apps/vessel-history/.build.env
# Edit apps/vessel-history/.build.env and save your changes
cp apps/api-portal/.build.env.sample apps/api-portal/.build.env
# Edit apps/api-portal/.build.env and save your changes
```

3. Build the apps:

```bash
npx env-cmd -f apps/fishing-map/.build.env nx build fishing-map --parallel
npx env-cmd -f apps/vessel-history/.build.env nx build vessel-history --parallel
npx env-cmd -f apps/api-portal/.build.env nx build api-portal --parallel
npx env-cmd -f apps/fourwings-explorer/.build.env nx build fourwings-explorer --parallel
nx run-many --target=docker-prepare --all
```

1. Spin up docker compose:

```bash
docker-compose up -d
```

5. Navigate to `https://localhost/map` and/or `https://localhost/vessel-viewer`. Note that if you want to develop/test the progressive web app (offline mode) you'll have to start Chrome with specific flags to omit the SSL self signed certificate error:

Osx

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome   --user-data-dir=/tmp/foo --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://localhost
```

Windows

```cmd
chrome.exe --user-data-dir=/tmp/foo --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://localhost/
```

_Pending: Add `https://localhost` (or a more meaningful hostname) to the list of redirectUrls in the GFW application_

## Generating release notes for github releases

To generate the release notes you can run
`nx release changelog [version] -i all -p [project] --from @globalfishingwatchapp/[app]@[prev-tag] --tagVersionPrefix @globalfishingwatchapp/[app] --dry-run`.
