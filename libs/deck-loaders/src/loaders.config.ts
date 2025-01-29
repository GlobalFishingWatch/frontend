export const IS_PRODUCTION =
  typeof process !== 'undefined' ? process?.env?.NODE_ENV === 'production' : false
export const PATH_BASENAME =
  typeof process !== 'undefined' ? process.env?.NEXT_PUBLIC_URL || '/map' : '/map'
