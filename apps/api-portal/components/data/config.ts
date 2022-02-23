export const IS_PRODUCTION = process.env.NODE_ENV === 'production'
export const ROOT_DOM_ELEMENT = '__next'
export const APPLICATION_ID = 'api-portal'
export const APPLICATION_NAME = 'API Portal'
export const PATH_BASENAME = process.env.NEXT_PUBLIC_URL || (IS_PRODUCTION ? '/api-portal' : '')
