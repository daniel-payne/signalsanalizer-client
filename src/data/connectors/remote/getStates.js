import rewind from 'geojson-rewind'
import wkt from 'terraformer-wkt-parser'

import { fixDateline } from '../../common'

function getStates(contextReference, useCache = false) {
  console.log('LOADING STATES ------------------------ FOR ' + contextReference)
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`states:${contextReference}`)
    console.log('LOADED STATES ------------------------ FROM CACHE')
    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/geographic/states?contextReference=${contextReference}`)
    .then((response) => {
      if (response.status !== 200) {
        console.log('ERROR /geographic/states: ' + response.status)
        return
      }

      return response.json()
    })
    .then((data) => {
      return data.map((state) => {
        const geoJson = wkt.parse(state.outlineWKT)

        const geoJSONDateline = fixDateline(geoJson)

        const geoJsonRewound = rewind(geoJSONDateline, true)

        return {
          stateName: state.stateName,
          contextReference: state.contextReference,

          outline: JSON.stringify({
            type: 'Feature',
            geometry: {
              type: geoJsonRewound.type,
              coordinates: geoJsonRewound.coordinates,
            },
          }),
        }
      })
    })
    .then((data) => {
      if (useCache === true && window.localStorage && data) {
        window.localStorage.setItem(`states:${contextReference}`, JSON.stringify(data))
      }
      console.log('LOADED STATES ------------------------ FROM SERVER ' + data.length)
      return data
    })
}

export default getStates
