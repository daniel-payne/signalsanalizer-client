import { types, flow } from 'mobx-state-tree'
import makeInspectable from 'mobx-devtools-mst'

import Country from './models/Country'
import State from './models/State'
import Conurbation from './models/Conurbation'
import Preference from './models/Preference'

import getCountries from './connectors/remote/getCountries'

import getCountry from './connectors/remote/getCountry'
import getStates from './connectors/remote/getStates'
import getConurbations from './connectors/remote/getConurbations'

// import getCounties from './connectors/remote/getCounties'
// import getPlaces from './connectors/remote/getPlaces'

const Store = types
  .model({
    test: types.maybe(types.string),

    countries: types.optional(types.array(Country), []),
    states: types.optional(types.array(State), []),
    // counties
    // conurbations
    // markers
    // events

    selectedCountry: types.maybe(types.reference(Country)),

    contextReference: types.optional(types.string, ''),
    temporalReference: types.optional(types.string, 'WEEK'),

    // displayedCountries={this.props.store.displayedCountries}
    // displayedStates={this.props.store.displayedStates}
    // displayedCounties={this.props.store.displayedCounties}
    // displayedConurbations={
    //   this.props.store.displayedConurbations
    // }
    // displayedMarkers={this.props.store.displayedMarkers}
    // displayedEvents={this.props.store.displayedEvents}
    // selectedCountry={this.props.store.selectedCountry}
    // selectedState={this.props.store.selectedState}
    // selectedCounty={this.props.store.selectedCounty}
    // selectedConurbation={this.props.store.selectedConurbation}
    // selectedPlace={this.props.store.selectedPlace}
    // selectedPeriod={this.props.store.selectedPeriod}
  })
  .views((self) => ({
    get displayedCountries() {
      return self.countries.filter(
        (country) =>
          self.contextReference === ''
            ? true
            : self.contextReference.indexOf(country.contextReference) > -1
      )
    },
    get displayedStates() {
      const contextReference = self.contextReference
      const contextReferenceLength = contextReference.length

      if (contextReferenceLength === 0) {
        return []
      }

      return self.states.filter(
        (state) =>
          state.contextReference
            .substr(0, contextReferenceLength)
            .indexOf(contextReference) > -1
      )
    },
    // numberOfPeopleOlderThan(age) {
    //   return self.users.filter((user) => user.age > age).length
    // },
  }))

  .actions((self) => ({
    choosePlace(contextReference) {
      self.contextReference = contextReference

      if (contextReference.length === 3) {
        self.loadCountry(contextReference).then(() => {
          self.loadStates(contextReference)
          //self.loadConurbations(contextReference)
        })
      }
    },
    choosePeriod(temporalReference) {
      self.temporalReference = temporalReference
    },
  }))
  .actions((self) => ({
    loadCountries: flow(function* loadCountries() {
      const data = yield getCountries()

      const newCountries = data.map((item) => {
        const newCountry = Country.create(item)

        return newCountry
      })

      newCountries.forEach((newCountry) => {
        const oldCountry = self.countries.find(
          (country) => country.contextReference === newCountry.contextReference
        )

        if (!oldCountry) {
          self.countries.push(newCountry)
        }
      })
    }),
    loadCountry: flow(function* loadCountry(contextReference) {
      const data = yield getCountry(contextReference)

      const country = self.countries.find(
        (country) => country.contextReference === contextReference
      )

      if (country) {
        country.border = data[0].border

        self.selectedCountry = country
      } else {
        const newCountry = Country.create(data[0])

        self.countries.push(newCountry)

        self.selectedCountry = newCountry
      }
    }),
    loadStates: flow(function* loadStates(contextReference) {
      const data = yield getStates(contextReference)

      const newStates = data.map((item) => {
        const newState = State.create(item)

        return newState
      })

      newStates.forEach((newState) => {
        const oldState = self.states.find(
          (state) => state.contextReference === newState.contextReference
        )

        if (!oldState) {
          self.states.push(newState)
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
        self.conurbations.push(newConurbations)
      })
    }),
  }))

const store = Store.create({})

export default makeInspectable(store)
