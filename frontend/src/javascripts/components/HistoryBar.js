import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Button from 'react-toolbox/lib/button'
import 'stylesheets/HistoryBar'

class HistoryBar extends Component {
  static get propTypes() {
    return {
      emitter: PropTypes.object.isRequired,
      style: PropTypes.object.isRequired
    }
  }

  render() {
    return (
      <div style={this.props.style}>
        <div className="titleIcon">
          <Button icon="collections" ripple inverse />
        </div>
        <div className="historyCollection">

        </div>
      </div>
    )
  }
}

export default HistoryBar
