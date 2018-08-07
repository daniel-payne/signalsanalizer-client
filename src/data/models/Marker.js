import { types } from 'mobx-state-tree'

const Marker = types.model({
  eventId: types.number,
  eventlatitude: types.number,
  eventlongitude: types.number,
})

export default Marker
