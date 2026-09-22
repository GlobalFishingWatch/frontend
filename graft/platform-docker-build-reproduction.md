---
name: Platform Docker build reproduction
slug: platform-docker-build-reproduction
type: file
sources:
  - path: scripts/test-ci-build-platform.sh
    hash: 3efb3861fc464408dec4909a0ca0d2178ad9a3c26a790eb52e23997337b6d8c7
sources_digest: b702aaf4a7bb8ec59506b86b7288c133246be6ca4b48f31a54a9773021fd29db
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Bash script locally reproducing GitHub Actions Docker build process for the platform application. Mirrors .github/actions/build-and-push workflow: parses command-line options (--env, --push, --skip-secrets), loads app config from .github/apps/{development,staging,production}.yml via Python PyYAML, extracts Docker target/build args/secrets, dynamically fetches secrets from GCP Secret Manager unless --skip-secrets passed, constructs docker buildx build command with --secret flags. Defaults to local load as platform:ci-local-{env}; with --push configures gcloud auth and pushes to Artifact Registry us-central1-docker.pkg.dev/. Dependencies: docker buildx, jq, python3/PyYAML, optional gcloud, git. Design accommodates offline builds for smoke testing; NX_CLOUD_ACCESS_TOKEN always mounted but may be empty for local builds.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
