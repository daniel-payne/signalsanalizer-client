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
    states: PropTypes.array,
    markers: PropTypes.array,
    selectedCountry: PropTypes.object,

    onChooseCountry: PropTypes.func,
  }

  state = {}

  handleSelection = (contextReference) => {
    const newRoute = this.props.store.calculateRoute({ place: contextReference })

    this.props.history.push('/' + newRoute)
  }

  componentDidMount() {
    const { countries, markers, states, selectedCountry, displayHeight, displayWidth } = this.props

    const targetSVG = this.mapTarget.current
    const onSelection = this.handleSelection

    const height = displayHeight - 120
    const width = displayWidth

    renderMap({ targetSVG, height, width, onSelection, countries, markers, states, selectedCountry })
  }

  componentDidUpdate() {
    const { countries, markers, states, selectedCountry, displayHeight, displayWidth } = this.props

    const targetSVG = this.mapTarget.current
    const onSelection = this.handleSelection

    const height = displayHeight - 120
    const width = displayWidth

    renderMap({ targetSVG, height, width, onSelection, countries, markers, states, selectedCountry })
  }

  render() {
    return (
      <svg className="GlobeDisplay" id="globe-display" ref={this.mapTarget} width={this.props.displayWidth} height={this.props.displayHeight}>
        <g id="map-display-globe" />
        <g id="map-display-graticule" />
        <g id="map-display-countries" />
        <g id="map-selected-country" />
        <g id="map-display-states" />
      </svg>
    )
  }
}

export default inject('store')(observer(withRouter(GlobeDisplay)))
//export default inject('store')(observer(withRouter(GlobeDisplay)))
