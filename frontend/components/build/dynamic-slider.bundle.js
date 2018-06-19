(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["dynamic-slider"],{

/***/ "./dynamic-slider/src/common/customEvents.js":
/*!***************************************************!*\
  !*** ./dynamic-slider/src/common/customEvents.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = __webpack_require__(/*! babel-runtime/core-js/object/assign */ "./dynamic-slider/node_modules/babel-runtime/core-js/object/assign.js");

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./dynamic-slider/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./dynamic-slider/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CustomEventsCollection = function () {
  function CustomEventsCollection() {
    (0, _classCallCheck3.default)(this, CustomEventsCollection);
  }

  (0, _createClass3.default)(CustomEventsCollection, null, [{
    key: "sliderStartObj",
    value: function sliderStartObj() {
      var dataJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var params = (0, _assign2.default)({}, this.defaultParams, { "detail": dataJSON });
      return new CustomEvent(this.sliderStart, params);
    }
  }, {
    key: "sliderMoveObj",
    value: function sliderMoveObj() {
      var dataJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var params = (0, _assign2.default)({}, this.defaultParams, { "detail": dataJSON });
      return new CustomEvent(this.sliderMove, params);
    }
  }, {
    key: "sliderStopObj",
    value: function sliderStopObj() {
      var dataJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var params = (0, _assign2.default)({}, this.defaultParams, { "detail": dataJSON });
      return new CustomEvent(this.sliderStop, params);
    }
  }, {
    key: "sliderStart",
    get: function get() {
      return "slider-start";
    }
  }, {
    key: "sliderMove",
    get: function get() {
      return "slider-move";
    }
  }, {
    key: "sliderStop",
    get: function get() {
      return "slider-stop";
    }
  }, {
    key: "defaultParams",
    get: function get() {
      return { bubbles: true, composed: true };
    }
  }]);
  return CustomEventsCollection;
}();

exports.default = CustomEventsCollection;

/***/ }),

/***/ "./dynamic-slider/src/index.js":
/*!*************************************!*\
  !*** ./dynamic-slider/src/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _isNan = __webpack_require__(/*! babel-runtime/core-js/number/is-nan */ "./dynamic-slider/node_modules/babel-runtime/core-js/number/is-nan.js");

var _isNan2 = _interopRequireDefault(_isNan);

var _getPrototypeOf = __webpack_require__(/*! babel-runtime/core-js/object/get-prototype-of */ "./dynamic-slider/node_modules/babel-runtime/core-js/object/get-prototype-of.js");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _taggedTemplateLiteral2 = __webpack_require__(/*! babel-runtime/helpers/taggedTemplateLiteral */ "./dynamic-slider/node_modules/babel-runtime/helpers/taggedTemplateLiteral.js");

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./dynamic-slider/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./dynamic-slider/node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./dynamic-slider/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./dynamic-slider/node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n      <style>\n        :host {\n          pointer-events: none;\n          display: block;\n          height: auto;\n          width: auto;\n          position: absolute;\n        }\n      </style>\n      <template is="dom-if" if="[[__isShowSlider]]" on-dom-change="displayChange">\n        <svg id="container"\n             width$="[[__width]]"\n             height$="[[__height]]"\n             style$="[[__containerStyle]]">\n          <line id="track"\n                x1$="[[__adjustedPts.from.x]]"\n                y1$="[[__adjustedPts.from.y]]"\n                x2$="[[__adjustedPts.to.x]]"\n                y2$="[[__adjustedPts.to.y]]"\n                style$="[[__trackStyle]]" />\n          <line id="track-overlay"\n                x1$="[[__adjustedPts.from.x]]"\n                y1$="[[__adjustedPts.from.y]]"\n                x2$="[[__adjustedPts.to.x]]"\n                y2$="[[__adjustedPts.to.y]]"\n                style$="[[__trackOverlayStyle]]"\n                on-track="adjustHandle" />\n          <circle id="handle-circle"\n                  style$="[[__circleHandleStyle]]"\n                  r$="[[handleRadius]]"\n                  cx$="[[handlePositionX]]"\n                  cy$="[[handlePositionY]]"></circle>\n          <image id="handle-img"\n                 preserveAspectRatio="xMidYMid meet"\n                 width$="[[__imgHandleSize.width]]"\n                 height$="[[__imgHandleSize.height]]"\n                 x$="[[handlePositionX]]"\n                 y$="[[handlePositionY]]"\n                 style$="[[__imgHandleStyle]]" />\n           </svg>\n        </svg>\n      </template>\n      '], ['\n      <style>\n        :host {\n          pointer-events: none;\n          display: block;\n          height: auto;\n          width: auto;\n          position: absolute;\n        }\n      </style>\n      <template is="dom-if" if="[[__isShowSlider]]" on-dom-change="displayChange">\n        <svg id="container"\n             width$="[[__width]]"\n             height$="[[__height]]"\n             style$="[[__containerStyle]]">\n          <line id="track"\n                x1$="[[__adjustedPts.from.x]]"\n                y1$="[[__adjustedPts.from.y]]"\n                x2$="[[__adjustedPts.to.x]]"\n                y2$="[[__adjustedPts.to.y]]"\n                style$="[[__trackStyle]]" />\n          <line id="track-overlay"\n                x1$="[[__adjustedPts.from.x]]"\n                y1$="[[__adjustedPts.from.y]]"\n                x2$="[[__adjustedPts.to.x]]"\n                y2$="[[__adjustedPts.to.y]]"\n                style$="[[__trackOverlayStyle]]"\n                on-track="adjustHandle" />\n          <circle id="handle-circle"\n                  style$="[[__circleHandleStyle]]"\n                  r$="[[handleRadius]]"\n                  cx$="[[handlePositionX]]"\n                  cy$="[[handlePositionY]]"></circle>\n          <image id="handle-img"\n                 preserveAspectRatio="xMidYMid meet"\n                 width$="[[__imgHandleSize.width]]"\n                 height$="[[__imgHandleSize.height]]"\n                 x$="[[handlePositionX]]"\n                 y$="[[handlePositionY]]"\n                 style$="[[__imgHandleStyle]]" />\n           </svg>\n        </svg>\n      </template>\n      ']);

var _polymerElement = __webpack_require__(/*! @polymer/polymer/polymer-element.js */ "./dynamic-slider/node_modules/@polymer/polymer/polymer-element.js");

var _htmlTag = __webpack_require__(/*! @polymer/polymer/lib/utils/html-tag.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/html-tag.js");

__webpack_require__(/*! @polymer/polymer/lib/elements/dom-if.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/elements/dom-if.js");

var _gestureEventListeners = __webpack_require__(/*! @polymer/polymer/lib/mixins/gesture-event-listeners.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js");

var _customEvents = __webpack_require__(/*! ./common/customEvents.js */ "./dynamic-slider/src/common/customEvents.js");

var _customEvents2 = _interopRequireDefault(_customEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * `dynamic-slider`
 * Renders a slider between any 2 arbitrary points on the screen.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
var DynamicSlider = function (_GestureEventListener) {
  (0, _inherits3.default)(DynamicSlider, _GestureEventListener);
  (0, _createClass3.default)(DynamicSlider, null, [{
    key: 'template',
    get: function get() {
      return (0, _htmlTag.html)(_templateObject);
    }
  }]);

  function DynamicSlider() {
    (0, _classCallCheck3.default)(this, DynamicSlider);

    var _this = (0, _possibleConstructorReturn3.default)(this, (DynamicSlider.__proto__ || (0, _getPrototypeOf2.default)(DynamicSlider)).call(this));

    _this.handlePositionX = undefined;
    _this.handlePositionY = undefined;
    _this.parentBoundaries = undefined;
    _this.isSliderShown = false;
    return _this;
  }

  (0, _createClass3.default)(DynamicSlider, [{
    key: 'displayChange',
    value: function displayChange(e) {
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
      var imageHandle = this.shadowRoot.querySelectorAll('#handle-img:not([style*="display:none"]):not([style*="display: none"])')[0];
      if (imageHandle && this.imgHandle) {
        imageHandle.setAttributeNS("http://www.w3.org/1999/xlink", "href", this.imgHandle);
      }
    }
  }, {
    key: 'adjustHandle',
    value: function adjustHandle(e) {
      if (!this.parentBoundaries) {
        return;
      }
      var localX = e.detail.x - this.parentBoundaries.left;
      var localY = e.detail.y - this.parentBoundaries.top;
      // Use the simplified expression for getting the intersecting line's point intersection
      // between localX/Y and the slider line to find out where to place the handle on the
      // slider. Clamp the values with the given x_min and x_max values.
      this.handlePositionX = localX < this.__lineParam.x_min ? this.__lineParam.x_min : localX > this.__lineParam.x_max ? this.__lineParam.x_max : (localX + this.__lineParam.m * (localY - this.__lineParam.b)) / (this.__lineParam.m ** 2 + 1);
      this.handlePositionY = this.__lineParam.m * this.handlePositionX + this.__lineParam.b;
      // Calculate the proportion between the current handle position and slider's length.
      var currentDistance = this.calculateDistance(this.__adjustedPts.from.x, this.__adjustedPts.from.y, this.handlePositionX, this.handlePositionY);
      // If an image handle is being used, offset the position to the image center
      if (this.imgHandle) {
        this.handlePositionX -= this.handleRadius;
        this.handlePositionY -= this.handleRadius;
      }
      var data = {
        proportion: currentDistance / this.__length
      };
      switch (e.detail.state) {
        case "start":
          this.shadowRoot.querySelector("#container").dispatchEvent(_customEvents2.default.sliderStartObj(data));
          break;
        case "track":
          this.shadowRoot.querySelector("#container").dispatchEvent(_customEvents2.default.sliderMoveObj(data));
          break;
        case "end":
          this.shadowRoot.querySelector("#container").dispatchEvent(_customEvents2.default.sliderStopObj(data));
          break;
      }
    }
  }, {
    key: 'computeOverlayThickness',
    value: function computeOverlayThickness(lineThickness) {
      return lineThickness * 6;
    }
  }, {
    key: 'computePoint',
    value: function computePoint(x, y) {
      return x !== undefined && y !== undefined && !(0, _isNan2.default)(x) && !(0, _isNan2.default)(y) ? { x: x, y: y } : undefined;
    }
  }, {
    key: 'computeIsShowSlider',
    value: function computeIsShowSlider(__pt1, __pt2) {
      return __pt1 !== undefined && __pt2 !== undefined;
    }
  }, {
    key: 'computeDrawStartPoint',
    value: function computeDrawStartPoint(__isShowSlider, handleRadius, __pt1, __pt2) {
      return __isShowSlider ? {
        x: (__pt2.x <= __pt1.x ? __pt2.x : __pt1.x) - handleRadius,
        y: (__pt2.y <= __pt1.y ? __pt2.y : __pt1.y) - handleRadius
      } : undefined;
    }
  }, {
    key: 'computeAdjustedPoints',
    value: function computeAdjustedPoints(__isShowSlider, handleRadius, __pt1, __pt2) {
      if (!__isShowSlider) {
        return;
      }
      var xOffset = __pt1.x <= __pt2.x ? __pt1.x : __pt2.x;
      var yOffset = __pt1.y <= __pt2.y ? __pt1.y : __pt2.y;
      var x1 = __pt1.x - xOffset + handleRadius;
      var y1 = __pt1.y - yOffset + handleRadius;
      var x2 = __pt2.x - xOffset + handleRadius;
      var y2 = __pt2.y - yOffset + handleRadius;
      return {
        from: { x: x1, y: y1 },
        to: { x: x2, y: y2 }
      };
    }
  }, {
    key: 'computeDistance',
    value: function computeDistance(__adjustedPts) {
      if (!__adjustedPts) {
        return;
      }
      return this.calculateDistance(__adjustedPts.from.x, __adjustedPts.from.y, __adjustedPts.to.x, __adjustedPts.to.y);
    }
  }, {
    key: 'computeLineParam',
    value: function computeLineParam(__adjustedPts) {
      if (!__adjustedPts) {
        return;
      }
      var m = (__adjustedPts.to.y - __adjustedPts.from.y) / (__adjustedPts.to.x - __adjustedPts.from.x);
      var b = __adjustedPts.to.y - m * __adjustedPts.to.x;
      var bSanityCheck = __adjustedPts.from.y - m * __adjustedPts.from.x;
      var compareSensitivity = 1e-6;
      var sanityCheckDiff = Math.abs(b - bSanityCheck);
      if (sanityCheckDiff > compareSensitivity) {
        throw 'Something went wrong while extrapolating linear parameters from dynamic slider.\nPoints: from (' + __adjustedPts.from.x + ', ' + __adjustedPts.from.y + ') to (' + __adjustedPts.to.x + ', ' + __adjustedPts.to.y + ').\nSanity check diff: ' + sanityCheckDiff + ', sensitivity: ' + compareSensitivity + '.';
      }
      var x_min = __adjustedPts.from.x;
      var x_max = __adjustedPts.to.x;
      if (__adjustedPts.to.x < __adjustedPts.from.x) {
        x_min = __adjustedPts.to.x;
        x_max = __adjustedPts.from.x;
      }
      return { m: m, b: b, x_min: x_min, x_max: x_max };
    }
  }, {
    key: 'computeWidth',
    value: function computeWidth(__isShowSlider, handleRadius, __pt1, __pt2) {
      return __isShowSlider ? Math.abs(__pt1.x - __pt2.x) + 2 * handleRadius : undefined;
    }
  }, {
    key: 'computeHeight',
    value: function computeHeight(__isShowSlider, handleRadius, __pt1, __pt2) {
      return __isShowSlider ? Math.abs(__pt1.y - __pt2.y) + 2 * handleRadius : undefined;
    }
  }, {
    key: 'computeContainerStyle',
    value: function computeContainerStyle(__drawStartPt) {
      return __drawStartPt ? '\n      pointer-events: none;\n      transform: translate(' + __drawStartPt.x + 'px, ' + __drawStartPt.y + 'px);\n    ' : undefined;
    }
  }, {
    key: 'computeTrackStyle',
    value: function computeTrackStyle(lineThickness, lineColor) {
      return '\n      pointer-events: none;\n      stroke: ' + lineColor + ';\n      stroke-width: ' + lineThickness + 'px;\n      stroke-linecap: round;\n    ';
    }
  }, {
    key: 'computeTrackOverlayStyle',
    value: function computeTrackOverlayStyle(__overlayThickness) {
      return '\n      pointer-events: stroke;\n      cursor: pointer;\n      stroke-width: ' + __overlayThickness + 'px;\n      stroke-linecap: round;\n\n    ';
    }
  }, {
    key: 'computeCircleHandleStyle',
    value: function computeCircleHandleStyle(imgHandle, handleColor) {
      var style = '\n      fill: ' + handleColor + ';\n    ';
      style += !imgHandle ? '' : 'display: none;';
      return style;
    }
  }, {
    key: 'computeImageHandleStyle',
    value: function computeImageHandleStyle(imgHandle) {
      var style = '';
      style += !imgHandle ? 'display: none;' : '';
      return style;
    }
  }, {
    key: 'computeImageHandleSize',
    value: function computeImageHandleSize(handleRadius) {
      return {
        width: 2 * handleRadius,
        height: 2 * handleRadius
      };
    }
  }, {
    key: 'setDefaultHandlePosition',
    value: function setDefaultHandlePosition(val, __adjustedPts, handleRadius) {
      // If the reference points do not exist, do nothing.
      if (!__adjustedPts || !this.isSliderShown) {
        return;
      }
      if (val !== undefined && !(0, _isNan2.default)(val) && val >= 0 && val <= 1) {
        // If user provided an input value and that value is in a valid range (0 - 1),
        // set the handle to that value. When handle position change, emit an event
        // to notify the change.
        this.handlePositionX = __adjustedPts.from.x + val * (__adjustedPts.to.x - __adjustedPts.from.x);
        this.handlePositionY = __adjustedPts.from.y + val * (__adjustedPts.to.y - __adjustedPts.from.y);
        this.shadowRoot.querySelector("#container").dispatchEvent(_customEvents2.default.sliderMoveObj({ proportion: val }));
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
  }, {
    key: 'calculateDistance',
    value: function calculateDistance(x1, y1, x2, y2) {
      return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    }
  }], [{
    key: 'is',
    get: function get() {
      return 'dynamic-slider';
    }
  }, {
    key: 'properties',
    get: function get() {
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
  }, {
    key: 'observers',
    get: function get() {
      return ["setDefaultHandlePosition(val, __adjustedPts, handleRadius)"];
    }
  }]);
  return DynamicSlider;
}((0, _gestureEventListeners.GestureEventListeners)(_polymerElement.PolymerElement));

window.customElements.define(DynamicSlider.is, DynamicSlider);

/***/ })

},[["./dynamic-slider/src/index.js","runtime","vendors~dynamic-slider~float-view","vendors~dynamic-slider"]]]);
//# sourceMappingURL=dynamic-slider.bundle.js.map