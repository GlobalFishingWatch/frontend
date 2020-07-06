This monorepo hosts packages and applications of the global-fishing-watch ecosystem.

## Packages

All of them availables with the `@globalfishingwatch/` prefix:

|                                               |                                                                              |
| --------------------------------------------- | ---------------------------------------------------------------------------- |
| [api-client](packages/api-client)             | JS library to simplify GFW API login and resources fetch                     |
| [dataviews-client](packages/dataviews-client) | api-client wrapper to fetch and edit dataviews and associated datasets/data  |
| [layer-composer](packages/layer-composer)     | Orchestrates various Layer Generators to generate a Mapbox GL Style document |
| [react-hooks](packages/react-hooks)           | Set of hooks to use libraries easily in react                                |
| [timebar](packages/timebar)                   | Timebar component, not many more to say                                      |
| [ui-components](packages/ui-components)       | Reusable atoms components kit                                                |

## Applications

|                                      |                                              |
| ------------------------------------ | -------------------------------------------- |
| [dataviews-editor](dataviews-editor) | Simple interface to edit dataviews           |
| [sandbox](sandbox)                   | Playground to use packages without releasing |

## Other utils

|                    |                                                            |
| ------------------ | ---------------------------------------------------------- |
| [config](config)   | Shared generic build config as tsconfig, rollup or postcss |
| [linting](linting) | Define eslint prettier and stylelint configurations        |

## See also

### Mapbox GL / react-map-gl forks

We maintain our own forks of <a href="https://github.com/GlobalFishingWatch/react-map-gl/">react-map-gl</a> and <a href="https://github.com/GlobalFishingWatch/mapbox-gl-js/">Mapbox GL</a> to handle gridded temporal data (see `temporalgrid` branches on both repos)

### LayerComposer / Dataviews / Workspaces

See: <a href="https://docs.google.com/presentation/d/1LdxRbB491Rjf64C5VVF9oTWwWjFVnN5dzDf1uhxcHY4/edit?ts=5f031be2#slide=id.g807f22e76b_0_78">From WebGL triangles to Dataviews - Organizing visualization of data at GFW</a>

### Dependencies

The repo is using yarn workspaces so npm is not suported yet, to install yarn [follow this instructions](https://classic.yarnpkg.com/en/docs/install/)

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

Using [lerna-publish](https://github.com/lerna/lerna/tree/master/commands/publish#readme) to versioning, tag and publish to npm every package individually
_Pending to have [lerna-changelog](https://github.com/lerna/lerna-changelog) working properly to auto generate the changelogs on PR labels_

To release just run:

```bash
yarn release
```

And you will be prompt to select the new versions of the packages with changes since the last release.
