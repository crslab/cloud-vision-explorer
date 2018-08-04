import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Button from 'react-toolbox/lib/button'
import 'stylesheets/HistoryBar'


class HistoryImg extends Component {
  static get propTypes() {
    return {
      imgPath: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    }
  }

  render () {
    return (
      <section className="history-preview">
        <div className="btn-overlay" />
        <div className="btn-icon">
          <i className="material-icons">{this.props.icon}</i>
        </div>
        <img className="thumbnail" src={this.props.imgPath} alt="" />
        <br />
        <div>{this.props.label}</div>
      </section>
    )
  }
}

class HistoryImgCollection extends Component {
  static get propTypes() {
    return {
      images: PropTypes.array.isRequired,
      icon: PropTypes.string.isRequired,
      itemClickHandle: PropTypes.func.isRequired
    }
  }

  render () {
    return (
      <div className="btn-wrapper">
        {
          this.props.images.map((img, index) =>
            <div key={index} className="btn-wrapper" onClick={this.props.itemClickHandle.bind(this, img)}>
              <HistoryImg imgPath={img.previewImgPath} label={img.ratingsAvg} icon={this.props.icon} />
            </div>
          )
        }
      </div>
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
    this.recordCurrentToHistory = this.recordCurrentToHistory.bind(this)
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

  componentDidUpdate() {
    console.log(this.state.history)
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
            <div className="btn-wrapper" onClick={this.recordCurrentToHistory}>
              <HistoryImg imgPath={this.state.current.previewImgPath} label={this.state.current.ratingsAvg} icon="save" />
            </div>
          }
          <HistoryImgCollection images={this.state.history} icon="visibility" itemClickHandle={this.previewImage} />
        </div>
      </div>
    )
  }
}

export default HistoryBar
