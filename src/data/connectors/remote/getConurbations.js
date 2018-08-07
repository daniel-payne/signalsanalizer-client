import rewind from 'geojson-rewind'
import wkt from 'terraformer-wkt-parser'

import { fixDateline } from '../../common'

function getConurbations(contextReference, useCache = true) {
  console.log('LOADING CONURBATIONS ------------------------ FOR ' + contextReference)
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`conurbations:${contextReference}`)
    console.log('LOADED CONURBATIONS ------------------------ FROM CACHE')
    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/geographic/conurbations?contextReference=${contextReference}`)
    .then((response) => {
      if (response.status !== 200) {
        console.log('ERROR /geographic/conurbations: ' + response.status)
        return
      }

      return response.json()
    })
    .then((data) => {
      return data.map((conurbation) => {
        const geoJson = wkt.parse(conurbation.outlineWKT)

        const geoJSONDateline = fixDateline(geoJson)

        const geoJsonRewound = rewind(geoJSONDateline, true)

        return {
          conurbationName: conurbation.conurbationName,
          contextReference: conurbation.contextReference,

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
        window.localStorage.setItem(`conurbations:${contextReference}`, JSON.stringify(data))
      }
      console.log('LOADED CONURBATIONS ------------------------ FROM SERVER ' + data.length)
      return data
    })
}

export default getConurbations
