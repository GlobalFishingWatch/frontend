export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const PATH_BASENAME = process.env.NEXT_PUBLIC_URL || (IS_PRODUCTION ? '/map' : '')
