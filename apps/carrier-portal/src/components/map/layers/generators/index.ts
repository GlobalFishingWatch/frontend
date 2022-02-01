import ClusterGenerator, { CLUSTER_TYPE as CLUSTER } from './clusters-events-generator'

const TYPES = { CLUSTER }
export { TYPES }

const ClusterGeneratorInstance = {
  [CLUSTER]: new ClusterGenerator(),
}

export default ClusterGeneratorInstance
