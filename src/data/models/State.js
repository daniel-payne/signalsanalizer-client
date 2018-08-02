import { types, flow } from 'mobx-state-tree'

import Conurbation from './Conurbation'
import County from './County'

import getCounties from '../connectors/remote/getCounties'
import getConurbations from '../connectors/remote/getConurbations'

const State = types
  .model({
    contextReference: types.identifier,

    stateName: types.string,

    outline: types.maybe(types.string),
    border: types.maybe(types.string),
  })
  .actions((self) => ({
    loadCounties: flow(function* loadCounties(contextReference) {
      const data = yield getCounties(contextReference)

      const newCounties = data.map((item) => {
        const newCounty = County.create(item)

        return newCounty
      })

      newCounties.forEach((newCounty) => {
        const oldCounty = self.counties.find((county) => county.contextReference === newCounty.contextReference)

        if (oldCounty) {
          oldCounty.countyName = newCounty.countyName

          oldCounty.outline = newCounty.outline
        } else {
          self.counties.push(newCounty)
        }
      })
    }),
    loadConurbations: flow(function* loadConurbations(contextReference) {
      const data = yield getConurbations(contextReference)

      const newConurbations = data.map((item) => {
        const newConurbation = Conurbation.create(item)

        return newConurbation
      })

      newConurbations.forEach((newConurbation) => {
        const oldConurbation = self.conurbations.find((conurbation) => conurbation.contextReference === newConurbation.contextReference)

        if (!oldConurbation) {
          self.conurbations.push(newConurbation)
        }
      })
    }),
  }))

export default State
