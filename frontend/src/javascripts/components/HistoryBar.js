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

  constructor(props, context) {
    super(props, context)
    this.state = {
      previewImgPath: "",
    }
  }

  componentDidMount() {
    this.props.emitter.addListener('history-img-ready', (imgPath) => {
      this.setState({
        previewImgPath: imgPath
      })
    })
  }

  render() {
    return (
      <div style={this.props.style}>
        <div className="title-icon">
          <Button icon="collections" ripple inverse />
        </div>
        <div className="history-collection">
          <div className="thumbnail-container">
            <img className="add-thumbnail" src={this.state.previewImgPath} alt="" />
          </div>
        </div>
      </div>
    )
  }
}

export default HistoryBar
