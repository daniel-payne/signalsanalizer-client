import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

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

  CountryListing = observer((props) => {
    return props.countries
      ? props.countries.map((country) => {
          return (
            <div
              key={country.contextReference}
              onClick={
                props.onLoadCountry
                  ? props.onLoadCountry(country.contextReference)
                  : null
              }
            >
              {country.countryName}
            </div>
          )
        })
      : 'NO COUNTRIES'
  })

  StateListing = observer((props) => {
    return props.states
      ? props.states.map((state) => {
          return (
            <div
              key={state.contextReference}
              onClick={
                props.onLoadState
                  ? props.onLoadState(state.contextReference)
                  : null
              }
            >
              {state.stateName} {state.contextReference}
            </div>
          )
        })
      : 'NO STATES'
  })

  handleChoosePlace = (contextReference) => () => {
    if (this.props.onChoosePlace) {
      this.props.onChoosePlace(contextReference)
    }
  }

  render() {
    const { EventListing, CountryListing, StateListing } = this
    const {
      countries,
      states,
      displayedCountries,
      displayedStates,
      events,
    } = this.props

    return (
      <div className="CurrentData">
        <div className="data-list">
          <h4>Countries</h4>
          <CountryListing
            countries={countries}
            onLoadCountry={this.handleChoosePlace}
          />
        </div>
        <div className="data-list">Events</div>
        <div className="data-list">
          <h4>Displayed Countries</h4>
          <CountryListing countries={displayedCountries} />
        </div>
        <div className="data-list">
          <h4>Displayed States</h4>
          <StateListing states={displayedStates} />
        </div>
        <div className="data-list">Displayed Counties</div>
      </div>
    )
  }
}

export default observer(CurrentData)
