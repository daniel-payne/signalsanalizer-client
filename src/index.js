import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import amber from '@material-ui/core/colors/amber'
import teal from '@material-ui/core/colors/teal'

import registerServiceWorker from './registerServiceWorker'

import Application from './Components/Application'

import store from './data/store'

import './index.css'

const theme = createMuiTheme({
  palette: {
    primary: teal,
    secondary: amber,
  },
})

store.loadCountries().then(() => {
  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <Application />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
  )
})

registerServiceWorker()
// REPLACE WITH
// getVersion().then(data => {
//   if (data.clientVersion !== process.env.REACT_APP_VERSION) {
//     registerServiceWorker();
//   } else {
//     console.log(
//       `UPDATING version ${process.env.REACT_APP_VERSION} to ${
//         data.clientVersion
//       }`
//     );
//     unregister();
//   }
// });
