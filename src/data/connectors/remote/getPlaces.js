import rewind from 'geojson-rewind'

import { fixDateline } from '../../common'

function getPlaces(contextReference, useCache = true) {
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`places:${contextReference}`)

    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/geographic/places?contextReference=${contextReference}`)
    .then((response) => {
      if (response.status !== 200) {
        console.log('ERROR /geographic/places: ' + response.status)
        return
      }

      return response.json()
    })
    .then((data) => {
      return data.map((place) => {
        const geoJson = JSON.parse(place.placeSimpleGeoJSON)

        const geoJSONDateline = fixDateline(geoJson)

        const geoJsonRewound = rewind(geoJSONDateline, true)

        return {
          placeName: place.placeName,

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
      if (useCache === true && window.localStorage && data) {
        window.localStorage.setItem(`places:${contextReference}`, JSON.stringify(data))
      }

      return data
    })
}

export default getPlaces
