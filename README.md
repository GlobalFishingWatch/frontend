### Ideas

Include:
- layer-composer
- map-components (maybe rename to ui-components)
- api-client

Maybe:
- track-inspector / map-client v3.0
- (future) workspace-sandbox

Maybe maybe:
- carrier-portal
- port inspector
- Amathea?


### Questions/idea

- Only dependencies or also main project, or even other projects?
- If we include other projects, how this behaves in cloud build?
- If we don't include other projects, must think harder on how to share more config between projects (same as we are doing already for eslint config, but also for testing, automatic dependency bumping, etc)
- Should we be on the same version for all deps? (Lerna's _fixed versioning_)
- We should take the chance for map-components to:
  - rename to ui-components
  - remove Map module (keep legacy map-components for map-client and data-portal) 
- Keep git history (`lerna import`)
- Lerna or Yarn workspaces?


### Links

https://codeburst.io/monorepos-by-example-part-1-3a883b49047e
https://codeburst.io/monorepos-by-example-part-2-4153712cfa31
https://codeburst.io/monorepos-by-example-part-3-1ebdea7ccbea
https://www.drmaciver.com/2016/10/why-you-should-use-a-single-repository-for-all-your-companys-projects/
https://medium.com/@mattklein123/monorepos-please-dont-e9a279be011b
https://danluu.com/monorepo/
https://egghead.io/lessons/react-use-yarn-workspaces-to-share-code-with-cra-and-create-react-native-app-in-a-monorepo
