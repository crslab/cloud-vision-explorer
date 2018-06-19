(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["float-view"],{

/***/ "./float-view/src/common/customEvents.js":
/*!***********************************************!*\
  !*** ./float-view/src/common/customEvents.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

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
    key: "resetCanvasObj",
    value: function resetCanvasObj() {
      var dataJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var bubbles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var composed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var params = {
        detail: dataJSON,
        bubbles: bubbles,
        composed: composed
      };
      return new CustomEvent(this.resetCanvas, params);
    }
  }, {
    key: "selectEntityObj",
    value: function selectEntityObj() {
      var dataJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var bubbles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var composed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var params = {
        detail: dataJSON,
        bubbles: bubbles,
        composed: composed
      };
      return new CustomEvent(this.selectEntity, params);
    }
  }, {
    key: "previewEntityObj",
    value: function previewEntityObj() {
      var dataJSON = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var bubbles = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var composed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

      var params = {
        detail: dataJSON,
        bubbles: bubbles,
        composed: composed
      };
      return new CustomEvent(this.previewEntity, params);
    }
  }, {
    key: "resetCanvas",
    get: function get() {
      return "reset-canvas";
    }
  }, {
    key: "selectEntity",
    get: function get() {
      return "select-entity";
    }
  }, {
    key: "previewEntity",
    get: function get() {
      return "preview-entity";
    }
  }]);
  return CustomEventsCollection;
}();

exports.default = CustomEventsCollection;

/***/ }),

/***/ "./float-view/src/index.js":
/*!*********************************!*\
  !*** ./float-view/src/index.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _getPrototypeOf = __webpack_require__(/*! babel-runtime/core-js/object/get-prototype-of */ "./dynamic-slider/node_modules/babel-runtime/core-js/object/get-prototype-of.js");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _taggedTemplateLiteral2 = __webpack_require__(/*! babel-runtime/helpers/taggedTemplateLiteral */ "./dynamic-slider/node_modules/babel-runtime/helpers/taggedTemplateLiteral.js");

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./dynamic-slider/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(/*! babel-runtime/helpers/possibleConstructorReturn */ "./dynamic-slider/node_modules/babel-runtime/helpers/possibleConstructorReturn.js");

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = __webpack_require__(/*! babel-runtime/helpers/get */ "./dynamic-slider/node_modules/babel-runtime/helpers/get.js");

var _get3 = _interopRequireDefault(_get2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./dynamic-slider/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _inherits2 = __webpack_require__(/*! babel-runtime/helpers/inherits */ "./dynamic-slider/node_modules/babel-runtime/helpers/inherits.js");

var _inherits3 = _interopRequireDefault(_inherits2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n      <style>\n        :host {\n          display: block;\n          height: 100%;\n          width: 100%;\n        }\n\n        canvas {\n          visibility: inherit !important;\n        }\n      </style>\n      <div id="[[containerName]]">\n      </div>\n    '], ['\n      <style>\n        :host {\n          display: block;\n          height: 100%;\n          width: 100%;\n        }\n\n        canvas {\n          visibility: inherit !important;\n        }\n      </style>\n      <div id="[[containerName]]">\n      </div>\n    ']);

var _polymerElement = __webpack_require__(/*! @polymer/polymer/polymer-element.js */ "./dynamic-slider/node_modules/@polymer/polymer/polymer-element.js");

var _htmlTag = __webpack_require__(/*! @polymer/polymer/lib/utils/html-tag.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/html-tag.js");

__webpack_require__(/*! p5/lib/p5.min.js */ "./float-view/node_modules/p5/lib/p5.min.js");

__webpack_require__(/*! p5/lib/addons/p5.dom.js */ "./float-view/node_modules/p5/lib/addons/p5.dom.js");

var _visualization = __webpack_require__(/*! ./lib/visualization.js */ "./float-view/src/lib/visualization.js");

var _visualization2 = _interopRequireDefault(_visualization);

var _customEvents = __webpack_require__(/*! ./common/customEvents.js */ "./float-view/src/common/customEvents.js");

var _customEvents2 = _interopRequireDefault(_customEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * `float-view`
 * Takes in list of json. Present as floating object points that contains pop-over information.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
var FloatView = function (_PolymerElement) {
  (0, _inherits3.default)(FloatView, _PolymerElement);
  (0, _createClass3.default)(FloatView, null, [{
    key: 'template',
    get: function get() {
      return (0, _htmlTag.html)(_templateObject);
    }
  }]);

  function FloatView() {
    (0, _classCallCheck3.default)(this, FloatView);

    var _this = (0, _possibleConstructorReturn3.default)(this, (FloatView.__proto__ || (0, _getPrototypeOf2.default)(FloatView)).call(this));

    _this.containerName = "canvas-container_" + Date.now();
    return _this;
  }

  (0, _createClass3.default)(FloatView, [{
    key: 'ready',
    value: function ready() {
      (0, _get3.default)(FloatView.prototype.__proto__ || (0, _getPrototypeOf2.default)(FloatView.prototype), 'ready', this).call(this);
      // Propagate events doesn to the P5 canvas.
      var host = this.root.host;
      var containerDOM = this.root.querySelector('#' + this.containerName);
      host.addEventListener(_customEvents2.default.resetCanvas, function (e) {
        containerDOM.dispatchEvent(_customEvents2.default.resetCanvasObj(null, false, false));
      });
    }
  }, {
    key: 'resourceChanged',
    value: function resourceChanged(imgPathPrefix, objectArray, bgColor) {
      if (!imgPathPrefix || !objectArray) {
        return;
      }
      this._drawVisualization(imgPathPrefix, objectArray, bgColor);
    }
  }, {
    key: '_drawVisualization',
    value: function _drawVisualization(imgPathPrefix, data, bgColor) {
      var containerDOM = this.root.querySelector('#' + this.containerName);
      var parentWidth = this.root.host.offsetWidth;
      var parentHeight = this.root.host.offsetHeight;
      if (this._p5) {
        containerDOM.innerHTML = '';
      }
      this._viz = new _visualization2.default(imgPathPrefix, data, containerDOM, parentWidth, parentHeight, bgColor);
      this._p5 = new p5(this._viz.sketch.bind(this._viz), containerDOM);
    }
  }], [{
    key: 'is',
    get: function get() {
      return 'float-view';
    }
  }, {
    key: 'properties',
    get: function get() {
      return {
        imgPathPrefix: String,
        bgColor: String,
        objectArray: Array
      };
    }
  }, {
    key: 'observers',
    get: function get() {
      return ["resourceChanged(imgPathPrefix, objectArray, bgColor)"];
    }
  }]);
  return FloatView;
}(_polymerElement.PolymerElement);

window.customElements.define(FloatView.is, FloatView);

/***/ }),

/***/ "./float-view/src/lib/entity.js":
/*!**************************************!*\
  !*** ./float-view/src/lib/entity.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./dynamic-slider/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./dynamic-slider/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _entityActions = __webpack_require__(/*! ./entityActions.js */ "./float-view/src/lib/entityActions.js");

var _customEvents = __webpack_require__(/*! ../common/customEvents.js */ "./float-view/src/common/customEvents.js");

var _customEvents2 = _interopRequireDefault(_customEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Entity = function () {
  function Entity(imgPathPrefix, p, data) {
    var w = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 20;
    var h = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 20;
    var data_min_x = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : -35;
    var data_min_y = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : -43;
    var data_range_x = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 70;
    var data_range_y = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : 86;
    var selected_border_width = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 3;
    (0, _classCallCheck3.default)(this, Entity);

    this.status = _entityActions.statuses.PLAIN;
    this.imgPathPrefix = imgPathPrefix;
    this.p = p;
    this.data = data;
    this.w = w;
    this.h = h;
    this.data_min_x = data_min_x;
    this.data_min_y = data_min_y;
    this.data_range_x = data_range_x;
    this.data_range_y = data_range_y;
    this.embed = this.data.z;
    this.selected_border_width = selected_border_width;
    this.absW = this.p.width;
    this.absH = this.p.height;
    this.size = data.img_size;
    this.wRadius = this.w / 2;
    this.hRadius = this.h / 2;
    this.wCorner = this.absW - this.wRadius;
    this.hCorner = this.absH - this.hRadius;
    var xOffset = this.absW * (data.z_2d[0] - this.data_min_x) / this.data_range_x;
    var yOffset = this.absH * (data.z_2d[1] - this.data_min_y) / this.data_range_y;
    this.x = xOffset < this.wRadius ? this.wRadius : xOffset > this.wCorner ? this.wCorner : xOffset;
    this.y = yOffset < this.hRadius ? this.hRadius : yOffset > this.hCorner ? this.hCorner : yOffset;
  }

  (0, _createClass3.default)(Entity, [{
    key: "display",
    value: function display() {
      var _this = this;

      this.p.loadImage(this.imgPathPrefix + this.data.filename, function (img) {
        _this.p.image(img, _this.x - _this.size / 2, _this.y - _this.size / 2);
      });
    }
  }, {
    key: "displayPreview",
    value: function displayPreview() {
      console.log("\nPreviewing image to be implemented\n");
    }
  }, {
    key: "displaySelected",
    value: function displaySelected() {
      var _this2 = this;

      this.p.noStroke();
      this.p.fill(128, 240, 128);
      this.p.rect(this.x - this.size / 2 - this.selected_border_width, this.y - this.size / 2 - this.selected_border_width, this.size + 2 * this.selected_border_width, this.size + 2 * this.selected_border_width);
      this.p.loadImage(this.imgPathPrefix + this.data.filename, function (img) {
        _this2.p.image(img, _this2.x - _this2.size / 2, _this2.y - _this2.size / 2);
      });
    }
  }, {
    key: "mouseX",
    get: function get() {
      return this.p.mouseX;
    }
  }, {
    key: "mouseY",
    get: function get() {
      return this.p.mouseY;
    }
  }, {
    key: "position",
    get: function get() {
      return {
        mouseX: this.mouseX,
        mouseY: this.mouseY,
        x: this.x,
        y: this.y,
        size: this.size
      };
    }
  }]);
  return Entity;
}();

exports.default = Entity;

/***/ }),

/***/ "./float-view/src/lib/entityActions.js":
/*!*********************************************!*\
  !*** ./float-view/src/lib/entityActions.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = reducer;
var types = exports.types = {
  CLEAR: "CLEAR",
  PREVIEW: "PREVIEW",
  SELECT: "SELECT"
};

var statuses = exports.statuses = {
  PLAIN: "PLAIN",
  PREVIEWED: "PREVIEWED",
  SELECTED: "SELECTED"
};

var isMouseHit = function isMouseHit(mouseX, mouseY, x, y, size) {
  return (mouseX - x) ** 2 / (size * size / 4) + (mouseY - y) ** 2 / (size * size / 4) < 1;
};

var inititalState = {
  status: statuses.PLAIN,
  position: {
    mouseX: 0,
    mouseY: 0,
    x: 0,
    y: 0,
    size: 0
  },
  data: {
    "z": [],
    "z_2d": [],
    "filename": "",
    "img_size": 0
  }
};

function reducer(type, entity) {
  switch (type) {
    case types.CLEAR:
      return displayPlainEntity(entity);
    case types.PREVIEW:
      return previewEntity(entity);
    case types.SELECT:
      return selectEntity(entity);
    default:
      return displayPlainEntity(entity);
  }
}

function displayPlainEntity(entity) {
  entity.display();
  entity.status = statuses.PLAIN;
  return null;
}

function previewEntity(entity) {
  var isActive = isMouseHit(entity.mouseX, entity.mouseY, entity.x, entity.y, entity.size);
  if (!isActive) {
    return null;
  }
  entity.displayPreview();
  entity.status = statuses.PREVIEWED;
  return {
    status: entity.status,
    position: entity.position,
    data: entity.data
  };
}

function selectEntity(entity) {
  var isActive = isMouseHit(entity.mouseX, entity.mouseY, entity.x, entity.y, entity.size);
  if (!isActive) {
    return null;
  }
  entity.displaySelected();
  entity.status = statuses.SELECTED;
  return {
    status: entity.status,
    position: entity.position,
    data: entity.data
  };
}

/***/ }),

/***/ "./float-view/src/lib/visualization.js":
/*!*********************************************!*\
  !*** ./float-view/src/lib/visualization.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(/*! babel-runtime/helpers/classCallCheck */ "./dynamic-slider/node_modules/babel-runtime/helpers/classCallCheck.js");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(/*! babel-runtime/helpers/createClass */ "./dynamic-slider/node_modules/babel-runtime/helpers/createClass.js");

var _createClass3 = _interopRequireDefault(_createClass2);

var _entity = __webpack_require__(/*! ./entity.js */ "./float-view/src/lib/entity.js");

var _entity2 = _interopRequireDefault(_entity);

var _entityActions = __webpack_require__(/*! ./entityActions.js */ "./float-view/src/lib/entityActions.js");

var _entityActions2 = _interopRequireDefault(_entityActions);

var _customEvents = __webpack_require__(/*! ../common/customEvents.js */ "./float-view/src/common/customEvents.js");

var _customEvents2 = _interopRequireDefault(_customEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Visualization = function () {
  function Visualization(imgPathPrefix, data, containerDOM, parentWidth, parentHeight) {
    var bgColor = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "#000000";
    (0, _classCallCheck3.default)(this, Visualization);

    this.imgPathPrefix = imgPathPrefix;
    this.data = data;
    this.containerDOM = containerDOM;
    this.parentWidth = parentWidth;
    this.parentHeight = parentHeight;
    this.bgColor = bgColor;
  }

  (0, _createClass3.default)(Visualization, [{
    key: "sketch",
    value: function sketch(p) {
      p.setup = setup;
      p.draw = draw;
      p.mousePressed = mousePressed;
      p.mouseReleased = mouseReleased;
      p.mouseClicked = mouseClicked;

      var self = this;
      var entityList = [];
      var startTime = 0;
      var endTime = 0;
      var checkpointTime = 0;
      var longPressMs = 300;
      var startMouseX = 0;
      var startMouseY = 0;
      var mouseClickMoveTolerance = 1e-13;

      function setup() {
        p.createCanvas(self.parentWidth, self.parentHeight);
        for (var i = 0; i < self.data.length; i++) {
          entityList.push(new _entity2.default(self.imgPathPrefix, p, self.data[i]));
        }
        reset();
        p.noLoop();

        // Hook up events
        self.containerDOM.addEventListener(_customEvents2.default.resetCanvas, reset);
      }

      function draw() {
        var timeNow = Date.now();
        var timeDifferenceMs = timeNow - checkpointTime;
        if (timeDifferenceMs >= longPressMs && Math.abs(startMouseX - p.mouseX) < mouseClickMoveTolerance && Math.abs(startMouseY - p.mouseY) < mouseClickMoveTolerance) {
          checkpointTime = timeNow;
          select();
        }
      }

      function mousePressed() {
        startTime = Date.now();
        checkpointTime = startTime;
        startMouseX = p.mouseX;
        startMouseY = p.mouseY;
        p.loop();
      }

      function mouseReleased() {
        endTime = Date.now();
        p.noLoop();
      }

      function mouseClicked() {
        var timeDifferenceMs = endTime - startTime;
        if (timeDifferenceMs < longPressMs) {
          preview();
        }
      }

      function reset() {
        p.background(self.bgColor);
        for (var i = 0; i < self.data.length; i++) {
          (0, _entityActions2.default)(_entityActions.types.CLEAR, entityList[i]);
        }
      }

      function preview() {
        // Generally for previewing, not for selecting.
        for (var i = 0; i < entityList.length; i++) {
          var data = (0, _entityActions2.default)(_entityActions.types.PREVIEW, entityList[i]);
          if (data) {
            self.dispatch(_customEvents2.default.previewEntityObj(data));
            return;
          }
        }
      }

      function select() {
        // Generally for selecting
        for (var i = 0; i < entityList.length; i++) {
          var data = (0, _entityActions2.default)(_entityActions.types.SELECT, entityList[i]);
          if (data) {
            self.dispatch(_customEvents2.default.selectEntityObj(data));
            return;
          }
        }
      }
    }
  }, {
    key: "dispatch",
    value: function dispatch(eventObject) {
      this.containerDOM.dispatchEvent(eventObject);
    }
  }]);
  return Visualization;
}();

exports.default = Visualization;

/***/ })

},[["./float-view/src/index.js","runtime","vendors~dynamic-slider~float-view","vendors~float-view"]]]);
//# sourceMappingURL=float-view.bundle.js.map