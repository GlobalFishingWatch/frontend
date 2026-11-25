#!/usr/bin/env bash
# Fails when a recorded API response (apps/platform/test/fixtures/api/recorded) holds data that
# must never be committed. Run by the daily recording job before it opens its PR, and by
# Integration Tests on every PR, which catches recordings made locally.
#
# The recorder already skips private datasets and token requests, and anonymises /auth/me
# (test/utils/network/mock-network.ts). This is the backstop for what it cannot see, such as a
# private dataset listed in the body of a response to a public URL.
#
# Set TEST_USER_EMAIL to also check for the test user's address.
set -euo pipefail

DIR="${1:-apps/platform/test/fixtures/api/recorded}"
status=0

fail() {
  echo "::error::$1"
  status=1
}

if grep -rlF 'private-' "$DIR"; then
  fail 'Recorded responses mention a private dataset'
fi
if [ -n "${TEST_USER_EMAIL:-}" ] && grep -rliF "$TEST_USER_EMAIL" "$DIR"; then
  fail "Recorded responses contain the test user's email"
fi
# A JWT starts with base64url('{"alg') whatever the algorithm
if grep -rlF 'eyJhbGci' "$DIR"; then
  fail 'Recorded responses contain what looks like a token'
fi

exit $status
