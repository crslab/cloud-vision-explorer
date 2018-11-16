import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'react-toolbox/lib/button'
import 'stylesheets/HistoryBar'
import ce from 'javascripts/misc/clickEvents.js'
import { OPEN_IMAGE_BOOKMARK_IDS } from '../misc/Constants.js'
import { gcsBucketName } from '../config.js'

const getThumbUrl = (id) => {
  return `https://storage.googleapis.com/${gcsBucketName}/thumbnail/64x64/${id}.jpg`
}

let defaultImages = OPEN_IMAGE_BOOKMARK_IDS.map(item => ({
  id: item.id,
  mode: "preview",
  previewImgPath: getThumbUrl(item.id),
  histogramData: [],
  ratingsAvg: "Sample"
}))

class HistoryImage extends Component {
  static get propTypes() {
    return {
      emitter: PropTypes.object.isRequired,
      className: PropTypes.string,
      imgPath: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      imgData: PropTypes.object,
      isSelected: PropTypes.bool,
      addImgHandle: PropTypes.func,
      clickImgHandle: PropTypes.func
    }
  }

  imageClick (e) {
    if (this.props.addImgHandle) {
      this.props.addImgHandle(e)
      return
    } else if (this.props.clickImgHandle) {
      this.props.clickImgHandle(this.props.imgData)
    }
  }

  render () {
    return (
      <section className={this.props.className + " history-preview"} onClick={this.imageClick.bind(this)}>
        <div className={`image-preview ${this.props.isSelected ? 'image-highlight' : ' '}`}>
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
        id:"",
        mode: "",
        previewImgPath: "",
        histogramData: [],
        ratingsAvg: 0.0,
        selected: []
      },
      history: [...defaultImages],
        clickCount: 0,
        singleClickTimer: undefined,
    }
  }

  componentDidMount() {
    this.props.emitter.addListener('history-img-ready', (id, previewImgPath, histogramData, mode) => {
      this.setState({
        ...this.state,
        current: {
          ...this.state.current,
          id,
          mode,
          previewImgPath,
          histogramData,
          ratingsAvg: (histogramData.reduce((acc, val) => acc + val)/histogramData.length * 5).toFixed(1) + " \u2605"
        }
      })
    })
    this.props.emitter.addListener('hideSidebar', (imgPath) => {
      this.setState({
        current: {
          id: "",
          mode: "",
          previewImgPath: "",
          histogramData: [...defaultImages],
          ratingsAvg: 0.0,
          selected: []
        }
      })
    })
  }

  componentDidUpdate() {
    console.log('after after' + this.state.clickCount)
  }

  recordCurrentToHistory(e) {
    let history = this.state.history
    history.unshift(this.state.current)
    this.setState({
      history
    })
  }

  resolveClick_deprecated (img) {
    let updatedClickCount = this.state.click.clickCount + 1
    console.log(this.state.click.clickCount) //HAHA
    switch (updatedClickCount) {
      case 1:
        let self = this
        console.log("Single")
        let singleClickTimer = setTimeout(() => {
            self.setState({
              ...self.state,
              click: {
                clickCount: 0,
                singleClickTimer: undefined,
              }
            })
            self.previewImage(img)
        }, 400)
        this.setState({
          ...this.state,
          click: {
            clickCount: updatedClickCount,
            singleClickTimer: singleClickTimer
          }
        })
        return 1
      case 2:
        console.log("Double")
        //clearTimeout(this.state.click.singleClickTimer)
        this.setState({
          ...this.state,
          click: {
            clickCount: 0,
            singleClickTimer: undefined,
          }
        })
        this.selectImage(img)
        return 2
      default:
        return
    }
  }

  resolveClick(item){
    let updatedClickCount = this.state.clickCount + 1
    console.log(updatedClickCount)
    console.log(this.state.clickCount)
    if (updatedClickCount === 1) {
        let self = this
        var singleClickTimer = setTimeout(function() {
            self.setState({
              ...self.state,
                clickCount: 0
            })
            self.previewImage(item);
        }, 400);
        this.setState({
          ...this.state,
            clickCount: 1,
            singleClickTimerOngoing: singleClickTimer
        })
        return
    } else if (updatedClickCount === 2) {
        let self = this
        let timeout = this.state.singleClickTimerOngoing
        console.log("Before",this.state.clickCount)
        this.setState({
            ...this.state,
              singleClickTimerOngoing: undefined,
              clickCount: 0
        }, () => {        console.log("After",self.state.clickCount)
        clearTimeout(timeout);
        self.selectImage(item);
})

    }
    return true
  }

  previewImage(e) {
    if (e.id) {
      this.props.emitter.emit(ce.preview, e.id, true)
    } else {
      this.props.emitter.emit('showSidebar', null)
      this.props.emitter.emit('sidebar-data-ready', e.id, e.previewImgPath, e.histogramData, "interpolate-review")
    }
  }

  selectImage(e) {
    let selectedImages = this.state.current.selected
    selectedImages.unshift(e.id)
    this.setState({
      ...this.state,
      current: {
        ...this.state.current,
        selected: selectedImages
      }
    })
    this.props.emitter.emit(ce.select, e.id, true)
  }

  reset(e) {
    this.props.emitter.emit(ce.resetBtn, true)
  }

  render() {
    return (
      <div style={this.props.style}>
        <div className="title-icon">
          <Button id="render-view__reset-btn" icon="replay" onClick={this.reset.bind(this)} ripple inverse raised accent />
        </div>
        <div className="history-collection">
          {this.state.current.previewImgPath.length > 0 &&
            <HistoryImage imgPath={this.state.current.previewImgPath}
                                   label={this.state.current.ratingsAvg}
                                   icon="save"
                                   addImgHandle={this.recordCurrentToHistory.bind(this)}
                                   emitter={this.props.emitter} />
          }
          {this.state.history.map((img, index) =>
            <HistoryImage key={index}
                          className={this.state.current.mode === "interpolate" ? "disable-click" : ""}
                          imgPath={img.previewImgPath}
                          label={img.ratingsAvg}
                          icon={this.state.current.mode === "interpolate" ? "visibility_off" : img.mode === "preview" ? "filter": "visibility"}
                          imgData={img}
                          isSelected={this.state.current.selected.includes(img.id)}
                          clickImgHandle={this.resolveClick.bind(this)}
                          emitter={this.props.emitter} />
          )}
        </div>
      </div>
    )
  }
}

export default HistoryBar
