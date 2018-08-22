import rewind from 'geojson-rewind'
import wkt from 'terraformer-wkt-parser'

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
        const geoJson = wkt.parse(county.outlineWKT)

        const geoJSONDateline = fixDateline(geoJson)

        const geoJsonRewound = rewind(geoJSONDateline, true)

        return {
          countyName: county.countyName,
          contextReference: county.contextReference,

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
        try {
          window.localStorage.setItem(`counties:${contextReference}`, JSON.stringify(data))
        } catch (error) {
          console.log('COuNTIES STORAGE FULL :' + contextReference)
        }
      }
      console.log('LOADED COUNTIES ------------------------ FROM SERVER ' + data.length)
      return data
    })
}

export default getCounties
