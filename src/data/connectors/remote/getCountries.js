function getCountries(useCache = true) {
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`countries`)

    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/geographic/countries`)
    .then((response) => {
      if (response.status !== 200) {
        console.log('ERROR /geographic/countries: ' + response.status)
        return
      }

      return response.json()
    })
    .then((data) => {
      return data.map((country) => {
        const geoJson = JSON.parse(country.countrySimpleGeoJSON)

        geoJson.coordinates.forEach((data) => {
          data[0].reverse()
        })

        return {
          type: 'Feature',
          geometry: geoJson,
          properties: {
            countryName: country.countryName,
          },
        }
      })
    })
    .then((data) => {
      return data.filter(
        (country) => country.properties.countryName !== 'Antarctica'
      )
    })
    .then((data) => {
      if (window.localStorage && data) {
        window.localStorage.setItem(`countries`, JSON.stringify(data))
      }

      return data
    })
}

export default getCountries
