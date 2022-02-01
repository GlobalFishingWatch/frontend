import { connect } from 'react-redux'
import { TOOLTIPS, ENCOUNTER_TYPES } from 'data/constants'
import EncountersLegend from './encounters-legend'

const mapStateToProps = () => ({
  encounterTypes: Object.values(ENCOUNTER_TYPES).map((encounterType) => ({
    ...encounterType,
    tooltip: TOOLTIPS[encounterType.id],
  })),
})

export default connect(mapStateToProps)(EncountersLegend)
