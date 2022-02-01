/**
 * If authorization information is available, full authorization status for the encounter. May be either `authorized` if the main vessel had authorization to encounter other vessels by all the management organizations for the regions in which the encounter happened, `partially` if we only have authorization information for some of the management organizations for the regions but not others, or `unmatched` if we don't have authorization information for any of the management organizations.
 * @export
 * @string {string}
 */
export type AuthorizationOptions = 'authorized' | 'partially' | 'unmatched'
