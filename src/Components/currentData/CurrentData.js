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
          </div>
        )
      })
    })
  )

  render() {
    const { PlaceListing } = this
    const { countries, displayedCountries, displayedStates, displayedConurbations, displayedCounties } = this.props

    return (
      <div className="CurrentData">
        <div className="data-list">
          <h4>Countries</h4>
          <PlaceListing places={countries} />
        </div>

        <div className="data-list">
          <h4>Displayed Countries</h4>
          <PlaceListing places={displayedCountries} />
        </div>
        <div className="data-list">
          <h4>Displayed States</h4>
          <PlaceListing places={displayedStates} />
        </div>
        <div className="data-list">
          <h4>Displayed Conurbations</h4>
          <PlaceListing places={displayedConurbations} />
        </div>
        <div className="data-list">
          <h4>Displayed Counties</h4>
          <PlaceListing places={displayedCounties} />
        </div>

        <div className="data-list">Displayed Summaries</div>
        <div className="data-list">Displayed Markers</div>
        <div className="data-list">Displayed Events</div>
      </div>
    )
  }
}

export default observer(withRouter(CurrentData))
