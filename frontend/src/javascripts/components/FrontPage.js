import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import RenderView from '../containers/RenderViewContainer'
import ImageCounter from './ImageCounter'
import Sidebar from './Sidebar'
import HistoryBar from './HistoryBar'
import * as sidebarActionCreators from '../actions/sidebar'
import 'stylesheets/FrontPage'
import {EventEmitter} from 'fbemitter'
import BrowserChecker from './BrowserChecker'
import { hot } from 'react-hot-loader'

const emitter = new EventEmitter()

const style = {
  historyBar: {
    position: 'absolute',
    top: '0vh',
    bottom: '0vh',
    left: '0vh',
    width: '5vw',
    zIndex: 100
  }
}

class FrontPage extends Component {
  static get propTypes() {
    return {
      sidebar: PropTypes.object.isRequired,
      dispatch: PropTypes.func.isRequired
    }
  }

  render() {
    const { sidebar, dispatch } = this.props
    const sidebarBounds = bindActionCreators(sidebarActionCreators, dispatch)

    return (
      <div >
        <Sidebar sidebar={sidebar} emitter={emitter} {...sidebarBounds} />
        <HistoryBar style={style.historyBar} emitter={emitter} />
        <RenderView emitter={emitter} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { sidebar: state.sidebar }
}
export default hot(module)(connect(mapStateToProps)(FrontPage))
