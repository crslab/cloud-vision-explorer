
import React    from 'react'
import PropTypes from 'prop-types'

import getBase64FaceImage from '../misc/FaceRenderer.js'

var createReactClass = require('create-react-class');

var FView = createReactClass({
  displayName: 'FView',
  
  render() {
    return (
      <img ref={(c) => this._image = c} className={this.props.className} />
    )
  },

  propTypes: {
    className: PropTypes.string,
    faceColor: PropTypes.number,
    rollAngle: PropTypes.number,
    panAngle: PropTypes.number,
    tiltAngle: PropTypes.number
  },

  // Perhaps this is added for performance reasons?
  shouldComponentUpdate() {
    return false
  },

  componentDidMount() {
    this._image.src = getBase64FaceImage(this.props.tiltAngle,
      this.props.panAngle,
      this.props.rollAngle,
      this.props.faceColor)
  }
})
module.exports = FView;
