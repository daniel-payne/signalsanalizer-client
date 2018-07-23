import * as d3 from 'd3'
// import d3Tip from 'd3-tip'

const drawTextcontinentName = (d) => {
  return d.properties.continentName
}

let zoomGrouping

// const tip = d3Tip()
//   .attr('class', 'd3-tip')
//   .offset([-10, 0])
//   .html(function(d) {
//     return (
//       "<strong>Country: </strong><span class='details'>" +
//       d.properties.continentName +
//       '<br></span>'
//     )
//   })

const buildMap = (targetSVG, props, state) => {
  const { displayHeight, displayWidth, contenents } = props

  function zoomed() {
    zoomGrouping.attr('transform', d3.event.transform)
  }

  const projection = d3.geoMercator().center([0, 65]) // geoOrthographic geoMercator geoEquirectangular geoGnomonic
  //.scale(100) // scale to fit group width
  //.translate([width / 2, height / 2]) // ensure centred in group

  const pathConverter = d3.geoPath().projection(projection)

  var svg = d3.select(targetSVG)

  if (!zoomGrouping) {
    zoomGrouping = svg.append('g')

    const zoom = d3
      .zoom()
      //.scaleExtent([1, 40])
      //.translateExtent([[0, 0], [displayWidth, displayHeight]])
      //.extent([[0, 0], [displayWidth, displayHeight]])
      .on('zoom', zoomed)

    svg.call(zoom)
  }

  zoomGrouping
    .selectAll('path')
    .data(contenents)
    .enter()
    .append('path')
    .attr('d', pathConverter)
    .attr('fill', '#FFF')
    .on('mouseover', function(d) {
      //tip.show(d)

      d3.select(this).style('fill', 'grey')
    })
    .on('mouseout', function(d) {
      //tip.hide(d)

      d3.select(this).style('fill', 'white')
    })
    .on('click', function(d) {
      alert(d.properties.continentName)
    })
}

export default buildMap
