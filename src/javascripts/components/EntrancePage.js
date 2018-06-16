import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Ripple from 'react-toolbox/lib/ripple'
import 'stylesheets/EntrancePage'
import { ReactiveLogo } from './ReactiveLogo'
import BrowserChecker from './BrowserChecker'

export default class EntrancePage extends Component {
  render() {
    const RippleLink = Ripple()(props =>
      <Link {...props}>{props.children}</Link>
    )
    return (
      <div className="entrance">
        <div className="poweredby">
          <img className="gcp-logo" src="/images/Vision-API.png" /><br />
          <h1>Cloud Vision API<br/>Demo</h1>
        </div>
        <div>
          <RippleLink className="launch-button" to="/galaxy">LAUNCH</RippleLink>
          <nav>
            <ul>
              <li><a href="https://cloud.google.com/blog/big-data/2016/05/explore-the-galaxy-of-images-with-cloud-vision-api" >What&apos;s this?</a></li>
              <li><a href="https://github.com/reactiveai/cloud-vision-explorer" >GitHub repo</a></li>
            </ul>
          </nav>
        </div>
        <ReactiveLogo />
      </div>
    )
  }
}
