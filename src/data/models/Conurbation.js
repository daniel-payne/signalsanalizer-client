import { types } from 'mobx-state-tree'

const Conurbation = types.model({
  conurbationName: types.string,
  geoJSON: types.string,
})

export default Conurbation
