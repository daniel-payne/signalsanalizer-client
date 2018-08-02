import { types, flow } from 'mobx-state-tree'
import makeInspectable from 'mobx-devtools-mst'

import Country from './models/Country'
import State from './models/State'
import Conurbation from './models/Conurbation'
import County from './models/County'

import getCountries from './connectors/remote/getCountries'

import getCountry from './connectors/remote/getCountry'
import getStates from './connectors/remote/getStates'
import getState from './connectors/remote/getState'
import getConurbations from './connectors/remote/getConurbations'

import { extractContextCountry, extractContextState, extractContextConurbation, extractContextCounty } from './common'

// import getState from './connectors/remote/getState'
// import getCounties from './connectors/remote/getCounties'

// import getCounty from './connectors/remote/getCounty'
// import getPlaces from './connectors/remote/getPlaces'
// import getEvents from './connectors/remote/getEvents'

export const DAY = 'DAY'
export const WEEK = 'WEEK'
export const MONTH = 'MONTH'
export const YEAR = 'YEAR'
export const YEARS_5 = 'YEARS_5'
export const YEARS_10 = 'YEARS_10'
export const YEARS_25 = 'YEARS_25'
export const SINCE_1970 = 'SINCE_1970'

export const TIME_PERIODS = [DAY, WEEK, MONTH, YEAR, YEARS_5, YEARS_10, YEARS_25, SINCE_1970]

export const GLOBE = 'GLOBE'
export const MAP = 'MAP'
export const COUNTRY = 'COUNTRY'
export const STATE = 'STATE'
export const CONURBATION = 'CONURBATION'

export const DISPLAY_VIEWS = [GLOBE, MAP, COUNTRY, STATE, CONURBATION]

const Store = types
  .model({
    test: types.maybe(types.string),

    countries: types.optional(types.array(Country), []),
    states: types.optional(types.array(State), []),
    conurbations: types.optional(types.array(Conurbation), []),

    counties: types.optional(types.array(County), []),
    // counties
    // conurbations
    // markers
    // events

    selectedCountry: types.maybe(types.reference(Country)),
    selectedState: types.maybe(types.reference(State)),
    selectedCounty: types.maybe(types.reference(County)),
    selectedConurbation: types.maybe(types.reference(Conurbation)),

    contextReference: types.optional(types.string, ''),
    temporalReference: types.optional(types.string, MONTH),
    displayReference: types.optional(types.string, 'GLOBE'),
  })
  .views((self) => ({
    get displayedCountries() {
      return self.countries.filter((country) => self.contextReference.indexOf(country.contextReference) > -1)
    },
    get displayedStates() {
      const contextReference = self.contextReference
      const contextReferenceLength = contextReference.length

      if (contextReferenceLength === 0) {
        return []
      }

      return self.states.filter((state) => state.contextReference.substr(0, contextReferenceLength).indexOf(contextReference) > -1)
    },
    get displayedConurbations() {
      const contextReference = self.contextReference
      const contextReferenceLength = contextReference.length

      if (contextReferenceLength === 0) {
        return []
      }

      return self.conurbations.filter((conurbation) => conurbation.contextReference.substr(0, contextReferenceLength).indexOf(contextReference) > -1)
    },
    // numberOfPeopleOlderThan(age) {
    //   return self.users.filter((user) => user.age > age).length
    // },
  }))

  .actions((self) => ({
    choosePlace(contextReference) {
      if ((self.contextReference = contextReference)) {
        self.selectedCountry = undefined
        self.selectedState = undefined
        self.selectedCounty = undefined
        self.selectedConurbation = undefined

        self.contextReference = contextReference

        const contextCountry = extractContextCountry(contextReference)
        const contextState = extractContextState(contextReference)
        // const ContextConurbation = extractContextConurbation(contextReference)
        // const ContextCounty = extractContextCounty(contextReference)

        if (contextState) {
          self.loadCountry(contextCountry)
          self.loadState(contextState)
          self.loadConurbations(contextState)
          //self.loadCounties(ContextState)
        } else if (contextCountry) {
          self.loadCountry(contextCountry)
          self.loadStates(contextCountry)
          self.loadConurbations(contextCountry)
        }
      }

      console.log('CHOOSING PLACE >>>>>>>>>>>>>>>>>>>>>' + contextReference)
    },
    choosePeriod(temporalReference) {
      self.temporalReference = temporalReference
      console.log('CHOOSING PERIOD >>>>>>>>>>>>>>>>>>>>>' + temporalReference)
    },
    chooseView(displayReference) {
      self.displayReference = displayReference
      console.log('CHOOSING VIEW >>>>>>>>>>>>>>>>>>>>>' + displayReference)
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
        const oldCountry = self.countries.find((country) => country.contextReference === newCountry.contextReference)

        if (oldCountry) {
          oldCountry.countryName = newCountry.countryName

          oldCountry.outline = newCountry.outline
        } else {
          self.countries.push(newCountry)
        }
      })
    }),
    loadCountry: flow(function* loadCountry(contextReference) {
      const country = self.countries.find((country) => country.contextReference === contextReference)

      if (country && country.border) {
        self.selectedCountry = country
      } else {
        const data = yield getCountry(contextReference)

        if (country) {
          country.border = data[0].border

          self.selectedCountry = country
        } else {
          const newCountry = Country.create(data[0])

          self.countries.push(newCountry)

          self.selectedCountry = newCountry
        }
      }
    }),
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

const store = Store.create({})

store.TIME_PERIODS = TIME_PERIODS
store.DISPLAY_VIEWS = DISPLAY_VIEWS

store.calculateRoute = function({ view, period, place }) {
  const newView = view || this.displayReference
  const newPeriod = period || this.temporalReference
  const newPlace = place || this.contextReference

  return `${newView}-${newPeriod}-${newPlace}-`
}.bind(store)

store.validateRoute = function(display) {
  let data = display.toUpperCase()

  let view
  let period
  let place

  view = this.DISPLAY_VIEWS.find((item) => data.indexOf(item + '-') > -1)
  period = this.TIME_PERIODS.find((item) => data.indexOf(item + '-') > -1)

  if (view) {
    data = data.replace(view, '')
  }
  if (period) {
    data = data.replace(period, '')
  }

  place = data.replace(/-/g, '')

  this.choosePlace(place)

  if (period) {
    this.choosePeriod(period)
  }

  if (view) {
    this.chooseView(view)
  }

  console.log('VALIDATING RUTE >>>>>>>>>>>>>>>>>>>>' + display)

  return view
}.bind(store)

export default makeInspectable(store)
