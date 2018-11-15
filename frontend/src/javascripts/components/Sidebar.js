/*global $*/

import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Drawer from 'react-toolbox/lib/drawer'
import Button from 'react-toolbox/lib/button'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import 'stylesheets/Sidebar'
import { gcsGoogleStaticMapsApiKey } from '../config.js'
import { getVisionJsonURL } from '../misc/Util.js'
import RatingsHist from './RatingsHist/RatingsHist.js';
import ce from 'javascripts/misc/clickEvents.js';

class ImgPreview extends Component {
  static get propTypes() {
    return {
      previewImgPath: PropTypes.string.isRequired,
      emitter: PropTypes.object.isRequired,
      currentId: PropTypes.string.isRequired,
      lastZoomId: PropTypes.string.isRequired,
      zoomEnable: PropTypes.bool.isRequired
    }
  }

  render () {
    return (
      <section className="image-preivew">
        <label className="result-caption">PREVIEW</label>
        <img className="preview-thumbnail" src={this.props.previewImgPath} alt="" />
        {this.props.zoomEnable &&
            <Button id="zoom-btn" className="preview-button" label="zoom to image" raised primary onClick={e => {
              if( !(this.props.lastZoomId === this.props.currentId) ){
                this.props.emitter.emit(ce.preview, this.props.currentId, true)
              }
            }}/>
        }
      </section>
    )
  }
}

class LabelAnnotations extends Component {
  static get propTypes() {
    return {
      labelAnnotations: PropTypes.array.isRequired,
    }
  }

  render() {
    return (
      <section className="label-detection">
        <label className="result-caption">LABEL</label>
        {(this.props.labelAnnotations || []).map((label, idx) =>
          <div key={idx} className="label">
            {idx < 3 &&
              <div className="label-name">
                {_.capitalize(label.description)} - {_.round(label.score, 2).toFixed(2)}
              </div>
            }
            {idx < 3 &&
              <div className="label-score">
                <ProgressBar
                  className="label-score-bar" type="linear" mode="determinate"
                  value={_.round(label.score * 100)}
                />
              </div>
            }
          </div>
        )}
      </section>
    )
  }
}

class ImageProperties extends Component {
  static get propTypes() {
    return {
      imagePropertiesAnnotation: PropTypes.object.isRequired,
    }
  }

  getColorStyle(color) {
    return {
      backgroundColor: `rgb(${color.color.red}, ${color.color.green}, ${color.color.blue})`,
      flexGrow: color.score * 100
    }
  }

  render() {
    return (
      <section className="image-properties">
        <label className="result-caption">COLOR</label>
        <ul>
          {_.orderBy(((this.props.imagePropertiesAnnotation || {}).dominantColors || {}).colors, ['score'], ['desc']).map((color, idx) =>
            <li key={idx} style={this.getColorStyle(color)} />
          )}
        </ul>
      </section>
    )
  }
}

export default class Sidebar extends Component {
  static get propTypes() {
    return {
      sidebar: PropTypes.object.isRequired,
      showSidebar: PropTypes.func.isRequired,
      hideSidebar: PropTypes.func.isRequired,
      toggleHighlightFaceLandmarks: PropTypes.func.isRequired,
      changeTab: PropTypes.func.isRequired,
      emitter: PropTypes.object.isRequired
    }
  }

  constructor(props, context) {
    super(props, context)
    this.state = {
      mode: 'preview',
      activeTabs: {
        preview: true,
        label: false,
        image: false,
        histogram: false
      },
      labelAnnotations: [],
      imagePropertiesAnnotation: {},
      id: "",
      lastZoomId: "",
      previewImgPath: "",
      histogramData: []
    }

    this.imgPreviewTabId =  "sidebar__tab-img-preview"
    this.labelAnnotationsTabId = "sidebar__tab-label-annotations"
    this.imagePropertiesAnnotationTabId = "sidebar__tab-image-properties"
    this.histogramTabId = "sidebar__tab-histogram"
    this.imgPreviewId =  "sidebar__img-preview"
    this.labelAnnotationsId = "sidebar__label-annotations"
    this.imagePropertiesAnnotationId = "sidebar__image-properties"
    this.histogramId = "sidebar__histogram"

    this.tabChange = this.tabChange.bind(this)
  }

    componentDidMount() {
      this.props.emitter.addListener('showSidebar', (id) => {
        // Call callback
        this.props.showSidebar()
        // Simply show the sudebar without anything special if no id is provided
        if (id === null || id === undefined) {
          return;
        }
        // Clear results
        this.setState({
          id,
          labelAnnotations: [],
          imagePropertiesAnnotation: {}
        })
        // Update the state
        fetch(getVisionJsonURL(id))
          .then((res) => res.json())
          .then(data => {
            this.setState({
              labelAnnotations: data[0].labelAnnotations,
              imagePropertiesAnnotation: data[0].imagePropertiesAnnotation
            })
          })
      })
    this.props.emitter.addListener('hideSidebar', () => {
      this.props.hideSidebar()
      this.setState({
        id: "",
        lastZoomId: "",
        labelAnnotations: [],
        imagePropertiesAnnotation: {},
        previewImgPath: "",
        histogramData: []
      })
    })
    this.props.emitter.addListener('sidebar-data-ready', (id, previewImgPath, histogramData, mode) => {
      this.props.emitter.emit('history-img-ready', id, previewImgPath, histogramData, mode)
      this.setState({
        previewImgPath: previewImgPath,
        histogramData: histogramData,
        mode: mode
      })
    })
    this.props.emitter.addListener('update-lastZoomId', (id) => {
      this.setState({
        lastZoomId: id,
      })
    })
  }

  componentDidUpdate(prevProps) {
    let imgPreviewTab = document.getElementById(this.imgPreviewTabId)
    let labelAnnotationsTab = document.getElementById(this.labelAnnotationsTabId)
    let imagePropertiesTab = document.getElementById(this.imagePropertiesAnnotationTabId)
    let histogramTab = document.getElementById(this.histogramTabId)
    let imgPreview = document.getElementById(this.imgPreviewId)
    let labelAnnotations = document.getElementById(this.labelAnnotationsId)
    let imageProperties = document.getElementById(this.imagePropertiesAnnotationId)
    let histogram = document.getElementById(this.histogramId)
    if (labelAnnotations && imageProperties && ((this.state.mode === 'preview') && (labelAnnotationsTab && imagePropertiesTab))) {
      imgPreviewTab.addEventListener("click", e => {
        this.tabChange("preview", imgPreview)
      })
      labelAnnotationsTab.addEventListener("click", e => {
        this.tabChange("label", labelAnnotations)
      })
      imagePropertiesTab.addEventListener("click", e => {
        this.tabChange("image", imageProperties)
      })
      histogramTab.addEventListener("click", e => {
        this.tabChange("histogram", histogram)
      })
    }
  }

  componentWillUnmount() {
    this.props.emitter.removeAllListeners()
    this.setState({
        labelAnnotations: [],
        imagePropertiesAnnotation: {},
        previewImgPath: "",
        histogramData: []
    })
  }

  tabChange(activeTabName, selectedElement) {
    let currentActiveTabs = this.state.activeTabs
    for (let key of Object.keys(currentActiveTabs)) {
      currentActiveTabs[key] = (key === activeTabName) ? true : false
    }
    this.setState({
      activeTabs: currentActiveTabs
    })
    selectedElement.scrollIntoView({
      behavior: "smooth"
    })
  }

  render() {
    const { sidebar, changeTab } = this.props
    return (
      <Drawer className="sidebar"
              theme={{ wrapper: 'wrapper' }}
              active={sidebar.isActive}
              type="right"
              onOverlayClick={() => { this.props.emitter.emit('hideSidebar') }}>

        {/* Section boomark tabs */}
        <div className="feature-indicator">
          {/* Img Preview tab */}
          <div id={this.imgPreviewTabId} className={this.state.activeTabs.preview ? 'item active' : 'item'}>
              <Button icon="photo" ripple inverse />
          </div>
          {/* Histogram tab */}
          <div id={this.histogramTabId} className={this.state.activeTabs.histogram ? 'item active' : 'item'}>
              <Button icon="bar_chart" ripple inverse />
          </div>
          {this.state.mode === 'preview' &&
            <div id={this.labelAnnotationsTabId} className={this.state.activeTabs.label ? 'item active' : 'item'}>
                <Button icon="label" ripple inverse />
            </div>
          }
          {this.state.mode === 'preview' &&
            <div id={this.imagePropertiesAnnotationTabId} className={this.state.activeTabs.image ? 'item active' : 'item'}>
                <Button icon="color_lens" ripple inverse />
            </div>
          }
        </div>

        {/* Components */}
        <div className="sidebar__content-container">
          <div id={this.imgPreviewId} className="sidebar-content">
            <ImgPreview emitter={this.props.emitter} zoomEnable={this.state.mode === 'preview'} currentId={this.state.id} lastZoomId={this.state.lastZoomId} previewImgPath={this.state.previewImgPath} />
          </div>

          {/* Histogram */}
          <div id={this.histogramId} className="sidebar-content">
            {/* <RatingsHist arr={[0.9, 0.7, 0.3, 0.9, 0.9, 0.7, 0.3, 0.9]}/> */}
            <RatingsHist arr={this.state.histogramData || []} />
          </div>
          {this.state.mode === 'preview' &&
            <div id={this.labelAnnotationsId} className="sidebar-content">
              <LabelAnnotations labelAnnotations={this.state.labelAnnotations} />
            </div>
          }
          {this.state.mode === 'preview' &&
            <div id={this.imagePropertiesAnnotationId} className="sidebar-content">
              <ImageProperties imagePropertiesAnnotation={this.state.imagePropertiesAnnotation} />
            </div>
          }
        </div>

      </Drawer>
    )
  }
}
