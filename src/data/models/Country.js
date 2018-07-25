import { types } from 'mobx-state-tree'

const Country = types.model({
  countryName: types.string,
  geoJSON: types.string,
})

export default Country
