import rewind from 'geojson-rewind'

import { fixDateline } from '../../common'

function getStates(contextReference, useCache = true) {
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`states:${contextReference}`)

    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return fetch(
    `${
      process.env.REACT_APP_REST_ENDPOINT
    }/geographic/states?contextReference=${contextReference}`
  )
    .then((response) => {
      if (response.status !== 200) {
        console.log('ERROR /geographic/states: ' + response.status)
        return
      }

      return response.json()
    })
    .then((data) => {
      return data.map((state) => {
        const geoJson = JSON.parse(state.stateSimpleGeoJSON)

        const geoJSONDateline = fixDateline(geoJson)

        const geoJsonRewound = rewind(geoJSONDateline, true)

        return {
          stateName: state.stateName,

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
          `states:${contextReference}`,
          JSON.stringify(data)
        )
      }

      return data
    })
}

export default getStates
