import React, { Component } from 'react'
import PropTypes from 'prop-types';

const style = {
  testText: {
    color: 'white',
    backgroundColor: '#626262',
    width: '100%',
    height: '100%'
  }
}

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
        <div style={style.testText}>
          SUCK MY BALLS
        </div>
      </div>
    )
  }
}

export default HistoryBar
