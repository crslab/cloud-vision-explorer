import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ce from 'javascripts/misc/clickEvents.js';

import 'stylesheets/InfoLink'

import { OPEN_IMAGE_BOOKMARK_IDS } from '../misc/Constants.js'
import { gcsBucketName } from '../config.js'

const style = {
  h1: {
    color: '#cccccc',
    fontSize: 'x-small',
    marginBottom: 50
  },
  imageBookmarks: {
    ul: {
      listStyleType: 'none',
      color: '#cccccc',
      paddingLeft: '0vh'
    },
    li: {
      cursor: 'pointer',
      marginBottom: '2vh'
    },
    individualThumbnails: {
      width: '4vh',
      height: '4vh',
      marginLeft: '-0.5vh',
      borderRadius: '0.5vh'
    }
  }
}

const getThumbUrl = (id) => {
  return `https://storage.googleapis.com/${gcsBucketName}/thumbnail/64x64/${id}.jpg`
}

export default class InfoLink extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clickCount: 0,
      nPointsChosen: 0,
      singleClickTimer: undefined,
      setOfSelected: new Set()
    }
    let thumbnailSize = document.querySelector("body").clientWidth * 0.02222222222
    this.thumbnailWidth = thumbnailSize
    this.thumbnailHeight = thumbnailSize
    this.FireClick = this.FireClick.bind(this)
    this.singleClick = this.singleClick.bind(this)
    this.doubleClick = this.doubleClick.bind(this)
    //this.setOfSelected = new Set()
  }

  componentDidMount() {
    this.props.emitter.addListener('selectedImg', id => {
      //this.setOfSelected.add(id)
      let temp = this.state.setOfSelected
      temp.add(id)
      this.setState({
        setOfSelected: temp
      })
      console.log(this.state.setOfSelected.values())
    })
    this.props.emitter.addListener('wipeSelected', () => {
      //this.setOfSelected.clear()
      let temp = this.state.setOfSelected
      temp.clear()
      this.setState({
        setOfSelected: temp
      })
    })
  }

  static get propTypes() {
    return {
      emitter: PropTypes.object.isRequired,
      style: PropTypes.object.isRequired
    }
  }

  FireClick(item){
    let updatedClickCount = this.state.clickCount + 1
    if (updatedClickCount === 1) {
        let self = this
        var singleClickTimer = setTimeout(function() {
            self.setState({
              clickCount: 0
            })
            self.singleClick(item);
        }, 400);
        this.setState({
          clickCount: updatedClickCount,
          singleClickTimer: singleClickTimer
        })
    } else if (updatedClickCount === 2) {
        clearTimeout(this.state.singleClickTimer);
        this.setState({
          clickCount: 0
        })
        this.doubleClick(item);
    }
    return true
  }

  singleClick(e) {
    this.props.emitter.emit(ce.preview, e.id, true)
  }

  doubleClick(e) {
    this.props.emitter.emit(ce.select, e.id, true)
  }

  render() {
    const imageBookmarks = _.map(OPEN_IMAGE_BOOKMARK_IDS, (item) => {
      return (
        <li key={item.id} style={style.imageBookmarks.li}
            onClick={e => this.FireClick(item)}>
          <img src={getThumbUrl(item.id)} style={style.imageBookmarks.individualThumbnails} className={(this.state.setOfSelected.has(item.id)) ? 'thumbnailImgHighlight' : 'thumbnailImg'}/>
        </li>
      )
    })

    return (
      <div style={this.props.style}>
        <ul style={style.imageBookmarks.ul}>
          {imageBookmarks}
        </ul>
      </div>
    )
  }
}
