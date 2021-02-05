declare module 'intersection-observer'
declare module 'auth-middleware'
declare module 'auth-middleware/*'
declare module 'formatcoords'

declare module 'workerize-loader!*' {
  type AnyFunction = (...args: any[]) => any
  type Async<F extends AnyFunction> = (...args: Parameters<F>) => Promise<ReturnType<F>>

  type Workerized<T> = Worker & { [K in keyof T]: T[K] extends AnyFunction ? Async<T[K]> : never }

  function createInstance<T>(): Workerized<T>
  export = createInstance
}

declare module '@globalfishingwatch/react-map-gl/dist/esm/components/map-context' {
  import { _MapContext } from '@globalfishingwatch/react-map-gl'
  export = _MapContext as any
}
