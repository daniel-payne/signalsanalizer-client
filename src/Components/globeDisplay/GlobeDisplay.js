import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react'

import renderMap from './GlobeDisplay.d3'

import './GlobeDisplay.css'

class GlobeDisplay extends Component {
  constructor(props) {
    super(props)

    this.mapTarget = React.createRef()
  }

  static propTypes = {
    displayWidth: PropTypes.number,
    displayHeight: PropTypes.number,
    countries: PropTypes.array,
    markers: PropTypes.array,
    selectedCountry: PropTypes.object,

    onChooseCountry: PropTypes.func,
  }

  state = {}

  handleSelection = (contextReference) => {
    const newRoute = this.props.store.calculateRoute({ place: contextReference })

    this.props.history.push('/' + newRoute)
  }

  componentDidUpdate() {
    const { countries, markers, selectedCountry, displayHeight, displayWidth } = this.props

    const targetSVG = this.mapTarget.current
    const onSelection = this.handleSelection

    const height = displayHeight - 120
    const width = displayWidth

    renderMap({ targetSVG, height, width, onSelection, countries, markers, selectedCountry })
  }

  render() {
    return (
      <svg className="GlobeDisplay" id="globe-display" ref={this.mapTarget} width={this.props.displayWidth} height={this.props.displayHeight}>
        <path id="map-display-globe" />
        <path id="map-display-graticule" />
        <g id="map-display-countries" />
        <path id="map-selected-country" />
      </svg>
    )
  }
}

export default inject('store')(withRouter(GlobeDisplay))
//export default inject('store')(observer(withRouter(GlobeDisplay)))
