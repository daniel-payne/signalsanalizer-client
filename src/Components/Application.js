import React, { Component } from 'react'

import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom'
import Dimensions from 'react-dimensions' // try react-sizes
import { observer, inject } from 'mobx-react'

import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'

import Header from './header/Header'
import Footer from './footer/Footer'

import GlobeDisplay from './globeDisplay/GlobeDisplay'
import MapDisplay from './mapDisplay/MapDisplay'
import DataDisplay from './dataDisplay/DataDisplay'

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
  const { store, containerWidth, containerHeight } = props
  const { globe, displayReference } = store
  const { countries, markers, selectedCountry } = globe || {}
  const { states, selectedState } = selectedCountry || {}
  const { counties, selectedCounty } = selectedState || {}
  const { conurbations, selectedConurbation } = selectedState || {}

  switch (displayReference) {
    case 'DATA':
      return (
        <DataDisplay
          className="map-display"
          countries={countries}
          states={states}
          selectedStates={states}
          selectedCounties={counties}
          selectedConurbations={conurbations}
        />
      )
    case 'GLOBE':
      return (
        <GlobeDisplay
          className="map-display"
          countries={countries}
          markers={markers}
          states={states}
          selectedCountry={selectedCountry}
          selectedState={selectedState}
          selectedCounty={selectedCounty}
          selectedConurbation={selectedConurbation}
          displayWidth={containerWidth}
          displayHeight={containerHeight}
          //Hack to ensure all is drawn correctly
          countriesCount={countries ? countries.length : 0}
          statesCount={states ? states.length : 0}
          countiesCount={counties ? counties.length : 0}
          conurbationsCount={conurbations ? conurbations.length : 0}
        />
      )
    case 'MAP':
      return <MapDisplay className="map-display" countries={countries} markers={markers} displayWidth={containerWidth} displayHeight={containerHeight} />
    default:
      return (
        <DataDisplay
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
    const { globe } = this.props.store
    // eslint-disable-next-line no-unused-vars
    const { countries, selectedCountry } = globe || {}
    // eslint-disable-next-line no-unused-vars
    const { states, selectedState } = selectedCountry || {}
    // eslint-disable-next-line no-unused-vars
    const { counties, selectedCounty } = selectedState || {}
    // eslint-disable-next-line no-unused-vars
    const { conurbations, selectedConurbation } = selectedState || {}

    return (
      <div className="Application">
        <Router>
          <RouteManager store={this.props.store}>
            <CssBaseline />

            <Header
              // title={selectedCountry ? selectedCountry.states.length : 'x'}
              selectedCountry={selectedCountry}
              selectedState={selectedState}
              selectedCounty={selectedCounty}
              selectedConurbation={selectedConurbation}
              onOpenLeftDrawer={this.toggleDrawer('left', true)}
              onOpenRightDrawer={this.toggleDrawer('right', true)}
              //Hack to ensure all is drawn correctly
              countriesCount={countries ? countries.length : 0}
              statesCount={states ? states.length : 0}
              countiesCount={counties ? counties.length : 0}
              conurbationsCount={conurbations ? conurbations.length : 0}
            />

            <Switch>
              <Route
                path="/:display"
                render={() => {
                  return <RenderView store={this.props.store} containerWidth={this.props.containerWidth} containerHeight={this.props.containerHeight} />
                }}
              />
              <Route
                path="/"
                exact={false}
                render={() => {
                  return <RenderView store={this.props.store} containerWidth={this.props.containerWidth} containerHeight={this.props.containerHeight} />
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
