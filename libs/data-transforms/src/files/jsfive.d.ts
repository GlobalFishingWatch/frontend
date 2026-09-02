// jsfive@0.4.0 ships no declarations and no `types` export condition, so it is TS7016 under
// `strict` without this. Only what netcdf-variables.ts touches is declared. Verified against
// node_modules/jsfive/dist/esm/index.mjs — `Dataset` really does extend Array there, which is
// why `instanceof Array` cannot tell a dataset from a group.
declare module 'jsfive' {
  export class Dataset {
    name: string
    /** Dataset dimensions */
    get shape(): number[]
  }
  export class Group {
    name: string
    get keys(): string[]
    get(name: string): Group | Dataset | null
  }
  export class File extends Group {
    constructor(buffer: ArrayBuffer, filename?: string)
  }
}
