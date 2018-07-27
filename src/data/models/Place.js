import { types } from 'mobx-state-tree'

const Place = types.model({
  placeName: types.string,
  geoJSON: types.string,
})

export default Place
