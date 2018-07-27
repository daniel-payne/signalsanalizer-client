import { types } from 'mobx-state-tree'

const State = types.model({
  stateReference: types.string,
  stateName: types.string,
  geoJSON: types.string,
})

export default State
