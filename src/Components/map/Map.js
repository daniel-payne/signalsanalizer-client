import React, { Component } from 'react'

import renderMap, { buildMap } from './map.d3'

import './Map.css'

class Map extends Component {
  constructor(props) {
    super(props)

    this.mapTarget = React.createRef()
  }

  componentDidMount() {
    buildMap(this.mapTarget.current)
  }

  componentDidUpdate() {
    const { countries } = this.props

    const targetSVG = this.mapTarget.current
    const onSelection = this.handleSelection

    renderMap({ targetSVG, onSelection, countries })
  }

  handleSelection = (selectedArea) => {
    if (selectedArea) {
      alert(selectedArea.properties.continentName)
    }
  }

  render() {
    return (
      <svg
        className="Map"
        id="map-display"
        ref={this.mapTarget}
        width={this.props.displayWidth}
        height={this.props.displayHeight - 120}
      >
        <g id="map-display-zoom">
          <g id="map-display-countries" />
          <g id="map-display-states" />
          <g id="map-display-counties" />
          <g id="map-display-conurbations" />
          <g id="map-display-places" />
          <g id="map-display-features" />
          <g id="map-display-events" />
        </g>
      </svg>
    )
  }
}

export default Map
