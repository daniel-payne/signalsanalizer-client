import * as d3 from 'd3'

const orthographicProjection = d3.geoOrthographic().rotate(0, 90, 0) //.center([0, 20])
const orthographicPathConverter = d3.geoPath().projection(orthographicProjection)

let currentZoom

let pathConverter
let zoomManager

function zoomInto(d, node) {
  const mapDisplay = d3.select('#map-display')
  const mapDisplayElement = node

  const width = mapDisplayElement.getBoundingClientRect().width
  const height = mapDisplayElement.getBoundingClientRect().height

  const bounds = pathConverter.bounds(d)
  const dx = bounds[1][0] - bounds[0][0]
  const dy = bounds[1][1] - bounds[0][1]
  const x = (bounds[0][0] + bounds[1][0]) / 2
  const y = (bounds[0][1] + bounds[1][1]) / 2
  const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)))
  const translate = [width / 2 - scale * x, height / 2 - scale * y]

  var transform = d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)

  mapDisplay.call(zoomManager.transform, transform)
}

export const buildMap = (targetSVG) => {
  const svg = d3.select(targetSVG)
  const zoomGrouping = svg.select('g#map-display-zoom')

  const zoomed = (zoomGrouping) => () => {
    const transform = d3.event.transform
    if (transform.k < 0.8) {
      transform.k = 0.8
      transform.x = 0
      transform.y = 0
    }

    //zoomGrouping.attr('transform', transform)

    //const sens = 0.25
    //var rotate = orthographicProjection.rotate()
    //orthographicProjection.rotate([transform.x * sens, -transform.y * sens, rotate[2]])

    svg.selectAll('path').style('stroke-width', () => {
      return 2 / transform.k
    })

    currentZoom = transform.k
  }

  zoomManager = d3.zoom().on('zoom', zoomed(zoomGrouping))

  svg.call(zoomManager)
}

const renderMap = ({ targetSVG, onSelection, countries }) => {
  const svg = d3.select(targetSVG)
  const countriesGrouping = svg.select('g#map-display-countries')

  const countryOutlineData = countries
    .filter((country) => country.outline)

    .map((country) => {
      const geoJson = JSON.parse(country.outline)

      geoJson.properties = {
        name: country.countryName,
        contextReference: country.contextReference,
        type: 'COUNTRY',
      }

      return geoJson
    })

  const countriesSelection = countriesGrouping.selectAll('path').data(countryOutlineData, (d) => d.properties.contextReference)

  countriesSelection
    .enter()
    .append('path')
    .attr('d', orthographicPathConverter)

  countriesSelection.exit().remove()

  countriesGrouping
    .selectAll('path')
    .attr('class', 'country')
    .style('fill', 'white')
    .style('stroke-width', 2 / currentZoom)
    .style('stroke', 'gainsboro')
    .on('mouseover', function(d) {
      d3.select(this).style('fill', 'gainsboro')
    })
    .on('mouseout', function(d) {
      d3.select(this).style('fill', 'white')
    })
    .on('click', function(d) {
      //zoomInto(d3.select(this), d3.select(this).node())

      if (onSelection) {
        onSelection(d)
      }
    })
}

export default renderMap
