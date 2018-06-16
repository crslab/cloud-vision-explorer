'use strict'
import 'babel-polyfill'
import 'stylesheets/main'
import React from 'react'
import ReactDom from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter, Route } from 'react-router-dom';
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import configureStore from './store/configureStore'
import EntrancePage from './components/EntrancePage'
import FrontPage from './components/FrontPage'

console.log(FrontPage)

const store = configureStore()

ReactDom.render(
  <Provider store={store}>
    <HashRouter>
      <div>
        <Route path="/galaxy" component={FrontPage} />
        <Route path="/" component={EntrancePage} />
      </div>
    </HashRouter>
  </Provider>,
  document.getElementById('contents')
)
