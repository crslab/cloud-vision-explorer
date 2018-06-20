import _ from 'lodash'
import React, { Component } from 'react'
import PropTypes from 'prop-types';

import 'stylesheets/InfoLink'

import { OPEN_IMAGE_BOOKMARK_IDS, ZOOM_CLUSTER_BOOKMARK_IDS } from '../misc/Constants.js'
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
      marginBottom: 10
    }
  },
  zoomBookmarks: {
    ul: {
      marginTop: '50px',
      listStyleType: 'none',
      color: '#cccccc',
      paddingLeft: '0vh'
    },
    li: {
      cursor: 'pointer',
      marginBottom: 10
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
      singleClickTimer: undefined
    }
    this.setOfChosenImgs = new Set();
    this.FireClick = this.FireClick.bind(this)
    this.singleClick = this.singleClick.bind(this)
    this.doubleClick = this.doubleClick.bind(this)
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
    this.props.emitter.emit('zoomToImage', e.id, true)
    console.log(e.id)
    console.log("SINGLE")
    // When in slider mode, only doubleclicks and slider interactions are allowed, thus DISABLE singleClicks.
  }

  doubleClick(e) {
    //this.props.emitter.emit('zoomToImage', e, true)
    console.log(e.id)
    console.log("DOUBLE")

    if ((e.chosenFlag === undefined) || (e.chosenFlag === 0)) {
      if (this.state.nPointsChosen < 2){
        e.chosenFlag = 1
        this.setState({
          nPointsChosen: (this.state.nPointsChosen+1)
        })
        this.setOfChosenImgs.add(e.id)
        setTimeout(() => {
          console.log("Selected: ",e.id)
          console.log("Set now has: ",this.setOfChosenImgs.values())
          console.log("nPoints now at: ",this.state.nPointsChosen)
          if (this.state.nPointsChosen===2){
            let setIter = this.setOfChosenImgs.values()
            let node1 = setIter.next().value
            let node2 = setIter.next().value
            console.log("SLIDER BETWEEN: ", node1, node2)
            this.props.emitter.emit('interpolateNow', node1, node2, false)
            //console.log("SLIDER")
          }
        }, 1)
        
        return true
      }
      else{
        setTimeout(() => {
          console.log("2 points already chosen!")
          console.log("Set now has: ",this.setOfChosenImgs.values())
          console.log("nPoints now at: ",this.state.nPointsChosen)
        }, 1)
        return false
      }
    }
    else{
      e.chosenFlag = 0
      this.setState({
        nPointsChosen: (this.state.nPointsChosen-1)
      })
      this.setOfChosenImgs.delete(e.id)
      setTimeout(() => {
        console.log("Unselected: ",e.id)
        console.log("Set now has: ",this.setOfChosenImgs.values())
        console.log("nPoints now at: ",this.state.nPointsChosen)
      }, 1)
      return false
    }


    //  If e was unselected, 
    //    If number_of_points selected as of this moment is 2, do nothing since we don't want to select a 3rd item.
    //    else, select e, number_of_points++
    //  If e was selected, unselect e, number_of_points--
    //  if number_of_points == 2, fire slider up on screen.
  }



  render() {
    const imageBookmarks = _.map(OPEN_IMAGE_BOOKMARK_IDS, (item) => {
      return (
        <li key={item.id} style={style.imageBookmarks.li}
            onClick={e => this.FireClick(item)}>
          <img src={getThumbUrl(item.id)} className='thumbnailImg' />
        </li>
      )
    })


    const zoomBookmarks = _.map(ZOOM_CLUSTER_BOOKMARK_IDS, (item) => {
      return (
        <li key={item.id} style={style.imageBookmarks.li}
            onClick={() => { this.props.emitter.emit('zoomToImage', item.id) }}>
          <img src={getThumbUrl(item.id)} className='thumbnailImg' />
        </li>
      )
    })

    return (
      <div style={this.props.style}>
        <img className="gcp-logo" src="/images/Vision-API.png" /><br />
        <h1 style={style.h1}>Cloud Vision API<br/>Demo</h1>
        <ul style={style.imageBookmarks.ul}>
          {imageBookmarks}
        </ul>
        <ul style={style.zoomBookmarks.ul}>
          {zoomBookmarks}
        </ul>
      </div>
    )
  }
}
