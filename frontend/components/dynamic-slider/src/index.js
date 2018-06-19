import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/polymer/lib/elements/dom-if.js';
import {GestureEventListeners} from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import ce from './common/customEvents.js';

/**
 * `dynamic-slider`
 * Renders a slider between any 2 arbitrary points on the screen.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class DynamicSlider extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html `
      <style>
        :host {
          pointer-events: none;
          display: block;
          height: auto;
          width: auto;
          position: absolute;
        }
      </style>
      <template is="dom-if" if="[[__isShowSlider]]" on-dom-change="displayChange">
        <svg id="container"
             width$="[[__width]]"
             height$="[[__height]]"
             style$="[[__containerStyle]]">
          <line id="track"
                x1$="[[__adjustedPts.from.x]]"
                y1$="[[__adjustedPts.from.y]]"
                x2$="[[__adjustedPts.to.x]]"
                y2$="[[__adjustedPts.to.y]]"
                style$="[[__trackStyle]]" />
          <line id="track-overlay"
                x1$="[[__adjustedPts.from.x]]"
                y1$="[[__adjustedPts.from.y]]"
                x2$="[[__adjustedPts.to.x]]"
                y2$="[[__adjustedPts.to.y]]"
                style$="[[__trackOverlayStyle]]"
                on-track="adjustHandle" />
          <circle id="handle-circle"
                  style$="[[__circleHandleStyle]]"
                  r$="[[handleRadius]]"
                  cx$="[[handlePositionX]]"
                  cy$="[[handlePositionY]]"></circle>
          <image id="handle-img"
                 preserveAspectRatio="xMidYMid meet"
                 width$="[[__imgHandleSize.width]]"
                 height$="[[__imgHandleSize.height]]"
                 x$="[[handlePositionX]]"
                 y$="[[handlePositionY]]"
                 style$="[[__imgHandleStyle]]" />
           </svg>
        </svg>
      </template>
      `;
  }

  constructor() {
    super();
    this.handlePositionX = undefined;
    this.handlePositionY = undefined;
    this.parentBoundaries = undefined;
    this.isSliderShown = false;
  }

  displayChange(e) {
    if (!this.__isShowSlider) {
      this.isSliderShown = false;
      return;
    }
    this.isSliderShown = true;
    // Update the objective location offset for this element.
    this.parentBoundaries = this.shadowRoot.querySelector("#container").getBoundingClientRect();
    // Update the current handle position
    this.setDefaultHandlePosition(this.val, this.__adjustedPts, this.handleRadius);
    // Find the image handle, if is available, then set the image for it.
    let imageHandle = this.shadowRoot.querySelectorAll(`#handle-img:not([style*="display:none"]):not([style*="display: none"])`)[0];
    if (imageHandle && this.imgHandle) {
      imageHandle.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.imgHandle);
    }
  }

  adjustHandle(e) {
    if (!this.parentBoundaries) {
      return;
    }
    let localX = e.detail.x - this.parentBoundaries.left;
    let localY = e.detail.y - this.parentBoundaries.top;
    // Use the simplified expression for getting the intersecting line's point intersection
    // between localX/Y and the slider line to find out where to place the handle on the
    // slider. Clamp the values with the given x_min and x_max values.
    this.handlePositionX = (localX < this.__lineParam.x_min)
      ? this.__lineParam.x_min
      : (localX > this.__lineParam.x_max)
        ? this.__lineParam.x_max
        : (localX + (this.__lineParam.m * (localY - this.__lineParam.b))) / (this.__lineParam.m**2 + 1);
    this.handlePositionY = (this.__lineParam.m * this.handlePositionX) + this.__lineParam.b;
    // Calculate the proportion between the current handle position and slider's length.
    let currentDistance = this.calculateDistance(this.__adjustedPts.from.x,
                                                 this.__adjustedPts.from.y,
                                                 this.handlePositionX,
                                                 this.handlePositionY);
    // If an image handle is being used, offset the position to the image center
    if (this.imgHandle) {
      this.handlePositionX -= this.handleRadius;
      this.handlePositionY -= this.handleRadius;
    }
    let data = {
      proportion: currentDistance / this.__length
    };
    switch(e.detail.state) {
      case "start":
        this.shadowRoot.querySelector("#container").dispatchEvent(ce.sliderStartObj(data));
        break;
      case "track":
        this.shadowRoot.querySelector("#container").dispatchEvent(ce.sliderMoveObj(data));
        break;
      case "end":
        this.shadowRoot.querySelector("#container").dispatchEvent(ce.sliderStopObj(data));
        break;
    }
  }

  static get is() {
    return 'dynamic-slider';
  }

  static get properties() {
    return {
      lineThickness: {
        type: Number,
        value: 2
      },
      lineColor: {
        type: String,
        value: "black"
      },
      handleRadius: {
        type: Number,
        value: 8
      },
      handleColor: {
        type: String,
        value: "black"
      },
      x1: Number,
      y1: Number,
      x2: Number,
      y2: Number,
      val: Number,
      imgHandle: {
        type: String,
        value: ""
      },
      __overlayThickness: {
        type: Number,
        computed: "computeOverlayThickness(lineThickness)"
      },
      __pt1: {
        type: Object,
        computed: "computePoint(x1, y1)"
      },
      __pt2: {
        type: Object,
        computed: "computePoint(x2, y2)"
      },
      __isShowSlider: {
        type: Boolean,
        computed: "computeIsShowSlider(__pt1, __pt2)"
      },
      __drawStartPt: {
        type: Object,
        computed: "computeDrawStartPoint(__isShowSlider, handleRadius, __pt1, __pt2)"
      },
      __adjustedPts: {
        type: Object,
        computed: "computeAdjustedPoints(__isShowSlider, handleRadius, __pt1, __pt2)"
      },
      __length: {
        type: Number,
        computed: "computeDistance(__adjustedPts)"
      },
      __lineParam: {
        type: Object,
        computed: "computeLineParam(__adjustedPts)"
      },
      __width: {
        type: Number,
        computed: "computeWidth(__isShowSlider, handleRadius, __pt1, __pt2)"
      },
      __height: {
        type: Number,
        computed: "computeHeight(__isShowSlider, handleRadius, __pt1, __pt2)"
      },
      __containerStyle: {
        type: String,
        computed: "computeContainerStyle(__drawStartPt)"
      },
      __trackStyle: {
        type: String,
        computed: "computeTrackStyle(lineThickness, lineColor)"
      },
      __trackOverlayStyle: {
        type: String,
        computed: "computeTrackOverlayStyle(__overlayThickness)"
      },
      __circleHandleStyle: {
        type: String,
        computed: "computeCircleHandleStyle(imgHandle, handleColor)"
      },
      __imgHandleStyle: {
        type: String,
        computed: "computeImageHandleStyle(imgHandle)"
      },
      __imgHandleSize: {
        type: Object,
        computed: "computeImageHandleSize(handleRadius)"
      }
    };
  }

  static get observers() {
    return [
      "setDefaultHandlePosition(val, __adjustedPts, handleRadius)"
    ];
  }

  computeOverlayThickness(lineThickness) {
    return lineThickness * 6;
  }

  computePoint(x, y) {
    return (x !== undefined && y !== undefined && !Number.isNaN(x) && !Number.isNaN(y))
      ? { x, y }
      : undefined;
  }

  computeIsShowSlider(__pt1, __pt2) {
    return __pt1 !== undefined && __pt2 !== undefined;
  }

  computeDrawStartPoint(__isShowSlider, handleRadius, __pt1, __pt2) {
    return (__isShowSlider)
      ? {
        x: ((__pt2.x <= __pt1.x) ? __pt2.x : __pt1.x) - handleRadius,
        y: ((__pt2.y <= __pt1.y) ? __pt2.y : __pt1.y) - handleRadius
      }
      : undefined;
  }

  computeAdjustedPoints(__isShowSlider, handleRadius, __pt1, __pt2) {
    if (!__isShowSlider) {
      return;
    }
    let xOffset = (__pt1.x <= __pt2.x) ? __pt1.x : __pt2.x;
    let yOffset = (__pt1.y <= __pt2.y) ? __pt1.y : __pt2.y;
    let x1 = (__pt1.x - xOffset) + handleRadius;
    let y1 = (__pt1.y - yOffset) + handleRadius;
    let x2 = (__pt2.x - xOffset) + handleRadius;
    let y2 = (__pt2.y - yOffset) + handleRadius;
    return {
      from: { x: x1, y: y1 },
      to: { x: x2, y: y2 }
    };
  }

  computeDistance(__adjustedPts) {
    if (!__adjustedPts) {
      return;
    }
    return this.calculateDistance(__adjustedPts.from.x, __adjustedPts.from.y, __adjustedPts.to.x, __adjustedPts.to.y);
  }

  computeLineParam(__adjustedPts) {
    if (!__adjustedPts) {
      return;
    }
    let m = (__adjustedPts.to.y - __adjustedPts.from.y) / (__adjustedPts.to.x - __adjustedPts.from.x);
    let b = __adjustedPts.to.y - (m * __adjustedPts.to.x);
    let bSanityCheck = __adjustedPts.from.y - (m * __adjustedPts.from.x);
    let compareSensitivity = 1e-6;
    let sanityCheckDiff = Math.abs(b - bSanityCheck);
    if (sanityCheckDiff > compareSensitivity) {
      throw `Something went wrong while extrapolating linear parameters from dynamic slider.\nPoints: from (${__adjustedPts.from.x}, ${__adjustedPts.from.y}) to (${__adjustedPts.to.x}, ${__adjustedPts.to.y}).\nSanity check diff: ${sanityCheckDiff}, sensitivity: ${compareSensitivity}.`;
    }
    let x_min = __adjustedPts.from.x;
    let x_max = __adjustedPts.to.x;
    if (__adjustedPts.to.x < __adjustedPts.from.x) {
      x_min = __adjustedPts.to.x;
      x_max = __adjustedPts.from.x;
    }
    return { m, b, x_min, x_max };
  }

  computeWidth(__isShowSlider, handleRadius, __pt1, __pt2) {
    return (__isShowSlider)
      ? Math.abs(__pt1.x - __pt2.x) + (2 * handleRadius)
      : undefined;
  }

  computeHeight(__isShowSlider, handleRadius, __pt1, __pt2) {
    return (__isShowSlider)
      ? Math.abs(__pt1.y - __pt2.y) + (2 * handleRadius)
      : undefined;
  }

  computeContainerStyle(__drawStartPt) {
    return (__drawStartPt)
    ? `
      pointer-events: none;
      transform: translate(${__drawStartPt.x}px, ${__drawStartPt.y}px);
    `
    : undefined;
  }

  computeTrackStyle(lineThickness, lineColor) {
    return `
      pointer-events: none;
      stroke: ${lineColor};
      stroke-width: ${lineThickness}px;
      stroke-linecap: round;
    `;
  }

  computeTrackOverlayStyle(__overlayThickness) {
    return `
      pointer-events: stroke;
      cursor: pointer;
      stroke-width: ${__overlayThickness}px;
      stroke-linecap: round;

    `;
  }

  computeCircleHandleStyle(imgHandle, handleColor) {
    let style = `
      fill: ${handleColor};
    `;
    style += (!imgHandle) ? `` : `display: none;`;
    return style;
  }

  computeImageHandleStyle(imgHandle) {
    let style = ``;
    style += (!imgHandle) ? `display: none;` : ``;
    return style;
  }

  computeImageHandleSize(handleRadius) {
    return {
      width: 2 * handleRadius,
      height: 2 * handleRadius
    };
  }

  setDefaultHandlePosition(val, __adjustedPts, handleRadius) {
    // If the reference points do not exist, do nothing.
    if (!__adjustedPts || !this.isSliderShown) {
      return;
    }
    if (val !== undefined && !Number.isNaN(val) && val >= 0 && val <= 1) {
      // If user provided an input value and that value is in a valid range (0 - 1),
      // set the handle to that value. When handle position change, emit an event
      // to notify the change.
      this.handlePositionX = __adjustedPts.from.x + (val * (__adjustedPts.to.x - __adjustedPts.from.x));
      this.handlePositionY = __adjustedPts.from.y + (val * (__adjustedPts.to.y - __adjustedPts.from.y));
      this.shadowRoot.querySelector("#container").dispatchEvent(ce.sliderMoveObj({ proportion: val }));
    } else {
      // Assign default location of the handlers to be the starting point
      this.handlePositionX = this.handlePositionX || __adjustedPts.from.x;
      this.handlePositionY = this.handlePositionY || __adjustedPts.from.y;
    }
    // If an image handle is being used, offset the position to the image center
    if (this.imgHandle) {
      this.handlePositionX -= handleRadius;
      this.handlePositionY -= handleRadius;
    }
  }

  calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
  }
}

window.customElements.define(DynamicSlider.is, DynamicSlider);
