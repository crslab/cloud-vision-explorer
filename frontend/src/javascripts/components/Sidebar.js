/*global $*/

import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Tab } from 'react-toolbox/lib/tabs/Tab'
import { Tabs } from 'react-toolbox/lib/tabs/Tabs'
import Drawer from 'react-toolbox/lib/drawer'
import FontIcon from 'react-toolbox/lib/font_icon'
import Button from 'react-toolbox/lib/button'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import 'stylesheets/Sidebar'
import tabStyle from 'react-toolbox/lib/tabs/theme.css'
import PlusTitle from './PlusTitle'
import FaceView from './FaceView'
import Switch from 'react-toolbox/lib/switch'
import InlineSVG from 'react-inlinesvg'
import { gcsGoogleStaticMapsApiKey } from '../config.js'

import { getVisionJsonURL } from '../misc/Util.js'

class SidebarTabs extends Tabs {
  // Copied mainly from the original class, but modified some orders and styles
  constructor() {
    super();
  }
  render () {
    let className = tabStyle.root
    const { headers, contents } = this.parseChildren()
    if(this.props.className) { className += ` ${this.props.className}` }

    return (
      <div id='tabs' data-react-toolbox='tabs' className={className}>
        {this.renderContents(contents)}
        <nav className={tabStyle.navigation} id='navigation' role='tablist' ref={e => { this.navigationNode = e }}>
          {this.renderHeaders(headers)}
        </nav>
        <span className={tabStyle.pointer}
              style={_.omit(this.state.pointer, 'top')} />
      </div>
    )
  }
}

class GraphTab extends Component {
  constructor(props) {
    super(props);
  }

  static get propTypes() {
    return {
      vision: PropTypes.object.isRequired
    }
  }

  render() {
    const { vision } = this.props

    const getDetectionSection = (key, className, label, callback) => {
      return key in vision ?
        <section className={className}>
          <label className="result-caption">{label}</label>
          {callback(vision[key])}
        </section> : ''
    }

    const getColorStyle = (color) => {
      const c = color.color
      return {
        backgroundColor: `rgb(${c.red}, ${c.green}, ${c.blue})`,
        flexGrow: color.score * 100
      }
    }

    return (
      <div className="tab-graph">
        {getDetectionSection('labelAnnotations', 'label-detection', 'LABEL', annons =>
          annons.map((label, idx) =>
            <div key={idx} className="label">
              <div className="label-name">
                {_.capitalize(label.description)}
              </div>
              <div className="label-score">
                <ProgressBar
                  className="label-score-bar" type="linear" mode="determinate"
                  value={_.round(label.score * 100)}
                />
                <div className="label-score-value">
                  {_.round(label.score, 2).toFixed(2)}
                </div>
              </div>
            </div>
          )
        )}
        {getDetectionSection('imagePropertiesAnnotation', 'image-properties', 'COLOR', annon =>
          <ul>
            {_.orderBy(annon.dominantColors.colors, ['score'], ['desc']).map((color, idx) =>
              <li key={idx} style={getColorStyle(color)} />
            )}
          </ul>
        )}
      </div>
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
      vision: {}
    }
  }

  UNSAFE_componentWillMount() {
    // Listening on event
    this.props.emitter.addListener('showSidebar', (id) => {
      this.props.showSidebar()
      this.setState({ vision: {} }) // Clear results
      fetch(getVisionJsonURL(id)).then((res) => {
        return res.json()
      }).then((data) => {
        this.setState({ vision: data[0] }) // assuming an array at the moment
      })
    })

    this.props.emitter.addListener('hideSidebar', () => {
      this.props.hideSidebar()
    })
  }

  componentWillUnmount() {
    this.props.emitter.removeAllListeners()
  }

  render() {
    const { sidebar, changeTab } = this.props
    const classForTab = (index) => {
      return sidebar.tabIndex === index ? 'active' : ''
    }
    const animateScroll = (divid) => {
      const currentScroll = $('.detail-tab > section').prop('scrollTop')
      const el = $(`.${divid}`)
      if (el.length) {
        let targetScroll = el.position().top
        targetScroll += currentScroll
        $('.detail-tab > section').animate({scrollTop: targetScroll}, 'slow')
      }
    }
    const getIndicator = (key, icon, jumpTo, opts) => {
      const active = key in this.state.vision
      return (
        <li
          className={active ? 'active' : ''}
          onClick={animateScroll.bind(this, jumpTo)}
        >
          {opts && opts.customIcon ?
            <Button ripple inverse disabled={!active}>
              <InlineSVG
                className="custom-icon"
                src={require(`../../images/icon/${icon}`)}
              />
            </Button>
          :
            <Button icon={icon} ripple inverse disabled={!active} />
          }
        </li>
      )
    }

    return (
      <Drawer className="sidebar"
              active={sidebar.isActive}
              type="right"
              onOverlayClick={() => { this.props.emitter.emit('hideSidebar') }}>

        <ul className="feature-indicator">
          {getIndicator('labelAnnotations', 'label_outline', 'label-detection')}
          {getIndicator('imagePropertiesAnnotation', 'photo', 'image-properties')}
        </ul>

        <SidebarTabs className="detail-tab"
                     index={sidebar.tabIndex}
                     onChange={changeTab}>
          <Tab label='Graphical' className={classForTab(0)}>
            <GraphTab vision={this.state.vision} />
          </Tab>
          <Tab label='JSON' className={classForTab(1)}>
            <pre>{JSON.stringify(this.state.vision, null, 2)}</pre>
          </Tab>
        </SidebarTabs>
      </Drawer>
    )
  }
}
