---
name: Legacy Redux Container Pattern
slug: legacy-redux-container-pattern
type: concept
sources:
  - path: apps/track-labeler/src/features/main/main.container.ts
    hash: 87ed5caaeb911e19ada91a35b4cff64c08c678d65bf40078c608f548ca58b7c7
  - path: apps/track-labeler/src/features/sidebar/sidebar.container.ts
    hash: d67039020df4823df4d71bb88041d0a53287c1e5a52d15f4a6ec2cced06fa221
sources_digest: 2af3e179ff9638358801982048f0b020c96aab13a4c5d0f5bc577c3966f5af43
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Several components (Main, Sidebar) use the older react-redux connect() HOC pattern as a container layer, wrapping presentational components with store bindings. This legacy approach maps empty mapStateToProps and mapDispatchToProps (passing undefined/default), suggesting containers may not actively use Redux state bindings or are awaiting refactor to modern useSelector/useDispatch hooks. The pattern adds indirection without clear state/action mapping, complicating code navigation.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
