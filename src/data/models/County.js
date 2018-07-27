import { types } from 'mobx-state-tree'

const County = types.model({
  countyName: types.string,
  geoJSON: types.string,
})

export default County
