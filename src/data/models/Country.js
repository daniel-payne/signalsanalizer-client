import { types, flow } from 'mobx-state-tree'

import getStates from '../connectors/remote/getStates'
import getState from '../connectors/remote/getState'

import State from './State'

const Country = types
  .model({
    contextReference: types.identifier,

    countryName: types.string,

    centerpointCoordinates: types.maybe(types.array(types.number)),

    outline: types.maybe(types.string),
    border: types.maybe(types.string),

    states: types.optional(types.array(State), []),

    selectedState: types.maybe(types.reference(State)),

    isStatesLoaded: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get conurbations() {
      const conurbations = []

      self.states.forEach((state) => {
        conurbations.push(...state.conurbations)
      })

      return conurbations
    },
  }))
  .actions((self) => ({
    loadStates: flow(function* loadStates() {
      if (self.isStatesLoaded === true) {
        return
      }

      const data = yield getStates(self.contextReference)

      const newStates = data.map((item) => {
        const newState = State.create(item)

        return newState
      })

      newStates.forEach((newState) => {
        const oldState = self.states.find((state) => state.contextReference === newState.contextReference)

        if (!oldState) {
          self.states.push(newState)
        }
      })

      self.isStatesLoaded = true
    }),
    chooseState: flow(function* loadState(contextReference) {
      const state = self.states.find((state) => state.contextReference === contextReference)

      if (state && state.border) {
        self.selectedState = state

        return
      }

      const data = yield getState(contextReference)

      if (state) {
        state.border = data[0].border

        self.selectedState = state
      } else {
        const newState = State.create(data[0])

        self.states.push(newState)

        self.selectedState = newState
      }
    }),
    deSelect: function deSelect() {
      if (self.selectedState) {
        self.selectedState.deSelect()
      }

      self.selectedState = undefined
    },
  }))

export default Country
