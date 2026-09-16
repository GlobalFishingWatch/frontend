---
name: Self-signed certificate generation
slug: self-signed-certificate-generation
type: file
sources:
  - path: scripts/generate-certificate.sh
    hash: 57b8c15beefc0643dfb8a33cbda9e605bab06f6e3f44d8dfba25b372a360bf0b
sources_digest: 8dcea16895545c12d0176c17f734ec8d3f36c30e2f9ac13587d6ef3fec7f182b
links: []
generator:
  version: 1
covers: []
---

<!-- context:generated:start -->

## Summary

Bash script automating creation of self-signed SSL/TLS certificates for local development via Docker. Orchestrates five sequential OpenSSL operations in frapsoft/openssl container: generates RSA key pair, strips passphrase, removes intermediate file, creates certificate signing request with hardcoded UK subject and CN=localhost, self-signs certificate. Outputs server.key, server.csr, server.crt to config/ssl/. Dependencies: Docker daemon, frapsoft/openssl image, rimraf. Design assumes localhost certificate subject; hardcoded passphrase pass:x acceptable only for non-production.
<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
