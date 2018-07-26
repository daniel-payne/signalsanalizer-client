import * as d3 from 'd3'
import rewind from 'geojson-rewind'

import { fixDateline } from '../../data/common'

const mercatorProjection = d3.geoMercator().center([0, 65])
// const orthographicProjection = d3.geoOrthographic().center([0, 20])
// const equirectangularProjection = d3.geoEquirectangular().center([0, 0])

const mercatorPathConverter = d3.geoPath().projection(mercatorProjection)
// const orthographicPathConverter = d3
//   .geoPath()
//   .projection(orthographicProjection)
// const equirectangularPathConverter = d3
//   .geoPath()
//   .projection(equirectangularProjection)

export const buildMap = (targetSVG) => {
  const svg = d3.select(targetSVG)
  const zoomGrouping = svg.select('g#map-display-zoom')

  const zoomed = (zoomGrouping) => () => {
    zoomGrouping.attr('transform', d3.event.transform)
  }

  const zoom = d3.zoom().on('zoom', zoomed(zoomGrouping))

  svg.call(zoom)
}

const renderMap = ({ targetSVG, onSelection, countries }) => {
  const svg = d3.select(targetSVG)
  const countriesGrouping = svg.select('g#map-display-countries')

  const displayData = countries.map((feature) => {
    const geoJson = JSON.parse(feature.geoJSON)

    geoJson.properties = {
      name: feature.countryName,
    }

    return geoJson
  })

  countriesGrouping
    .selectAll('path')
    .data(displayData)
    .enter()
    .append('path')
    .attr('d', mercatorPathConverter)
    .attr('class', 'country')
    // .attr('vector-effect', 'non-scaling-stroke')
    // .attr('stroke', 'red')
    .on('mouseover', function(d) {
      d3.select(this).style('fill', 'grey')
    })
    .on('mouseout', function(d) {
      d3.select(this).style('fill', 'white')
    })
    .on('click', function(d) {
      if (onSelection) {
        onSelection(d)
      }
    })
}

export default renderMap
