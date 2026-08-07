This monorepo hosts frontend packages and applications of the <a href="https://globalfishingwatch.org/map">GlobalFishingWatch</a> ecosystem.

## Packages

All of them availables with the `@globalfishingwatch/` prefix:

|                                                 |                                                                           |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| [api-client](libs/api-client)                   | JS library to simplify GFW API login and resources fetch                  |
| [api-types](libs/api-types)                     | API typescript schema definitions                                         |
| [data-transforms](libs/data-transforms)         | Set ot shared tools for data transformations                              |
| [datasets-client](libs/datasets-client)         | A set of utils for handling api datasets                                  |
| [dataviews-client](libs/dataviews-client)       | A set of utils for merge, combine and consume api dataviews into the apps |
| [deck-layer-composer](libs/deck-layer-composer) | Map integration of the deck-layers                                        |
| [deck-layers](libs/deck-layers)                 | Deck classes for GFW layers                                               |
| [deck-loaders](libs/deck-loaders)               | Deck loaders for GFW layers                                               |
| [i18n-labels](libs/i18n-labels)                 | GFW shared translations                                                   |
| [ocean-areas](libs/ocean-areas)                 | Small library to get ocean area / eez names by viewport or by text search |
| [react-hooks](libs/react-hooks)                 | Set of hooks to use libraries easily in react                             |
| [timebar](libs/timebar)                         | Timebar component, not many more to say                                   |
| [ui-components](libs/ui-components)             | Reusable atoms components kit                                             |

## Applications

|                                                     |                                                 |
| --------------------------------------------------- | ----------------------------------------------- |
| [api-portal](apps/api-portal)                       | Api documentation portal                        |
| [data-download-portal](apps/data-download-portal)   | The place to download datasets                  |
| [platform](apps/platform)                           | Platform entry point (includes fishing-map app) |
| [platform-e2e](apps/platform-e2e)                   | Playwright e2e testing for the map              |
| [image-labeler](apps/image-labeler)                 | Labeling tool for satellite images              |
| [port-labeler](apps/port-labeler)                   | Labeling tool for ports                         |
| [track-labeler](apps/track-labeler)                 | Labeling tool for tracks                        |
| [user-groups-admin](apps/user-groups-admin) | Tool to manage user groups with ease            |

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

The repo uses **pnpm workspaces**; npm and yarn are blocked by an `only-allow pnpm` preinstall hook.
Node is pinned in [.nvmrc](.nvmrc) — use `nvm use` (or any version manager that reads it).

```bash
corepack enable   # pnpm version comes from package.json "packageManager"
```

#### Install a new dependency

For all packages:

```bash
pnpm add [package] -w
```

Only for a specific package

```bash
pnpm --filter [project-name] add [package]
```

### Installation

To install all workspace dependencies:

```bash
pnpm install
```

### Developmment

Nx handles every app or library by its own project.json file, see for example [platform](https://github.com/GlobalFishingWatch/frontend/blob/develop/apps/platform/project.json):

```bash
nx start [app-name]
```

To ensure [git flow](https://guides.github.com/introduction/flow/) process, master branch will be protected to force opening PR to every change desired.
For now, the only one strong recommendation is to tag every PR to prepare the changelog automatically.

### Building locally

To test all packages builds process run, useful to test everything works well before publishing.

```bash
nx build [app-name]
```

### Building using Docker

Reproduces the CI image build locally (same root `Dockerfile` the GitHub Actions workflow uses):

```bash
./scripts/test-ci-build-platform.sh          # build only
./scripts/test-ci-build-platform.sh --push   # build and push
```

### Publishing

Use [libs-release](.github/workflows/libs-release.yml) workflow

### API DOCS

https://gateway.api.dev.globalfishingwatch.org/swagger?version=3

## Running production environment locally

To replicate the prod build and serve it locally:

```bash
nx serve [app-name]
```

## Generating release notes for github releases

To generate the release notes you can run
`nx release changelog [version] -i all -p [project] --from @globalfishingwatchapp/[app]@[prev-tag] --tagVersionPrefix @globalfishingwatchapp/[app] --dry-run`.
