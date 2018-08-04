import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Button from 'react-toolbox/lib/button'
import 'stylesheets/HistoryBar'


class AddImgToHistory extends Component {
  static get propTypes() {
    return {
      imgPath: PropTypes.string.isRequired,
    }
  }

  render () {
    return (
      <section className="history-preview">
        <div className="save-btn-overlay" />
        <div className="save-btn-icon">
          <i className="material-icons">save</i>
        </div>
        <img className="thumbnail" src={this.props.imgPath} alt="" />
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
      previewImgPath: "",
      history: []
    }
  }

  componentDidMount() {
    this.props.emitter.addListener('history-img-ready', (imgPath) => {
      this.setState({
        previewImgPath: imgPath
      })
    })
    this.props.emitter.addListener('hideSidebar', (imgPath) => {
      this.setState({
        previewImgPath: ""
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
          {this.state.previewImgPath.length > 0 &&
            <AddImgToHistory imgPath={this.state.previewImgPath} onClick={e => {console.log("CLICK")}} />
          }
        </div>
      </div>
    )
  }
}

export default HistoryBar
