import 'babel-polyfill'
import 'stylesheets/main'
import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter, Route } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin'
import importWebComponents from 'importWebComponents'

importWebComponents()
injectTapEventPlugin()

import configureStore from './store/configureStore'
import FrontPage from './components/FrontPage'

const store = configureStore()

ReactDom.render(
  <Provider store={store}>
    <HashRouter>
      <div>
        <Route path="/galaxy" component={FrontPage} />
        <Route path="/" component={FrontPage} />
      </div>
    </HashRouter>
  </Provider>,
  document.getElementById('contents'),
  document.addEventListener('touchstart', function(e) {
    console.log("cT: ",e.changedTouches.length)
    console.log("tT: ",e.targetTouches.length)
    console.log("t: ",e.touches.length)
    if (e.touches.length === 2) {
      e.preventDefault()
    }
  }, {passive: false})
)
