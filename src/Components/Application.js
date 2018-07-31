import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Dimensions from 'react-dimensions'
import { observer, inject } from 'mobx-react'

import Header from './header/Header'
import Footer from './footer/Footer'
import Map from './map/Map'
import CurrentData from './currentData/CurrentData'

import './Application.css'

import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'

class Application extends Component {
  state = {
    left: false,
    right: false,
    contenents: [],
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open || !this.state[side],
    })
  }

  handleChoosePlace = (contextReference) => {
    // alert(contextReference)
    this.props.store.choosePlace(contextReference)
  }

  handleChoosePeriod = (temporalReference) => {
    alert(temporalReference)
    //this.props.store.loadPeriod(temporalReference)
  }

  render() {
    return (
      <div className="Application">
        <Router>
          <React.Fragment>
            <CssBaseline />

            <Header
              title={this.props.store.displayedStates.length}
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
                path="/:view/:duration/:contextReference"
                render={({ match }) => {
                  let { view, duration, contextReference } = match.params

                  view = view.toUpperCase()

                  if (
                    duration.toUpperCase() !== this.props.store.selectedDuration
                  ) {
                    this.props.store.loadPeriod(duration)
                  }

                  if (
                    contextReference.toUpperCase() !==
                    this.props.store.selectedPlace
                  ) {
                    this.props.store.loadPlace(contextReference)
                  }

                  return (
                    <CurrentData
                      className="map-display"
                      {...this.props.store}
                      onChoosePlace={this.handleChoosePlace}
                      onChoosePeriod={this.handleChoosePeriod}
                    />
                  )
                }}
              />
              <Route
                path="/:view/:duration"
                render={({ match }) => {
                  let { view, duration } = match.params

                  view = view.toUpperCase()
                  duration = duration.toUpperCase()
                  const contextReference = undefined

                  return (
                    <CurrentData
                      className="map-display"
                      {...this.props.store}
                      onChoosePlace={this.handleChoosePlace}
                      onChoosePeriod={this.handleChoosePeriod}
                    />
                  )
                }}
              />
              <Route
                path="/"
                exact={false}
                render={({ match }) => {
                  const view = 'MERCATOR'
                  const duration = 'YEAR'
                  const contextReference = undefined

                  return (
                    <CurrentData
                      className="map-display"
                      countries={this.props.store.countries}
                      states={this.props.store.states}
                      displayedCountries={this.props.store.displayedCountries}
                      displayedStates={this.props.store.displayedStates}
                      onChoosePlace={this.handleChoosePlace}
                      onChoosePeriod={this.handleChoosePeriod}
                    />
                  )
                }}
              />
            </Switch>

            <Footer />

            <Drawer
              open={this.state.left}
              onClose={this.toggleDrawer('left', false)}
              anchor="left"
            >
              <div
                tabIndex={0}
                role="button"
                onClick={this.toggleDrawer('left', false)}
                onKeyDown={this.toggleDrawer('left', false)}
              >
                Left Drawer
              </div>
            </Drawer>
            <Drawer
              open={this.state.right}
              onClose={this.toggleDrawer('right', false)}
              anchor="right"
            >
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
                {this.props.store.selectedCountry
                  ? this.props.store.selectedCountry.countryName
                  : 'NONE'}
              </div>
            </Drawer>
          </React.Fragment>
        </Router>
      </div>
    )
  }
}

const Injectedpplication = inject('store')(observer(Application))
const DimensionsApplication = Dimensions()(Injectedpplication)

export default DimensionsApplication
