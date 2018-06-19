import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import 'p5/lib/p5.min.js';
import 'p5/lib/addons/p5.dom.js';
import Visualization from './lib/visualization.js';
import ce from "./common/customEvents.js";

/**
 * `float-view`
 * Takes in list of json. Present as floating object points that contains pop-over information.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class FloatView extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          height: 100%;
          width: 100%;
        }

        canvas {
          visibility: inherit !important;
        }
      </style>
      <div id="[[containerName]]">
      </div>
    `;
  }

  constructor() {
    super();
    this.containerName = "canvas-container_" + Date.now();
  }

  ready() {
    super.ready();
    // Propagate events doesn to the P5 canvas.
    let host = this.root.host;
    let containerDOM = this.root.querySelector(`#${this.containerName}`);
    host.addEventListener(ce.resetCanvas, e => {
      containerDOM.dispatchEvent(ce.resetCanvasObj(null, false, false));
    });
  }

  static get is() {
    return 'float-view';
  }

  static get properties() {
    return {
      imgPathPrefix: String,
      bgColor: String,
      objectArray: Array
    };
  }

  static get observers() {
    return [
      "resourceChanged(imgPathPrefix, objectArray, bgColor)"
    ];
  }

  resourceChanged(imgPathPrefix, objectArray, bgColor) {
    if (!imgPathPrefix || !objectArray) {
      return;
    }
    this._drawVisualization(imgPathPrefix, objectArray, bgColor);
  }

  _drawVisualization(imgPathPrefix, data, bgColor) {
    let containerDOM = this.root.querySelector(`#${this.containerName}`);
    let parentWidth = this.root.host.offsetWidth;
    let parentHeight = this.root.host.offsetHeight;
    if (this._p5) {
      containerDOM.innerHTML = ``;
    }
    this._viz = new Visualization(imgPathPrefix, data, containerDOM, parentWidth, parentHeight, bgColor);
    this._p5 = new p5(this._viz.sketch.bind(this._viz), containerDOM);
  }
}

window.customElements.define(FloatView.is, FloatView);
