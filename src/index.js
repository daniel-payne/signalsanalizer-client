import React from 'react'
import ReactDOM from 'react-dom'


import registerServiceWorker from './registerServiceWorker'

import Application from './Components/Application'

import './index.css'

ReactDOM.render(<Application />, document.getElementById('root'))
registerServiceWorker()
