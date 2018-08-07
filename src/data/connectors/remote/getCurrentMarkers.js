function getCurrentMarkers(useCache = true) {
  console.log('LOADING CURRENT MARKERS ------------------------')
  if (useCache === true && window.localStorage) {
    const result = window.localStorage.getItem(`currentMarkers`)
    console.log('LOADED CURRENT MARKERS ------------------------ FROM CACHE')
    if (result) {
      return Promise.resolve(JSON.parse(result))
    }
  }

  return fetch(`${process.env.REACT_APP_REST_ENDPOINT}/geographic/currentMarkers`)
    .then((response) => {
      if (response.status !== 200) {
        console.log('ERROR /geographic/globe: ' + response.status)
        return
      }

      return response.json()
    })
    .then((data) => {
      return data.map((marker) => {
        return {
          eventId: +marker.eventId,
          eventlatitude: +marker.eventlatitude,
          eventlongitude: +marker.eventlongitude,
        }
      })
    })
    .then((data) => {
      if (useCache === true && window.localStorage && data) {
        window.localStorage.setItem(`currentMarkers`, JSON.stringify(data))
      }
      console.log('LOADED CURRENT MARKERS ------------------------ FROM SERVER ' + data.length)
      return data
    })
}

export default getCurrentMarkers
