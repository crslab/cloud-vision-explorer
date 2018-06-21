import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import RenderView from '../containers/RenderViewContainer'
import InfoLink from './InfoLink'
import ImageCounter from './ImageCounter'
import Sidebar from './Sidebar'
import * as sidebarActionCreators from '../actions/sidebar'
import 'stylesheets/FrontPage'
import {EventEmitter} from 'fbemitter'
import BrowserChecker from './BrowserChecker'

const emitter = new EventEmitter()

const style = {
  infoLink: {
    position: 'absolute',
    top: '5vh', //height of logos on left panel
    left: '2vh',
    width: '20vh',
    zIndex: 100
  },
  imageCounter: {
    position: 'absolute',
    bottom: '1vh',
    left: '2vh',
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
        <ImageCounter style={style.imageCounter} emitter={emitter} />
        <InfoLink style={style.infoLink} emitter={emitter} />
        <Sidebar sidebar={sidebar} emitter={emitter} {...sidebarBounds} />
        <RenderView emitter={emitter} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { sidebar: state.sidebar }
}
export default connect(mapStateToProps)(FrontPage)
