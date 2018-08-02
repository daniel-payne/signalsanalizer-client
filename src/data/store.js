import { types, flow } from 'mobx-state-tree'
import makeInspectable from 'mobx-devtools-mst'

import Globe from './models/Globe'
import Country from './models/Country'
import State from './models/State'
import Conurbation from './models/Conurbation'
import County from './models/County'

import getGlobe from './connectors/remote/getGlobe'
import getCountries from './connectors/remote/getCountries'

import getCountry from './connectors/remote/getCountry'
import getStates from './connectors/remote/getStates'
import getState from './connectors/remote/getState'
import getCounties from './connectors/remote/getCounties'
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
    globe: types.maybe(Globe),

    selectedCountry: types.maybe(types.reference(Country)),
    selectedState: types.maybe(types.reference(State)),
    selectedCounty: types.maybe(types.reference(County)),
    selectedConurbation: types.maybe(types.reference(Conurbation)),

    contextReference: types.optional(types.string, ''),
    temporalReference: types.optional(types.string, MONTH),
    displayReference: types.optional(types.string, 'GLOBE'),
  })
  .actions((self) => ({
    loadGlobe: flow(function* loadGlobe() {
      if (self.globe) {
        return
      }

      //const data = yield getGlobe()

      self.globe = Globe.create({})

      yield self.globe.loadCountries()
    }),
  }))
  .actions((self) => ({
    validateRoute: flow(function* validateRoute(route) {
      let data = route.toUpperCase()

      let view
      let period
      let place

      view = self.DISPLAY_VIEWS.find((item) => data.indexOf(item + '-') > -1)
      period = self.TIME_PERIODS.find((item) => data.indexOf(item + '-') > -1)

      if (view) {
        data = data.replace(view, '')
      }
      if (period) {
        data = data.replace(period, '')
      }

      place = data.replace(/-/g, '')

      yield self.choosePlace(place)

      if (period) {
        //yield self.choosePeriod(period)
      }

      if (view) {
        //self.chooseView(view)
      }

      console.log('VALIDATING ROUTE >>>>>>>>>>>>>>>>>>>>' + route)

      return view
    }),
    choosePlace: flow(function* validateRoute(contextReference) {
      let data = contextReference.toUpperCase()

      const contextCountry = extractContextCountry(data)
      const contextState = extractContextState(data)
      const contextConurbation = extractContextConurbation(data)
      const contextCounty = extractContextCounty(data)

      yield self.globe.loadCountry(contextCountry).then(() => {
        self.globe.selectedCountry.loadStates(contextCountry)
      })

      console.log([contextCountry, contextState, contextConurbation, contextCounty])
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

const validateRoute = function(display) {
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

  console.log('VALIDATING ROUTE >>>>>>>>>>>>>>>>>>>>' + display)

  return view
}.bind(store)

export default makeInspectable(store)
