import * as d3 from 'd3'

const mercatorProjection = d3.geoMercator().center([0, 65])
const orthographicProjection = d3.geoOrthographic().center([0, 20])
const equirectangularProjection = d3.geoEquirectangular().center([0, 0])

const mercatorPathConverter = d3.geoPath().projection(mercatorProjection)
const orthographicPathConverter = d3
  .geoPath()
  .projection(orthographicProjection)
const equirectangularPathConverter = d3
  .geoPath()
  .projection(equirectangularProjection)

export const MERCATOR = 'MERCATOR'
export const ORTHOGRAPHIC = 'ORTHOGRAPHIC'
export const EQUIRECTANGULAR = 'EQUIRECTANGULAR'
export const PROJECTION_TYPES = [MERCATOR, ORTHOGRAPHIC, EQUIRECTANGULAR]

export const COUNTRY = 'COUNTRY'
export const MAP_TYPES = [COUNTRY]

let currentZoom

export const buildMap = (targetSVG) => {
  const svg = d3.select(targetSVG)
  const zoomGrouping = svg.select('g#map-display-zoom')
  const countryGrouping = svg.select('g#map-display-countries')

  const zoomed = (zoomGrouping) => () => {
    const transform = d3.event.transform
    if (transform.k < 0.8) {
      transform.k = 0.8
      transform.x = 0
      transform.y = 0
    }

    zoomGrouping.attr('transform', transform)

    svg.selectAll('path').style('stroke-width', () => {
      return 2 / transform.k
    })

    currentZoom = transform.k
  }

  zoomManager = d3.zoom().on('zoom', zoomed(zoomGrouping))

  svg.call(zoomManager)
}

let pathConverter
let zoomManager

function zoomInto(d) {
  const mapDisplay = d3.select('#map-display')
  const mapDisplayElement = mapDisplay.node()

  const width = mapDisplayElement.getBoundingClientRect().width
  const height = mapDisplayElement.getBoundingClientRect().height

  const bounds = pathConverter.bounds(d)
  const dx = bounds[1][0] - bounds[0][0]
  const dy = bounds[1][1] - bounds[0][1]
  const x = (bounds[0][0] + bounds[1][0]) / 2
  const y = (bounds[0][1] + bounds[1][1]) / 2
  const scale = Math.max(
    1,
    Math.min(8, 0.9 / Math.max(dx / width, dy / height))
  )
  const translate = [width / 2 - scale * x, height / 2 - scale * y]

  var transform = d3.zoomIdentity
    .translate(translate[0], translate[1])
    .scale(scale)

  mapDisplay.call(zoomManager.transform, transform)
}

const renderMap = ({
  targetSVG,
  onSelection,
  countries,
  selectedCountry,
  projectionType = MERCATOR,
}) => {
  const svg = d3.select(targetSVG)
  const countriesGrouping = svg.select('g#map-display-countries')
  const selectedCountryGrouping = svg.select('g#map-display-selected-country')

  const countryOutlineData = countries
    .filter((country) => country.outline)
    .filter((country) => {
      if (country && country.contextReference) {
        if (selectedCountry && selectedCountry.contextReference) {
          if (country.contextReference === selectedCountry.contextReference) {
            return false
          }
        }
      }
      return true
    })
    .map((country) => {
      const geoJson = JSON.parse(country.outline)

      geoJson.properties = {
        name: country.countryName,
        contextReference: country.contextReference,
        type: COUNTRY,
      }

      return geoJson
    })

  let countryBorderData

  if (selectedCountry) {
    const geoJson = JSON.parse(selectedCountry.border)

    geoJson.properties = {
      name: selectedCountry.countryName,
      contextReference: selectedCountry.contextReference,
      type: COUNTRY,
    }

    countryBorderData = [geoJson]
  }

  switch (projectionType) {
    case MERCATOR:
      pathConverter = mercatorPathConverter
      break
    case ORTHOGRAPHIC:
      pathConverter = orthographicPathConverter
      break
    case EQUIRECTANGULAR:
      pathConverter = equirectangularPathConverter
      break
    default:
      pathConverter = mercatorPathConverter
  }

  const countriesSelection = countriesGrouping
    .selectAll('path')
    .data(countryOutlineData, (d) => d.properties.contextReference)

  countriesSelection
    .enter()
    .append('path')
    .attr('d', pathConverter)

  countriesSelection.exit().remove()

  countriesGrouping
    .selectAll('path')
    .attr('class', 'country')
    .style('fill', 'white')
    .style('stroke-width', () => {
      return selectedCountry === undefined ? 2 / currentZoom : 0
    })
    .style('stroke', () => {
      return selectedCountry === undefined ? 'gainsboro' : 'white'
    })
    .on('mouseover', function(d) {
      if (selectedCountry === undefined) {
        d3.select(this).style('fill', 'gainsboro')
      } else {
        d3.select(this).style('stroke-width', 2 / currentZoom)
        d3.select(this).style('stroke', 'gainsboro')
      }
    })
    .on('mouseout', function(d) {
      if (selectedCountry === undefined) {
        d3.select(this).style('fill', 'white')
      } else {
        d3.select(this).style('stroke-width', 0)
        d3.select(this).style('stroke', 'white')
      }
    })
    .on('click', function(d) {
      zoomInto(d)

      if (onSelection) {
        onSelection(d)
      }
    })

  if (selectedCountry) {
    const selectedCountrySelection = selectedCountryGrouping
      .selectAll('path')
      .data(countryBorderData, (d) => d.properties.contextReference)

    selectedCountrySelection
      .enter()
      .append('path')
      .attr('d', pathConverter)

    selectedCountrySelection.exit().remove()

    selectedCountryGrouping
      .selectAll('path')
      .attr('class', 'country--selected')
      .style('fill', 'gainsboro')
      .style('stroke-width', () => {
        return 2 / currentZoom
      })
  }
}

export default renderMap
