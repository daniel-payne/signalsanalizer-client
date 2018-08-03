import { types, flow } from 'mobx-state-tree'

import Conurbation from './Conurbation'
import County from './County'

import getCounties from '../connectors/remote/getCounties'
import getConurbations from '../connectors/remote/getConurbations'

import getCounty from '../connectors/remote/getCounty'
import getConurbation from '../connectors/remote/getConurbation'

const State = types
  .model({
    contextReference: types.identifier,

    stateName: types.string,

    outline: types.maybe(types.string),
    border: types.maybe(types.string),

    conurbations: types.optional(types.array(Conurbation), []),
    counties: types.optional(types.array(County), []),

    selectedConurbation: types.maybe(types.reference(Conurbation)),
    selectedCounty: types.maybe(types.reference(County)),

    isCountiesLoaded: types.optional(types.boolean, false),
    isConurbationsLoaded: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    loadCounties: flow(function* loadCounties() {
      if (self.isCountiesLoaded === true) {
        return
      }

      const data = yield getCounties(self.contextReference)

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

      self.isCountiesLoaded = true
    }),
    chooseCounty: flow(function* loadState(contextReference) {
      const county = self.counties.find((county) => county.contextReference === contextReference)

      self.selectedConurbation = undefined

      if (county && county.border) {
        self.selectedCounty = county

        return
      }

      const data = yield getCounty(contextReference)

      if (county) {
        county.border = data[0].border

        self.selectedCounty = county
      } else {
        const newCounty = County.create(data[0])

        self.counties.push(newCounty)

        self.selectedCounty = newCounty
      }
    }),
    loadConurbations: flow(function* loadConurbations() {
      if (self.isConurbationsLoaded === true) {
        return
      }

      const data = yield getConurbations(self.contextReference)

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

      self.isConurbationsLoaded = true
    }),
    chooseConurbation: flow(function* loadState(contextReference) {
      const conurbation = self.conurbations.find((conurbation) => conurbation.contextReference === contextReference)

      self.selectedCounty = undefined

      if (conurbation && conurbation.border) {
        self.selectedConurbation = conurbation

        return
      }

      const data = yield getConurbation(contextReference)

      if (conurbation) {
        conurbation.border = data[0].border

        self.selectedConurbation = conurbation
      } else {
        const newConurbation = Conurbation.create(data[0])

        self.conurbations.push(newConurbation)

        self.selectedConurbation = newConurbation
      }
    }),
  }))

export default State
