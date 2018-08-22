import rewind from 'geojson-rewind'
import wkt from 'terraformer-wkt-parser'

import { fixDateline } from '../../common'

function getConurbation(contextReference, useCache = true) {
  console.log('LOADING CONURBATION ------------------------ FOR ' + contextReference)
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`conurbation:${contextReference}`)
    console.log('LOADED CONURBATION ------------------------ FROM CACHE')
    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/geographic/conurbation?contextReference=${contextReference}`)
    .then((response) => {
      if (response.status !== 200) {
        console.log('ERROR /geographic/conurbation: ' + response.status)
        return
      }

      return response.json()
    })
    .then((data) => {
      return data.map((conurbation) => {
        const geoJson = wkt.parse(conurbation.borderWKT)

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
        try {
          window.localStorage.setItem(`counties:${contextReference}`, JSON.stringify(data))
        } catch (error) {
          console.log('CONURBATION STORAGE FULL :' + contextReference)
        }
      }
      console.log('LOADED CONURBATION ------------------------ FROM SERVER ' + data.length)
      return data
    })
}

export default getConurbation
