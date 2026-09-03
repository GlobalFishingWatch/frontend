# NetCDF sample data

`unidata/` holds every file listed on
<https://archive.unidata.ucar.edu/software/netcdf/examples/files.html>: 30 `.nc` files and their 30
`.cdl` sources, ~780MB in total. **The data is gitignored** — only `unidata-examples.json` (the
expected listing per file) and the fetch script are committed.

```sh
node libs/data-transforms/src/files/mock/netcdf/scripts/fetch-unidata-examples.mjs
```

`../../netcdf-variables.test.ts` uses these as its only fixtures — there are no hand-made ones. The
suites that need a file skip themselves while any is missing, and unskip once the fetch finishes;
the pure ones (magic bytes, axis detection, the mocked worker paths) always run. Every example is
asserted on its detected format, whether it is geospatial, and its exact griddable-variable
listing.

27 of the 30 are geospatial. The three that are not:

| File               | Why                                                                    |
| ------------------ | ---------------------------------------------------------------------- |
| `19981111_0045.nc` | Lambert conformal image; the georeference is in global attributes only |
| `test_hgroups.nc`  | `lat`/`lon` exist, but only inside groups — the root has none          |
| `testrh.nc`        | no coordinate variables at all                                         |

`unidata-examples.json` is generated output, not hand-written. To re-pin it after a deliberate
parser change, run the suite and update the expectations from the failures.
