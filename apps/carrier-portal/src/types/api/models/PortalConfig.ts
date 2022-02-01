import {
  FlagState,
  FlagStateGroup,
  PortalConfigPorts,
  PortalConfigEezs,
  PortalConfigRfmos,
} from './'

/**
 *
 * @export
 * @interface PortalConfig
 */
export interface PortalConfig {
  /**
   *
   * @type {Array<PortalConfigRfmos>}
   * @memberof PortalConfig
   */
  rfmos: Array<PortalConfigRfmos>
  /**
   *
   * @type {Array<PortalConfigRfmos>}
   * @memberof PortalConfig
   */
  eezs: Array<PortalConfigEezs>
  /**
   *
   * @type {PortalConfigPorts}
   * @memberof PortalConfig
   */
  ports: PortalConfigPorts
  /**
   *
   * @type {Array<FlagState>}
   * @memberof PortalConfig
   */
  flagStates: Array<FlagState>
  /**
   *
   * @type {Array<FlagStateGroup>}
   * @memberof PortalConfig
   */
  flagStateGroups: Array<FlagStateGroup>
}
