import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
// import createLogger from 'redux-logger'
import { routerReducer } from 'react-router-redux'
import sidebar from '../reducers/sidebar'
import interpolate from '../reducers/interpolate.js'

const rootReducer = combineReducers({
  sidebar,
  interpolate,
  routing: routerReducer
})
const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware  // lets us dispatvch() functions
  // createLogger()    // neat middleware logs actions
)(createStore)

export default function configureStore() {
  return createStoreWithMiddleware(rootReducer)
}
