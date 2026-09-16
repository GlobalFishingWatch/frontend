# libs/data-transforms/src/numbers/numbers.ts · [[numeric-safety-and-type-coercion]]

Module that provides utilities for safely converting untyped values to finite numbers, guarding against silent coercions of null, undefined, and empty strings.

- toFiniteNumber · function · L8-L12 — Converts an untyped value to a finite number, returning undefined for null, undefined, empty string, or non-finite results.
