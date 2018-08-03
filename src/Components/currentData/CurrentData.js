import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'

// import AppBar from '@material-ui/core/AppBar'
// import Toolbar from '@material-ui/core/Toolbar'
// import Typography from '@material-ui/core/Typography'
// import IconButton from '@material-ui/core/IconButton'
// import MenuIcon from '@material-ui/icons/Menu'

import './CurrentData.css'

class CurrentData extends Component {
  static propTypes = {
    countries: PropTypes.array,
    events: PropTypes.array,

    selectedCountry: PropTypes.object,

    onChoosePlace: PropTypes.func,
  }

  EventListing = (props) => {
    return props.events ? props.events.length : 'NO EVENTS'
  }

  PlaceListing = inject('store')(
    observer((props) => {
      const places = props.places || []

      const choosePlace = (place) => () => {
        const newRoute = props.store.calculateRoute({ place })

        this.props.history.push('/' + newRoute)
      }
      console.log('DRAWING LIST ----------------- ' + places && places.length > 0 ? places[0].contextReference : 'emptylist')
      return places.map((place) => {
        return (
          <div key={place.contextReference} onClick={choosePlace(place.contextReference)}>
            {place.countryName || place.stateName || place.countyName || place.conurbationName || place.contextReference}
            &nbsp;
            {place.contextReference}
          </div>
        )
      })
    })
  )

  render() {
    const { PlaceListing } = this
    const { countries, selectedStates, selectedCounties, selectedConurbations } = this.props

    return (
      <div className="CurrentData">
        <div className="data-list">
          <h4>Countries</h4>
          <PlaceListing places={countries} />
        </div>

        {selectedStates && (
          <div className="data-list">
            <h4>States</h4>
            <PlaceListing places={selectedStates} />
          </div>
        )}

        {selectedCounties && (
          <div className="data-list">
            <h4>Counties</h4>
            <PlaceListing places={selectedCounties} />
          </div>
        )}

        {selectedConurbations && (
          <div className="data-list">
            <h4>Conurbations</h4>
            <PlaceListing places={selectedConurbations} />
          </div>
        )}
      </div>
    )
  }
}

export default observer(withRouter(CurrentData))
