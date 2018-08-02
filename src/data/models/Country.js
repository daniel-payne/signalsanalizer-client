import { types, flow } from 'mobx-state-tree'

import getStates from '../connectors/remote/getStates'
import getState from '../connectors/remote/getState'

import State from './State'

const Country = types
  .model({
    contextReference: types.identifier,

    countryName: types.string,

    outline: types.maybe(types.string),
    border: types.maybe(types.string),

    states: types.optional(types.array(State), []),

    selectedState: types.maybe(types.reference(State)),
  })
  .actions((self) => ({
    loadStates: flow(function* loadStates(contextReference) {
      const data = yield getStates(contextReference)

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
    }),
    loadState: flow(function* loadStates(contextReference) {
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
  }))

export default Country
