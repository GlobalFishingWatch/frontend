![Publish to npm](https://github.com/GlobalFishingWatch/frontend/workflows/Publish%20packages/badge.svg)

This monorepo hosts frontend packages and applications of the <a href="globalfishingwatch.org/">GlobalFishingWatch</a> ecosystem.

## Packages

All of them availables with the `@globalfishingwatch/` prefix:

|                                                     |                                                                                |
| --------------------------------------------------- | ------------------------------------------------------------------------------ |
| [api-client](packages/api-client)                   | JS library to simplify GFW API login and resources fetch                       |
| [api-types](packages/api-types)                     | API typescript schema definitions                                              |
| [data-transforms](packages/data-transforms)         | Set ot shared tools for data transformations                                   |
| [dataviews-client](packages/dataviews-client)       | Api-client wrapper to fetch and edit dataviews and associated datasets/data    |
| [layer-composer](packages/layer-composer)           | Orchestrates various Layer Generators to generate a Mapbox GL Style document   |
| [ocean-areas](packages/ocean-areas)                 | Small library to get ocean area / eez names by viewport or by text search      |
| [pbf-decoders](packages/pbf-decoders)               | PBF custom responses parsers                                                   |
| [react-hooks](packages/react-hooks)                 | Set of hooks to use libraries easily in react                                  |
| [timebar](packages/timebar)                         | Timebar component, not many more to say                                        |
| [ui-components](packages/ui-components)             | Reusable atoms components kit                                                  |
| [fourwings-aggregate](packages/fourwings-aggregate) | Logic to turn fourwings tiles or cells into meaningful values for the frontend |

## Applications

|                                                     |                                                              |
| --------------------------------------------------- | ------------------------------------------------------------ |
| [fishing-map](apps/fishing-map)                     | Version 3.0 of the fishing map project                       |
| [vessel-history](apps/vessel-history)               | Vessel history app                                           |
| [temporalgrid-demo](applications/temporalgrid-demo) | CRA to show how new custom mapbox-gl format development goes |
| [dataviews-editor](applications/dataviews-editor)   | Simple interface to edit dataviews                           |
| [sandbox](applications/sandbox)                     | Playground to use packages without releasing                 |

## Other utils

|                    |                                                            |
| ------------------ | ---------------------------------------------------------- |
| [config](config)   | Shared generic build config as tsconfig, rollup or postcss |
| [linting](linting) | Define eslint prettier and stylelint configurations        |

## See also

### Mapbox GL fork

We maintain our own forks of <a href="https://github.com/GlobalFishingWatch/mapbox-gl-js/">Mapbox GL</a> to handle gridded temporal data (see `temporalgrid` branches on both repos)

### LayerComposer / Dataviews / Workspaces

See: <a href="https://docs.google.com/presentation/d/1LdxRbB491Rjf64C5VVF9oTWwWjFVnN5dzDf1uhxcHY4/edit?ts=5f031be2#slide=id.g807f22e76b_0_78">From WebGL triangles to Dataviews - Organizing visualization of data at GFW</a>

### Dependencies

The repo is using yarn workspaces so npm is not suported yet, to install yarn [follow this instructions](https://classic.yarnpkg.com/en/docs/install/)

#### Install a new dependency

For all packages:

```bash
yarn add npm-package -W
```

Only for a specific package

```bash
yarn lerna add npm-package --scope=@scope/my-package
```

### Installation

To install all packages dependencies just run:

```bash
yarn
```

### Developmment

There is, for now, 3 package.json entry points to run the project:

- Packages, to start the build of every package run:

```bash
yarn start:packages
```

- Applications, to start any of them run;

```bash
yarn start:dataviews
```

```bash
yarn start:sandbox
```

To ensure [git flow](https://guides.github.com/introduction/flow/) process, master branch will be protected to force opening PR to every change desired.
For now, the only one strong recommendation is to tag every PR to prepare the changelog automatically.

### Building

To test all packages builds process run, useful to test everything works well before publishing.

```bash
yarn build
```

### Publishing

TODO

### API DOCS

https://gateway.api.dev.globalfishingwatch.org/swagger#/

### Link packages

Go to the package that you want to update
RUN: yarn link

Go to the root of the monorepo and run
yarn start:packages

Go to your application and run
yarn link @globalfishingwatch/{package_folder}

Start your application

## Docker Compose

To replicate the prod environment where the apps run on a path (not the root) and with https we use a `nginx-proxy` that runs on SSL and maps all the incoming request to its corresponding app.

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
```

3. Build the apps:

```bash
npx env-cmd -f apps/fishing-map/.build.env nx build fishing-map --parallel
nx run fishing-map:docker-prepare
npx env-cmd -f apps/vessel-history/.build.env nx build vessel-history --parallel
nx run vessel-history:docker-prepare
```

4. Spin up docker compose:

```bash
docker-compose up -d
```

5. Navigate to `https://localhost/maps` and/or `https://localhost/vessel-viewer`. Note that if you want to develop/test the progressive web app (offline mode) you'll have to start Chrome with specific flags to omit the SSL self signed certificate error:

Osx

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome   --user-data-dir=/tmp/foo --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://localhost
```

Windows

```cmd
chrome.exe --user-data-dir=/tmp/foo --ignore-certificate-errors --unsafely-treat-insecure-origin-as-secure=https://localhost/
```

_Pending: Add `https://localhost` (or a more meaningful hostname) to the list of redirectUrls in the GFW application_
