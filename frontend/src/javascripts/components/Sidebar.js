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

class ImgPreview extends Component {
  static get propTypes() {
    return {
      previewImgPath: PropTypes.string.isRequired,
    }
  }

  render () {
    return (
      <section className="image-preivew">
        <label className="result-caption">PREVIEW</label>
        <img className="preview-thumbnail" src={this.props.previewImgPath} alt="" />
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
            {idx < 5 &&
              <div className="label-name">
                {_.capitalize(label.description)} - {_.round(label.score, 2).toFixed(2)}
              </div>
            }
            {idx < 5 &&
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
      activeTabs: {
        preview: true,
        label: false,
        image: false,
        histogram: false
      },
      labelAnnotations: [],
      imagePropertiesAnnotation: {},
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
      // Clear results
      this.setState({
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
    })
    this.props.emitter.addListener('sidebar-data-ready', (previewImgPath, histogramData) => {
      this.setState({
        previewImgPath: previewImgPath,
        histogramData: histogramData
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
    if (labelAnnotationsTab && imagePropertiesTab && labelAnnotations && imageProperties) {
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
              active={sidebar.isActive}
              type="right"
              onOverlayClick={() => { this.props.emitter.emit('hideSidebar') }}>

        {/* Section boomark tabs */}
        <ul className="feature-indicator">
          {/* Img Preview tab */}
          <li id={this.imgPreviewTabId} className={this.state.activeTabs.preview ? 'active' : ''}>
              <Button icon="photo" ripple inverse />
          </li>
          {/* Label Annotations tab */}
          <li id={this.labelAnnotationsTabId} className={this.state.activeTabs.label ? 'active' : ''}>
              <Button icon="label" ripple inverse />
          </li>
          {/* Image Annotations tab tab */}
          <li id={this.imagePropertiesAnnotationTabId} className={this.state.activeTabs.image ? 'active' : ''}>
              <Button icon="color_lens" ripple inverse />
          </li>
          {/* Histogram tab */}
          <li id={this.histogramTabId} className={this.state.activeTabs.histogram ? 'active' : ''}>
              <Button icon="bar_chart" ripple inverse />
          </li>
        </ul>

        {/* Components */}
        <div className="sidebar__content-container">
          <div id={this.imgPreviewId} className="sidebar-content">
            <ImgPreview previewImgPath={this.state.previewImgPath} />
          </div>
          <div id={this.labelAnnotationsId} className="sidebar-content">
            <LabelAnnotations labelAnnotations={this.state.labelAnnotations} />
          </div>
          <div id={this.imagePropertiesAnnotationId} className="sidebar-content">
            <ImageProperties imagePropertiesAnnotation={this.state.imagePropertiesAnnotation} />
          </div>
          {/* Histogram */}
          <div id={this.histogramId} className="sidebar-content">
            {/* <RatingsHist arr={[0.9, 0.7, 0.3, 0.9, 0.9, 0.7, 0.3, 0.9]}/> */}
            <RatingsHist arr={this.state.histogramData || [0,0]} />
          </div>
        </div>

      </Drawer>
    )
  }
}
