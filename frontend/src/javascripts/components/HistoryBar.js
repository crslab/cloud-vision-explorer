import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Button from 'react-toolbox/lib/button'
import 'stylesheets/HistoryBar'

class HistoryImage extends Component {
  static get propTypes() {
    return {
      imgPath: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      itemClickHandle: PropTypes.func.isRequired
    }
  }

  render () {
    return (
      <section className="history-preview" onClick={this.props.itemClickHandle}>
        <div className="image-preview">
          <div className="btn-overlay" />
          <div className="btn-icon">
            <i className="material-icons">{this.props.icon}</i>
          </div>
          <img className="thumbnail" src={this.props.imgPath} alt="" />
        </div>
        <div className="label-preview">{this.props.label}</div>
      </section>
    )
  }
}

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
      current: {
        previewImgPath: "",
        histogramData: [],
        ratingsAvg: 0.0
      },
      history: []
    }
  }

  componentDidMount() {
    this.props.emitter.addListener('history-img-ready', (previewImgPath, histogramData) => {
      this.setState({
        current: {
          previewImgPath,
          histogramData,
          ratingsAvg: (histogramData.reduce((acc, val) => acc + val)/histogramData.length * 5).toFixed(1) + " \u2605"
        }
      })
    })
    this.props.emitter.addListener('hideSidebar', (imgPath) => {
      this.setState({
        current: {
          previewImgPath: "",
          histogramData: [],
          ratingsAvg: 0.0
        }
      })
    })
  }

  recordCurrentToHistory(e) {
    let history = this.state.history
    history.unshift(this.state.current)
    this.setState({
      history
    })
  }

  previewImage(e) {
    console.log(e)
  }

  render() {
    return (
      <div style={this.props.style}>
        <div className="title-icon">
          <Button icon="collections" ripple inverse />
        </div>
        <div className="history-collection">
          {this.state.current.previewImgPath.length > 0 &&
            <HistoryImage imgPath={this.state.current.previewImgPath}
                                   label={this.state.current.ratingsAvg}
                                   icon="save"
                                   itemClickHandle={this.recordCurrentToHistory.bind(this)} />
          }
          {this.state.history.map((img, index) =>
            <HistoryImage key={index}
                                   imgPath={img.previewImgPath}
                                   label={img.ratingsAvg}
                                   icon="visibility"
                                   itemClickHandle={this.previewImage.bind(this, img)} />
          )}
        </div>
      </div>
    )
  }
}

export default HistoryBar
