_Embrace the monorepo. The monorepo is your friend and wants you to be happy._

### Installation

```bash
yarn to install all dependencies
```

```bash
include .env in application/sandbox with CI=true (can't understand why this is needed to with lerna, but will investigate)
```

```bash
yarn build to compile all packages
```

```bash
yarn sandbox to run the server and see the libraries example running
```

### Developmment

To ensure [git flow](https://guides.github.com/introduction/flow/) process, master branch will be protected to force opening PR to every change desired.
For now, the only one strong recommendation is to tag every PR to prepare the changelog automatically.

### Publishing

Using [lerna-publish](https://github.com/lerna/lerna/tree/master/commands/publish#readme) to versioning and [lerna-changelog](https://github.com/lerna/lerna-changelog) to generate the changelog.

Using these tools it should be as easy as running
```
yarn release
```

### Roadmap

Include rest of dependencies:
- [x] api-client
- [x] react-hooks
- [x] ui-kit
- [x] https://github.com/satellitestudio/linting
- [ ] layer-composer
   - fourwings (extracted from layer-composer?)
- [ ] map-components (maybe rename to ui-components)

Include projects:
- [] track-inspector / map-client v3.0
- [] cloud build triggers

TBD:
- carrier-portal
- port inspector
- Amathea?
