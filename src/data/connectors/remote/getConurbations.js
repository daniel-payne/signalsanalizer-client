import rewind from 'geojson-rewind'

import { fixDateline } from '../../common'

function getConurbations(contextReference, useCache = true) {
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(
      `conurbations:${contextReference}`
    )

    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return fetch(
    `${
      process.env.REACT_APP_REST_ENDPOINT
    }/geographic/conurbations?contextReference=${contextReference}`
  )
    .then((response) => {
      if (response.status !== 200) {
        console.log('ERROR /geographic/conurbations: ' + response.status)
        return
      }

      return response.json()
    })
    .then((data) => {
      return data.map((conurbation) => {
        const geoJson = JSON.parse(conurbation.conurbationSimpleGeoJSON)

        const geoJSONDateline = fixDateline(geoJson)

        const geoJsonRewound = rewind(geoJSONDateline, true)

        return {
          conurbationName: conurbation.conurbationName,

          geoJSON: JSON.stringify({
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
      if (window.localStorage && data) {
        window.localStorage.setItem(
          `conurbations:${contextReference}`,
          JSON.stringify(data)
        )
      }

      return data
    })
}

export default getConurbations
