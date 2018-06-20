import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { routerReducer } from 'react-router-redux'
import sidebar from '../reducers/sidebar'
import interpolate from '../reducers/interpolate.js'

const loggerMiddleware = createLogger(); // initialize logger
const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware,  // lets us dispatvch() functions
  loggerMiddleware    // neat middleware logs actions
)(createStore)

const rootReducer = combineReducers({
  sidebar,
  interpolate,
  routing: routerReducer
})

export default function configureStore() {
  return createStoreWithMiddleware(rootReducer)
}
