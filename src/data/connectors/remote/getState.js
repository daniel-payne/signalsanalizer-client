import rewind from 'geojson-rewind'
import wkt from 'terraformer-wkt-parser'

import { fixDateline } from '../../common'

function getState(contextReference, useCache = false) {
  console.log('LOADING STATE ------------------------')
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`state:${contextReference}`)
    console.log('LOADED STATE ------------------------ FROM CACHE')
    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/geographic/state?contextReference=${contextReference}`)
    .then((response) => {
      if (response.status !== 200) {
        console.log('ERROR /geographic/state: ' + response.status)
        return
      }

      return response.json()
    })
    .then((data) => {
      return data.map((state) => {
        const geoJson = wkt.parse(state.borderWKT)

        let geoJSONDateline = geoJson

        if (state.stateName === 'Russia' || state.stateName === 'Fiji') {
          geoJSONDateline = fixDateline(geoJson)
        }

        const geoJsonRewound = rewind(geoJSONDateline, true)

        let geoJsonCenterpoint

        if (state.centerpointWKT) {
          geoJsonCenterpoint = wkt.parse(state.centerpointWKT)
        }

        return {
          stateName: state.stateName,
          contextReference: state.contextReference,

          centerpoint: geoJsonCenterpoint,

          border: JSON.stringify({
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
        window.localStorage.setItem(`state:${contextReference}`, JSON.stringify(data))
      }
      console.log('LOADED STATE ------------------------ FROM SERVER ' + data.length)
      return data
    })
}

export default getState
