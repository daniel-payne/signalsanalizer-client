import rewind from 'geojson-rewind'

import { fixDateline } from '../../common'

function getCounties(contextReference, useCache = true) {
  console.log('LOADING COUNTIES ------------------------ FOR ' + contextReference)
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`counties:${contextReference}`)
    console.log('LOADED COUNTIES ------------------------ FROM CACHE')
    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/geographic/counties?contextReference=${contextReference}`)
    .then((response) => {
      if (response.status !== 200) {
        console.log('ERROR /geographic/counties: ' + response.status)
        return
      }

      return response.json()
    })
    .then((data) => {
      return data.map((county) => {
        const geoJson = JSON.parse(county.countySimpleGeoJSON)

        const geoJSONDateline = fixDateline(geoJson)

        const geoJsonRewound = rewind(geoJSONDateline, true)

        return {
          countyName: county.countyName,

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
        window.localStorage.setItem(`counties:${contextReference}`, JSON.stringify(data))
      }
      console.log('LOADED COUNTIES ------------------------ FROM SERVER ' + data.length)
      return data
    })
}

export default getCounties
