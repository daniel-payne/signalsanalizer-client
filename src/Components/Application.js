import React, { Component } from 'react'

import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom'
import Dimensions from 'react-dimensions' // try react-sizes
import { observer, inject } from 'mobx-react'

import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'

import Header from './header/Header'
import Footer from './footer/Footer'
// import Map from './map/Map'
import CurrentData from './currentData/CurrentData'

import './Application.css'

class Manager extends Component {
  state = {}

  static getDerivedStateFromProps(props, state) {
    const display = props.location.pathname.replace('/', '')

    if (props.store && display !== state.display) {
      props.store.validateRoute(display)

      return { display }
    }

    return null
  }

  render() {
    return <React.Fragment>{this.props.children}</React.Fragment>
  }
}

const RouteManager = withRouter(Manager)

const RenderView = (props) => {
  const { globe, displayReference } = props.store
  const { countries, selectedCountry } = globe || {}
  const { states, selectedState } = selectedCountry || {}
  const { counties, selectedCounty } = selectedState || {}
  const { conurbations, selectedConurbation } = selectedState || {}

  switch (displayReference) {
    case 'DATA':
      return (
        <CurrentData
          className="map-display"
          countries={countries}
          states={states}
          selectedStates={states}
          selectedCounties={counties}
          selectedConurbations={conurbations}
        />
      )
    default:
      return (
        <CurrentData
          className="map-display"
          countries={countries}
          states={states}
          selectedStates={states}
          selectedCounties={counties}
          selectedConurbations={conurbations}
        />
      )
  }
}

class Application extends Component {
  state = {
    left: false,
    right: false,
    location: undefined,
    contenents: [],
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open || !this.state[side],
    })
  }

  render() {
    // let total //eslint-disable-line no-unused-vars
    // //Hack to ensure all is drawn correctly
    // total += this.props.store.displayedCountries ? this.props.store.displayedCountries.length : 0
    // total += this.props.store.displayedStates ? this.props.store.displayedStates.length : 0
    // total += this.props.store.displayedCounties ? this.props.store.displayedCounties.length : 0
    // total += this.props.store.displayedConurbations ? this.props.store.displayedConurbations.length : 0

    const { globe } = this.props.store
    const { countries, selectedCountry } = globe || {}
    const { states, selectedState } = selectedCountry || {}
    const { counties, selectedCounty } = selectedState || {}
    const { conurbations, selectedConurbation } = selectedState || {}

    return (
      <div className="Application">
        <Router>
          <RouteManager store={this.props.store}>
            <CssBaseline />

            <Header
              // title={this.props.store.displayedCounties.length}
              selectedCountry={selectedCountry}
              selectedState={selectedState}
              selectedCounty={selectedCounty}
              selectedConurbation={selectedConurbation}
              onOpenLeftDrawer={this.toggleDrawer('left', true)}
              onOpenRightDrawer={this.toggleDrawer('right', true)}
            />

            {/* <Map
              className="map-display"
              countries={this.props.store.countries || []}
              displayWidth={this.props.containerWidth}
              displayHeight={this.props.containerHeight}
              onLoadCountry={this.handleLoadCountry}
            /> */}
            <Switch>
              <Route
                path="/:display"
                render={({ match }) => {
                  return <RenderView store={this.props.store} />
                }}
              />
              <Route
                path="/"
                exact={false}
                render={({ match }) => {
                  return (
                    <CurrentData
                      className="map-display"
                      countries={this.props.store.globe.countries}
                      selectedCountry={this.props.store.globe.selectedCountry}
                      // states={this.props.store.states}
                      // displayedCountries={this.props.store.displayedCountries}
                      // displayedStates={this.props.store.displayedStates}
                      // displayedCounties={this.props.store.displayedCounties}
                      // displayedConurbations={this.props.store.displayedConurbations}
                    />
                  )
                }}
              />
            </Switch>

            <Footer temporalReference={this.props.store.temporalReference} />

            <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)} anchor="left">
              <div tabIndex={0} role="button" onClick={this.toggleDrawer('left', false)} onKeyDown={this.toggleDrawer('left', false)}>
                Left Drawer
              </div>
            </Drawer>
            <Drawer open={this.state.right} onClose={this.toggleDrawer('right', false)} anchor="right">
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer('right', false)}
                onKeyDown={this.toggleDrawer('right', false)}
                style={{
                  width: '600px',
                }}
              >
                Right Drawer
                {this.props.store.selectedCountry ? this.props.store.selectedCountry.countryName : 'NONE'}
              </div>
            </Drawer>
          </RouteManager>
        </Router>
      </div>
    )
  }
}

const Injectedpplication = inject('store')(observer(Application))
const DimensionsApplication = Dimensions()(Injectedpplication)

export default DimensionsApplication
