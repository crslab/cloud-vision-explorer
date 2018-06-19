(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["vendors~dynamic-slider"],{

/***/ "./dynamic-slider/node_modules/@polymer/polymer/lib/elements/dom-if.js":
/*!*****************************************************************************!*\
  !*** ./dynamic-slider/node_modules/@polymer/polymer/lib/elements/dom-if.js ***!
  \*****************************************************************************/
/*! exports provided: DomIf */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DomIf", function() { return DomIf; });
/* harmony import */ var _polymer_element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../polymer-element.js */ "./dynamic-slider/node_modules/@polymer/polymer/polymer-element.js");
/* harmony import */ var _utils_templatize_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/templatize.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/templatize.js");
/* harmony import */ var _utils_debounce_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/debounce.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/debounce.js");
/* harmony import */ var _utils_flush_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/flush.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/flush.js");
/* harmony import */ var _utils_async_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/async.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/async.js");
/* harmony import */ var _utils_path_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/path.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/path.js");
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/








/**
 * The `<dom-if>` element will stamp a light-dom `<template>` child when
 * the `if` property becomes truthy, and the template can use Polymer
 * data-binding and declarative event features when used in the context of
 * a Polymer element's template.
 *
 * When `if` becomes falsy, the stamped content is hidden but not
 * removed from dom. When `if` subsequently becomes truthy again, the content
 * is simply re-shown. This approach is used due to its favorable performance
 * characteristics: the expense of creating template content is paid only
 * once and lazily.
 *
 * Set the `restamp` property to true to force the stamped content to be
 * created / destroyed when the `if` condition changes.
 *
 * @customElement
 * @polymer
 * @extends PolymerElement
 * @summary Custom element that conditionally stamps and hides or removes
 *   template content based on a boolean flag.
 */
class DomIf extends _polymer_element_js__WEBPACK_IMPORTED_MODULE_0__["PolymerElement"] {

  // Not needed to find template; can be removed once the analyzer
  // can find the tag name from customElements.define call
  static get is() { return 'dom-if'; }

  static get template() { return null; }

  static get properties() {

    return {

      /**
       * Fired whenever DOM is added or removed/hidden by this template (by
       * default, rendering occurs lazily).  To force immediate rendering, call
       * `render`.
       *
       * @event dom-change
       */

      /**
       * A boolean indicating whether this template should stamp.
       */
      if: {
        type: Boolean,
        observer: '__debounceRender'
      },

      /**
       * When true, elements will be removed from DOM and discarded when `if`
       * becomes false and re-created and added back to the DOM when `if`
       * becomes true.  By default, stamped elements will be hidden but left
       * in the DOM when `if` becomes false, which is generally results
       * in better performance.
       */
      restamp: {
        type: Boolean,
        observer: '__debounceRender'
      }

    };

  }

  constructor() {
    super();
    this.__renderDebouncer = null;
    this.__invalidProps = null;
    this.__instance = null;
    this._lastIf = false;
    this.__ctor = null;
  }

  __debounceRender() {
    // Render is async for 2 reasons:
    // 1. To eliminate dom creation trashing if user code thrashes `if` in the
    //    same turn. This was more common in 1.x where a compound computed
    //    property could result in the result changing multiple times, but is
    //    mitigated to a large extent by batched property processing in 2.x.
    // 2. To avoid double object propagation when a bag including values bound
    //    to the `if` property as well as one or more hostProps could enqueue
    //    the <dom-if> to flush before the <template>'s host property
    //    forwarding. In that scenario creating an instance would result in
    //    the host props being set once, and then the enqueued changes on the
    //    template would set properties a second time, potentially causing an
    //    object to be set to an instance more than once.  Creating the
    //    instance async from flushing data ensures this doesn't happen. If
    //    we wanted a sync option in the future, simply having <dom-if> flush
    //    (or clear) its template's pending host properties before creating
    //    the instance would also avoid the problem.
    this.__renderDebouncer = _utils_debounce_js__WEBPACK_IMPORTED_MODULE_2__["Debouncer"].debounce(
          this.__renderDebouncer
        , _utils_async_js__WEBPACK_IMPORTED_MODULE_4__["microTask"]
        , () => this.__render());
    Object(_utils_flush_js__WEBPACK_IMPORTED_MODULE_3__["enqueueDebouncer"])(this.__renderDebouncer);
  }

  /**
   * @return {void}
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (!this.parentNode ||
        (this.parentNode.nodeType == Node.DOCUMENT_FRAGMENT_NODE &&
         !this.parentNode.host)) {
      this.__teardownInstance();
    }
  }

  /**
   * @return {void}
   */
  connectedCallback() {
    super.connectedCallback();
    this.style.display = 'none';
    if (this.if) {
      this.__debounceRender();
    }
  }

  /**
   * Forces the element to render its content. Normally rendering is
   * asynchronous to a provoking change. This is done for efficiency so
   * that multiple changes trigger only a single render. The render method
   * should be called if, for example, template rendering is required to
   * validate application state.
   * @return {void}
   */
  render() {
    Object(_utils_flush_js__WEBPACK_IMPORTED_MODULE_3__["flush"])();
  }

  __render() {
    if (this.if) {
      if (!this.__ensureInstance()) {
        // No template found yet
        return;
      }
      this._showHideChildren();
    } else if (this.restamp) {
      this.__teardownInstance();
    }
    if (!this.restamp && this.__instance) {
      this._showHideChildren();
    }
    if (this.if != this._lastIf) {
      this.dispatchEvent(new CustomEvent('dom-change', {
        bubbles: true,
        composed: true
      }));
      this._lastIf = this.if;
    }
  }

  __ensureInstance() {
    let parentNode = this.parentNode;
    // Guard against element being detached while render was queued
    if (parentNode) {
      if (!this.__ctor) {
        let template = /** @type {HTMLTemplateElement} */(this.querySelector('template'));
        if (!template) {
          // Wait until childList changes and template should be there by then
          let observer = new MutationObserver(() => {
            if (this.querySelector('template')) {
              observer.disconnect();
              this.__render();
            } else {
              throw new Error('dom-if requires a <template> child');
            }
          });
          observer.observe(this, {childList: true});
          return false;
        }
        this.__ctor = Object(_utils_templatize_js__WEBPACK_IMPORTED_MODULE_1__["templatize"])(template, this, {
          // dom-if templatizer instances require `mutable: true`, as
          // `__syncHostProperties` relies on that behavior to sync objects
          mutableData: true,
          /**
           * @param {string} prop Property to forward
           * @param {*} value Value of property
           * @this {this}
           */
          forwardHostProp: function(prop, value) {
            if (this.__instance) {
              if (this.if) {
                this.__instance.forwardHostProp(prop, value);
              } else {
                // If we have an instance but are squelching host property
                // forwarding due to if being false, note the invalidated
                // properties so `__syncHostProperties` can sync them the next
                // time `if` becomes true
                this.__invalidProps = this.__invalidProps || Object.create(null);
                this.__invalidProps[Object(_utils_path_js__WEBPACK_IMPORTED_MODULE_5__["root"])(prop)] = true;
              }
            }
          }
        });
      }
      if (!this.__instance) {
        this.__instance = new this.__ctor();
        parentNode.insertBefore(this.__instance.root, this);
      } else {
        this.__syncHostProperties();
        let c$ = this.__instance.children;
        if (c$ && c$.length) {
          // Detect case where dom-if was re-attached in new position
          let lastChild = this.previousSibling;
          if (lastChild !== c$[c$.length-1]) {
            for (let i=0, n; (i<c$.length) && (n=c$[i]); i++) {
              parentNode.insertBefore(n, this);
            }
          }
        }
      }
    }
    return true;
  }

  __syncHostProperties() {
    let props = this.__invalidProps;
    if (props) {
      for (let prop in props) {
        this.__instance._setPendingProperty(prop, this.__dataHost[prop]);
      }
      this.__invalidProps = null;
      this.__instance._flushProperties();
    }
  }

  __teardownInstance() {
    if (this.__instance) {
      let c$ = this.__instance.children;
      if (c$ && c$.length) {
        // use first child parent, for case when dom-if may have been detached
        let parent = c$[0].parentNode;
        for (let i=0, n; (i<c$.length) && (n=c$[i]); i++) {
          parent.removeChild(n);
        }
      }
      this.__instance = null;
      this.__invalidProps = null;
    }
  }

  /**
   * Shows or hides the template instance top level child elements. For
   * text nodes, `textContent` is removed while "hidden" and replaced when
   * "shown."
   * @return {void}
   * @protected
   */
  _showHideChildren() {
    let hidden = this.__hideTemplateChildren__ || !this.if;
    if (this.__instance) {
      this.__instance._showHideChildren(hidden);
    }
  }

}

customElements.define(DomIf.is, DomIf);


/***/ }),

/***/ "./dynamic-slider/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js":
/*!********************************************************************************************!*\
  !*** ./dynamic-slider/node_modules/@polymer/polymer/lib/mixins/gesture-event-listeners.js ***!
  \********************************************************************************************/
/*! exports provided: GestureEventListeners */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GestureEventListeners", function() { return GestureEventListeners; });
/* harmony import */ var _utils_boot_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/boot.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/boot.js");
/* harmony import */ var _utils_boot_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_utils_boot_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_mixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/mixin.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/mixin.js");
/* harmony import */ var _utils_gestures_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/gestures.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/gestures.js");
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/





const gestures = _utils_gestures_js__WEBPACK_IMPORTED_MODULE_2__;

/**
 * Element class mixin that provides API for adding Polymer's cross-platform
 * gesture events to nodes.
 *
 * The API is designed to be compatible with override points implemented
 * in `TemplateStamp` such that declarative event listeners in
 * templates will support gesture events when this mixin is applied along with
 * `TemplateStamp`.
 *
 * @mixinFunction
 * @polymer
 * @summary Element class mixin that provides API for adding Polymer's
 *   cross-platform
 * gesture events to nodes
 */
const GestureEventListeners = Object(_utils_mixin_js__WEBPACK_IMPORTED_MODULE_1__["dedupingMixin"])(superClass => {

  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_GestureEventListeners}
   */
  class GestureEventListeners extends superClass {

    /**
     * Add the event listener to the node if it is a gestures event.
     *
     * @param {!Node} node Node to add event listener to
     * @param {string} eventName Name of event
     * @param {function(!Event):void} handler Listener function to add
     * @return {void}
     */
    _addEventListenerToNode(node, eventName, handler) {
      if (!gestures.addListener(node, eventName, handler)) {
        super._addEventListenerToNode(node, eventName, handler);
      }
    }

    /**
     * Remove the event listener to the node if it is a gestures event.
     *
     * @param {!Node} node Node to remove event listener from
     * @param {string} eventName Name of event
     * @param {function(!Event):void} handler Listener function to remove
     * @return {void}
     */
    _removeEventListenerFromNode(node, eventName, handler) {
      if (!gestures.removeListener(node, eventName, handler)) {
        super._removeEventListenerFromNode(node, eventName, handler);
      }
    }

  }

  return GestureEventListeners;

});


/***/ }),

/***/ "./dynamic-slider/node_modules/@polymer/polymer/lib/mixins/mutable-data.js":
/*!*********************************************************************************!*\
  !*** ./dynamic-slider/node_modules/@polymer/polymer/lib/mixins/mutable-data.js ***!
  \*********************************************************************************/
/*! exports provided: MutableData, OptionalMutableData */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MutableData", function() { return MutableData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "OptionalMutableData", function() { return OptionalMutableData; });
/* harmony import */ var _utils_mixin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/mixin.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/mixin.js");
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/


// Common implementation for mixin & behavior
function mutablePropertyChange(inst, property, value, old, mutableData) {
  let isObject;
  if (mutableData) {
    isObject = (typeof value === 'object' && value !== null);
    // Pull `old` for Objects from temp cache, but treat `null` as a primitive
    if (isObject) {
      old = inst.__dataTemp[property];
    }
  }
  // Strict equality check, but return false for NaN===NaN
  let shouldChange = (old !== value && (old === old || value === value));
  // Objects are stored in temporary cache (cleared at end of
  // turn), which is used for dirty-checking
  if (isObject && shouldChange) {
    inst.__dataTemp[property] = value;
  }
  return shouldChange;
}

/**
 * Element class mixin to skip strict dirty-checking for objects and arrays
 * (always consider them to be "dirty"), for use on elements utilizing
 * `PropertyEffects`
 *
 * By default, `PropertyEffects` performs strict dirty checking on
 * objects, which means that any deep modifications to an object or array will
 * not be propagated unless "immutable" data patterns are used (i.e. all object
 * references from the root to the mutation were changed).
 *
 * Polymer also provides a proprietary data mutation and path notification API
 * (e.g. `notifyPath`, `set`, and array mutation API's) that allow efficient
 * mutation and notification of deep changes in an object graph to all elements
 * bound to the same object graph.
 *
 * In cases where neither immutable patterns nor the data mutation API can be
 * used, applying this mixin will cause Polymer to skip dirty checking for
 * objects and arrays (always consider them to be "dirty").  This allows a
 * user to make a deep modification to a bound object graph, and then either
 * simply re-set the object (e.g. `this.items = this.items`) or call `notifyPath`
 * (e.g. `this.notifyPath('items')`) to update the tree.  Note that all
 * elements that wish to be updated based on deep mutations must apply this
 * mixin or otherwise skip strict dirty checking for objects/arrays.
 * Specifically, any elements in the binding tree between the source of a
 * mutation and the consumption of it must apply this mixin or enable the
 * `OptionalMutableData` mixin.
 *
 * In order to make the dirty check strategy configurable, see
 * `OptionalMutableData`.
 *
 * Note, the performance characteristics of propagating large object graphs
 * will be worse as opposed to using strict dirty checking with immutable
 * patterns or Polymer's path notification API.
 *
 * @mixinFunction
 * @polymer
 * @summary Element class mixin to skip strict dirty-checking for objects
 *   and arrays
 */
const MutableData = Object(_utils_mixin_js__WEBPACK_IMPORTED_MODULE_0__["dedupingMixin"])(superClass => {

  /**
   * @polymer
   * @mixinClass
   * @implements {Polymer_MutableData}
   */
  class MutableData extends superClass {
    /**
     * Overrides `PropertyEffects` to provide option for skipping
     * strict equality checking for Objects and Arrays.
     *
     * This method pulls the value to dirty check against from the `__dataTemp`
     * cache (rather than the normal `__data` cache) for Objects.  Since the temp
     * cache is cleared at the end of a turn, this implementation allows
     * side-effects of deep object changes to be processed by re-setting the
     * same object (using the temp cache as an in-turn backstop to prevent
     * cycles due to 2-way notification).
     *
     * @param {string} property Property name
     * @param {*} value New property value
     * @param {*} old Previous property value
     * @return {boolean} Whether the property should be considered a change
     * @protected
     */
    _shouldPropertyChange(property, value, old) {
      return mutablePropertyChange(this, property, value, old, true);
    }

  }

  return MutableData;

});

/**
 * Element class mixin to add the optional ability to skip strict
 * dirty-checking for objects and arrays (always consider them to be
 * "dirty") by setting a `mutable-data` attribute on an element instance.
 *
 * By default, `PropertyEffects` performs strict dirty checking on
 * objects, which means that any deep modifications to an object or array will
 * not be propagated unless "immutable" data patterns are used (i.e. all object
 * references from the root to the mutation were changed).
 *
 * Polymer also provides a proprietary data mutation and path notification API
 * (e.g. `notifyPath`, `set`, and array mutation API's) that allow efficient
 * mutation and notification of deep changes in an object graph to all elements
 * bound to the same object graph.
 *
 * In cases where neither immutable patterns nor the data mutation API can be
 * used, applying this mixin will allow Polymer to skip dirty checking for
 * objects and arrays (always consider them to be "dirty").  This allows a
 * user to make a deep modification to a bound object graph, and then either
 * simply re-set the object (e.g. `this.items = this.items`) or call `notifyPath`
 * (e.g. `this.notifyPath('items')`) to update the tree.  Note that all
 * elements that wish to be updated based on deep mutations must apply this
 * mixin or otherwise skip strict dirty checking for objects/arrays.
 * Specifically, any elements in the binding tree between the source of a
 * mutation and the consumption of it must enable this mixin or apply the
 * `MutableData` mixin.
 *
 * While this mixin adds the ability to forgo Object/Array dirty checking,
 * the `mutableData` flag defaults to false and must be set on the instance.
 *
 * Note, the performance characteristics of propagating large object graphs
 * will be worse by relying on `mutableData: true` as opposed to using
 * strict dirty checking with immutable patterns or Polymer's path notification
 * API.
 *
 * @mixinFunction
 * @polymer
 * @summary Element class mixin to optionally skip strict dirty-checking
 *   for objects and arrays
 */
const OptionalMutableData = Object(_utils_mixin_js__WEBPACK_IMPORTED_MODULE_0__["dedupingMixin"])(superClass => {

  /**
   * @mixinClass
   * @polymer
   * @implements {Polymer_OptionalMutableData}
   */
  class OptionalMutableData extends superClass {

    static get properties() {
      return {
        /**
         * Instance-level flag for configuring the dirty-checking strategy
         * for this element.  When true, Objects and Arrays will skip dirty
         * checking, otherwise strict equality checking will be used.
         */
        mutableData: Boolean
      };
    }

    /**
     * Overrides `PropertyEffects` to provide option for skipping
     * strict equality checking for Objects and Arrays.
     *
     * When `this.mutableData` is true on this instance, this method
     * pulls the value to dirty check against from the `__dataTemp` cache
     * (rather than the normal `__data` cache) for Objects.  Since the temp
     * cache is cleared at the end of a turn, this implementation allows
     * side-effects of deep object changes to be processed by re-setting the
     * same object (using the temp cache as an in-turn backstop to prevent
     * cycles due to 2-way notification).
     *
     * @param {string} property Property name
     * @param {*} value New property value
     * @param {*} old Previous property value
     * @return {boolean} Whether the property should be considered a change
     * @protected
     */
    _shouldPropertyChange(property, value, old) {
      return mutablePropertyChange(this, property, value, old, this.mutableData);
    }
  }

  return OptionalMutableData;

});

// Export for use by legacy behavior
MutableData._mutablePropertyChange = mutablePropertyChange;


/***/ }),

/***/ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/debounce.js":
/*!****************************************************************************!*\
  !*** ./dynamic-slider/node_modules/@polymer/polymer/lib/utils/debounce.js ***!
  \****************************************************************************/
/*! exports provided: Debouncer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Debouncer", function() { return Debouncer; });
/* harmony import */ var _boot_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./boot.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/boot.js");
/* harmony import */ var _boot_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_boot_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mixin.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/mixin.js");
/* harmony import */ var _async_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./async.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/async.js");
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/





/**
 * @summary Collapse multiple callbacks into one invocation after a timer.
 */
const Debouncer = class Debouncer {
  constructor() {
    this._asyncModule = null;
    this._callback = null;
    this._timer = null;
  }
  /**
   * Sets the scheduler; that is, a module with the Async interface,
   * a callback and optional arguments to be passed to the run function
   * from the async module.
   *
   * @param {!AsyncInterface} asyncModule Object with Async interface.
   * @param {function()} callback Callback to run.
   * @return {void}
   */
  setConfig(asyncModule, callback) {
    this._asyncModule = asyncModule;
    this._callback = callback;
    this._timer = this._asyncModule.run(() => {
      this._timer = null;
      this._callback();
    });
  }
  /**
   * Cancels an active debouncer and returns a reference to itself.
   *
   * @return {void}
   */
  cancel() {
    if (this.isActive()) {
      this._asyncModule.cancel(this._timer);
      this._timer = null;
    }
  }
  /**
   * Flushes an active debouncer and returns a reference to itself.
   *
   * @return {void}
   */
  flush() {
    if (this.isActive()) {
      this.cancel();
      this._callback();
    }
  }
  /**
   * Returns true if the debouncer is active.
   *
   * @return {boolean} True if active.
   */
  isActive() {
    return this._timer != null;
  }
  /**
   * Creates a debouncer if no debouncer is passed as a parameter
   * or it cancels an active debouncer otherwise. The following
   * example shows how a debouncer can be called multiple times within a
   * microtask and "debounced" such that the provided callback function is
   * called once. Add this method to a custom element:
   *
   * ```js
   * import {microtask} from '@polymer/polymer/lib/utils/async.js';
   * import {Debouncer} from '@polymer/polymer/lib/utils/debounce.js';
   * // ...
   *
   * _debounceWork() {
   *   this._debounceJob = Debouncer.debounce(this._debounceJob,
   *       microTask, () => this._doWork());
   * }
   * ```
   *
   * If the `_debounceWork` method is called multiple times within the same
   * microtask, the `_doWork` function will be called only once at the next
   * microtask checkpoint.
   *
   * Note: In testing it is often convenient to avoid asynchrony. To accomplish
   * this with a debouncer, you can use `enqueueDebouncer` and
   * `flush`. For example, extend the above example by adding
   * `enqueueDebouncer(this._debounceJob)` at the end of the
   * `_debounceWork` method. Then in a test, call `flush` to ensure
   * the debouncer has completed.
   *
   * @param {Debouncer?} debouncer Debouncer object.
   * @param {!AsyncInterface} asyncModule Object with Async interface
   * @param {function()} callback Callback to run.
   * @return {!Debouncer} Returns a debouncer object.
   */
  static debounce(debouncer, asyncModule, callback) {
    if (debouncer instanceof Debouncer) {
      debouncer.cancel();
    } else {
      debouncer = new Debouncer();
    }
    debouncer.setConfig(asyncModule, callback);
    return debouncer;
  }
};


/***/ }),

/***/ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/flush.js":
/*!*************************************************************************!*\
  !*** ./dynamic-slider/node_modules/@polymer/polymer/lib/utils/flush.js ***!
  \*************************************************************************/
/*! exports provided: enqueueDebouncer, flush */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "enqueueDebouncer", function() { return enqueueDebouncer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "flush", function() { return flush; });
/* harmony import */ var _boot_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./boot.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/boot.js");
/* harmony import */ var _boot_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_boot_js__WEBPACK_IMPORTED_MODULE_0__);
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/


let debouncerQueue = [];

/**
 * Adds a `Debouncer` to a list of globally flushable tasks.
 *
 * @param {!Debouncer} debouncer Debouncer to enqueue
 * @return {void}
 */
const enqueueDebouncer = function(debouncer) {
  debouncerQueue.push(debouncer);
};

function flushDebouncers() {
  const didFlush = Boolean(debouncerQueue.length);
  while (debouncerQueue.length) {
    try {
      debouncerQueue.shift().flush();
    } catch(e) {
      setTimeout(() => {
        throw e;
      });
    }
  }
  return didFlush;
}

/**
 * Forces several classes of asynchronously queued tasks to flush:
 * - Debouncers added via `enqueueDebouncer`
 * - ShadyDOM distribution
 *
 * @return {void}
 */
const flush = function() {
  let shadyDOM, debouncers;
  do {
    shadyDOM = window.ShadyDOM && ShadyDOM.flush();
    if (window.ShadyCSS && window.ShadyCSS.ScopingShim) {
      window.ShadyCSS.ScopingShim.flush();
    }
    debouncers = flushDebouncers();
  } while (shadyDOM || debouncers);
};


/***/ }),

/***/ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/gestures.js":
/*!****************************************************************************!*\
  !*** ./dynamic-slider/node_modules/@polymer/polymer/lib/utils/gestures.js ***!
  \****************************************************************************/
/*! exports provided: gestures, recognizers, deepTargetFind, addListener, removeListener, register, setTouchAction, prevent, resetMouseCanceller, findOriginalTarget, add, remove */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "gestures", function() { return gestures; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "recognizers", function() { return recognizers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "deepTargetFind", function() { return deepTargetFind; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "addListener", function() { return addListener; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "removeListener", function() { return removeListener; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "register", function() { return register; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setTouchAction", function() { return setTouchAction; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "prevent", function() { return prevent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resetMouseCanceller", function() { return resetMouseCanceller; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "findOriginalTarget", function() { return findOriginalTarget; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add", function() { return add; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "remove", function() { return remove; });
/* harmony import */ var _boot_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./boot.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/boot.js");
/* harmony import */ var _boot_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_boot_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _async_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./async.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/async.js");
/* harmony import */ var _debounce_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./debounce.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/debounce.js");
/* harmony import */ var _settings_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./settings.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/settings.js");
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/






// detect native touch action support
let HAS_NATIVE_TA = typeof document.head.style.touchAction === 'string';
let GESTURE_KEY = '__polymerGestures';
let HANDLED_OBJ = '__polymerGesturesHandled';
let TOUCH_ACTION = '__polymerGesturesTouchAction';
// radius for tap and track
let TAP_DISTANCE = 25;
let TRACK_DISTANCE = 5;
// number of last N track positions to keep
let TRACK_LENGTH = 2;

// Disabling "mouse" handlers for 2500ms is enough
let MOUSE_TIMEOUT = 2500;
let MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'click'];
// an array of bitmask values for mapping MouseEvent.which to MouseEvent.buttons
let MOUSE_WHICH_TO_BUTTONS = [0, 1, 4, 2];
let MOUSE_HAS_BUTTONS = (function() {
  try {
    return new MouseEvent('test', {buttons: 1}).buttons === 1;
  } catch (e) {
    return false;
  }
})();

/**
 * @param {string} name Possible mouse event name
 * @return {boolean} true if mouse event, false if not
 */
function isMouseEvent(name) {
  return MOUSE_EVENTS.indexOf(name) > -1;
}

/* eslint no-empty: ["error", { "allowEmptyCatch": true }] */
// check for passive event listeners
let SUPPORTS_PASSIVE = false;
(function() {
  try {
    let opts = Object.defineProperty({}, 'passive', {get() {SUPPORTS_PASSIVE = true;}});
    window.addEventListener('test', null, opts);
    window.removeEventListener('test', null, opts);
  } catch(e) {}
})();

/**
 * Generate settings for event listeners, dependant on `passiveTouchGestures`
 *
 * @param {string} eventName Event name to determine if `{passive}` option is
 *   needed
 * @return {{passive: boolean} | undefined} Options to use for addEventListener
 *   and removeEventListener
 */
function PASSIVE_TOUCH(eventName) {
  if (isMouseEvent(eventName) || eventName === 'touchend') {
    return;
  }
  if (HAS_NATIVE_TA && SUPPORTS_PASSIVE && _settings_js__WEBPACK_IMPORTED_MODULE_3__["passiveTouchGestures"]) {
    return {passive: true};
  } else {
    return;
  }
}

// Check for touch-only devices
let IS_TOUCH_ONLY = navigator.userAgent.match(/iP(?:[oa]d|hone)|Android/);

let GestureRecognizer = function(){}; // eslint-disable-line no-unused-vars
/** @type {function(): void} */
GestureRecognizer.prototype.reset;
/** @type {function(MouseEvent): void | undefined} */
GestureRecognizer.prototype.mousedown;
/** @type {(function(MouseEvent): void | undefined)} */
GestureRecognizer.prototype.mousemove;
/** @type {(function(MouseEvent): void | undefined)} */
GestureRecognizer.prototype.mouseup;
/** @type {(function(TouchEvent): void | undefined)} */
GestureRecognizer.prototype.touchstart;
/** @type {(function(TouchEvent): void | undefined)} */
GestureRecognizer.prototype.touchmove;
/** @type {(function(TouchEvent): void | undefined)} */
GestureRecognizer.prototype.touchend;
/** @type {(function(MouseEvent): void | undefined)} */
GestureRecognizer.prototype.click;

// keep track of any labels hit by the mouseCanceller
/** @type {!Array<!HTMLLabelElement>} */
const clickedLabels = [];

/** @type {!Object<boolean>} */
const labellable = {
  'button': true,
  'input': true,
  'keygen': true,
  'meter': true,
  'output': true,
  'textarea': true,
  'progress': true,
  'select': true
};

/**
 * @param {HTMLElement} el Element to check labelling status
 * @return {boolean} element can have labels
 */
function canBeLabelled(el) {
  return labellable[el.localName] || false;
}

/**
 * @param {HTMLElement} el Element that may be labelled.
 * @return {!Array<!HTMLLabelElement>} Relevant label for `el`
 */
function matchingLabels(el) {
  let labels = Array.prototype.slice.call(/** @type {HTMLInputElement} */(el).labels || []);
  // IE doesn't have `labels` and Safari doesn't populate `labels`
  // if element is in a shadowroot.
  // In this instance, finding the non-ancestor labels is enough,
  // as the mouseCancellor code will handle ancstor labels
  if (!labels.length) {
    labels = [];
    let root = el.getRootNode();
    // if there is an id on `el`, check for all labels with a matching `for` attribute
    if (el.id) {
      let matching = root.querySelectorAll(`label[for = ${el.id}]`);
      for (let i = 0; i < matching.length; i++) {
        labels.push(/** @type {!HTMLLabelElement} */(matching[i]));
      }
    }
  }
  return labels;
}

// touch will make synthetic mouse events
// `preventDefault` on touchend will cancel them,
// but this breaks `<input>` focus and link clicks
// disable mouse handlers for MOUSE_TIMEOUT ms after
// a touchend to ignore synthetic mouse events
let mouseCanceller = function(mouseEvent) {
  // Check for sourceCapabilities, used to distinguish synthetic events
  // if mouseEvent did not come from a device that fires touch events,
  // it was made by a real mouse and should be counted
  // http://wicg.github.io/InputDeviceCapabilities/#dom-inputdevicecapabilities-firestouchevents
  let sc = mouseEvent.sourceCapabilities;
  if (sc && !sc.firesTouchEvents) {
    return;
  }
  // skip synthetic mouse events
  mouseEvent[HANDLED_OBJ] = {skip: true};
  // disable "ghost clicks"
  if (mouseEvent.type === 'click') {
    let clickFromLabel = false;
    let path = mouseEvent.composedPath && mouseEvent.composedPath();
    if (path) {
      for (let i = 0; i < path.length; i++) {
        if (path[i].nodeType === Node.ELEMENT_NODE) {
          if (path[i].localName === 'label') {
            clickedLabels.push(path[i]);
          } else if (canBeLabelled(path[i])) {
            let ownerLabels = matchingLabels(path[i]);
            // check if one of the clicked labels is labelling this element
            for (let j = 0; j < ownerLabels.length; j++) {
              clickFromLabel = clickFromLabel || clickedLabels.indexOf(ownerLabels[j]) > -1;
            }
          }
        }
        if (path[i] === POINTERSTATE.mouse.target) {
          return;
        }
      }
    }
    // if one of the clicked labels was labelling the target element,
    // this is not a ghost click
    if (clickFromLabel) {
      return;
    }
    mouseEvent.preventDefault();
    mouseEvent.stopPropagation();
  }
};

/**
 * @param {boolean=} setup True to add, false to remove.
 * @return {void}
 */
function setupTeardownMouseCanceller(setup) {
  let events = IS_TOUCH_ONLY ? ['click'] : MOUSE_EVENTS;
  for (let i = 0, en; i < events.length; i++) {
    en = events[i];
    if (setup) {
      // reset clickLabels array
      clickedLabels.length = 0;
      document.addEventListener(en, mouseCanceller, true);
    } else {
      document.removeEventListener(en, mouseCanceller, true);
    }
  }
}

function ignoreMouse(e) {
  if (!POINTERSTATE.mouse.mouseIgnoreJob) {
    setupTeardownMouseCanceller(true);
  }
  let unset = function() {
    setupTeardownMouseCanceller();
    POINTERSTATE.mouse.target = null;
    POINTERSTATE.mouse.mouseIgnoreJob = null;
  };
  POINTERSTATE.mouse.target = e.composedPath()[0];
  POINTERSTATE.mouse.mouseIgnoreJob = _debounce_js__WEBPACK_IMPORTED_MODULE_2__["Debouncer"].debounce(
        POINTERSTATE.mouse.mouseIgnoreJob
      , _async_js__WEBPACK_IMPORTED_MODULE_1__["timeOut"].after(MOUSE_TIMEOUT)
      , unset);
}

/**
 * @param {MouseEvent} ev event to test for left mouse button down
 * @return {boolean} has left mouse button down
 */
function hasLeftMouseButton(ev) {
  let type = ev.type;
  // exit early if the event is not a mouse event
  if (!isMouseEvent(type)) {
    return false;
  }
  // ev.button is not reliable for mousemove (0 is overloaded as both left button and no buttons)
  // instead we use ev.buttons (bitmask of buttons) or fall back to ev.which (deprecated, 0 for no buttons, 1 for left button)
  if (type === 'mousemove') {
    // allow undefined for testing events
    let buttons = ev.buttons === undefined ? 1 : ev.buttons;
    if ((ev instanceof window.MouseEvent) && !MOUSE_HAS_BUTTONS) {
      buttons = MOUSE_WHICH_TO_BUTTONS[ev.which] || 0;
    }
    // buttons is a bitmask, check that the left button bit is set (1)
    return Boolean(buttons & 1);
  } else {
    // allow undefined for testing events
    let button = ev.button === undefined ? 0 : ev.button;
    // ev.button is 0 in mousedown/mouseup/click for left button activation
    return button === 0;
  }
}

function isSyntheticClick(ev) {
  if (ev.type === 'click') {
    // ev.detail is 0 for HTMLElement.click in most browsers
    if (ev.detail === 0) {
      return true;
    }
    // in the worst case, check that the x/y position of the click is within
    // the bounding box of the target of the event
    // Thanks IE 10 >:(
    let t = _findOriginalTarget(ev);
    // make sure the target of the event is an element so we can use getBoundingClientRect,
    // if not, just assume it is a synthetic click
    if (!t.nodeType || /** @type {Element} */(t).nodeType !== Node.ELEMENT_NODE) {
      return true;
    }
    let bcr = /** @type {Element} */(t).getBoundingClientRect();
    // use page x/y to account for scrolling
    let x = ev.pageX, y = ev.pageY;
    // ev is a synthetic click if the position is outside the bounding box of the target
    return !((x >= bcr.left && x <= bcr.right) && (y >= bcr.top && y <= bcr.bottom));
  }
  return false;
}

let POINTERSTATE = {
  mouse: {
    target: null,
    mouseIgnoreJob: null
  },
  touch: {
    x: 0,
    y: 0,
    id: -1,
    scrollDecided: false
  }
};

function firstTouchAction(ev) {
  let ta = 'auto';
  let path = ev.composedPath && ev.composedPath();
  if (path) {
    for (let i = 0, n; i < path.length; i++) {
      n = path[i];
      if (n[TOUCH_ACTION]) {
        ta = n[TOUCH_ACTION];
        break;
      }
    }
  }
  return ta;
}

function trackDocument(stateObj, movefn, upfn) {
  stateObj.movefn = movefn;
  stateObj.upfn = upfn;
  document.addEventListener('mousemove', movefn);
  document.addEventListener('mouseup', upfn);
}

function untrackDocument(stateObj) {
  document.removeEventListener('mousemove', stateObj.movefn);
  document.removeEventListener('mouseup', stateObj.upfn);
  stateObj.movefn = null;
  stateObj.upfn = null;
}

// use a document-wide touchend listener to start the ghost-click prevention mechanism
// Use passive event listeners, if supported, to not affect scrolling performance
document.addEventListener('touchend', ignoreMouse, SUPPORTS_PASSIVE ? {passive: true} : false);

/**
 * Module for adding listeners to a node for the following normalized
 * cross-platform "gesture" events:
 * - `down` - mouse or touch went down
 * - `up` - mouse or touch went up
 * - `tap` - mouse click or finger tap
 * - `track` - mouse drag or touch move
 *
 * @summary Module for adding cross-platform gesture event listeners.
 */
`TODO(modulizer): A namespace named Polymer.Gestures was
declared here. The surrounding comments should be reviewed,
and this string can then be deleted`;

const gestures = {};
const recognizers = [];

/**
 * Finds the element rendered on the screen at the provided coordinates.
 *
 * Similar to `document.elementFromPoint`, but pierces through
 * shadow roots.
 *
 * @param {number} x Horizontal pixel coordinate
 * @param {number} y Vertical pixel coordinate
 * @return {Element} Returns the deepest shadowRoot inclusive element
 * found at the screen position given.
 */
function deepTargetFind(x, y) {
  let node = document.elementFromPoint(x, y);
  let next = node;
  // this code path is only taken when native ShadowDOM is used
  // if there is a shadowroot, it may have a node at x/y
  // if there is not a shadowroot, exit the loop
  while (next && next.shadowRoot && !window.ShadyDOM) {
    // if there is a node at x/y in the shadowroot, look deeper
    let oldNext = next;
    next = next.shadowRoot.elementFromPoint(x, y);
    // on Safari, elementFromPoint may return the shadowRoot host
    if (oldNext === next) {
      break;
    }
    if (next) {
      node = next;
    }
  }
  return node;
}

/**
 * a cheaper check than ev.composedPath()[0];
 *
 * @private
 * @param {Event} ev Event.
 * @return {EventTarget} Returns the event target.
 */
function _findOriginalTarget(ev) {
  // shadowdom
  if (ev.composedPath) {
    const targets = /** @type {!Array<!EventTarget>} */(ev.composedPath());
    // It shouldn't be, but sometimes targets is empty (window on Safari).
    return targets.length > 0 ? targets[0] : ev.target;
  }
  // shadydom
  return ev.target;
}

/**
 * @private
 * @param {Event} ev Event.
 * @return {void}
 */
function _handleNative(ev) {
  let handled;
  let type = ev.type;
  let node = ev.currentTarget;
  let gobj = node[GESTURE_KEY];
  if (!gobj) {
    return;
  }
  let gs = gobj[type];
  if (!gs) {
    return;
  }
  if (!ev[HANDLED_OBJ]) {
    ev[HANDLED_OBJ] = {};
    if (type.slice(0, 5) === 'touch') {
      ev = /** @type {TouchEvent} */(ev); // eslint-disable-line no-self-assign
      let t = ev.changedTouches[0];
      if (type === 'touchstart') {
        // only handle the first finger
        if (ev.touches.length === 1) {
          POINTERSTATE.touch.id = t.identifier;
        }
      }
      if (POINTERSTATE.touch.id !== t.identifier) {
        return;
      }
      if (!HAS_NATIVE_TA) {
        if (type === 'touchstart' || type === 'touchmove') {
          _handleTouchAction(ev);
        }
      }
    }
  }
  handled = ev[HANDLED_OBJ];
  // used to ignore synthetic mouse events
  if (handled.skip) {
    return;
  }
  // reset recognizer state
  for (let i = 0, r; i < recognizers.length; i++) {
    r = recognizers[i];
    if (gs[r.name] && !handled[r.name]) {
      if (r.flow && r.flow.start.indexOf(ev.type) > -1 && r.reset) {
        r.reset();
      }
    }
  }
  // enforce gesture recognizer order
  for (let i = 0, r; i < recognizers.length; i++) {
    r = recognizers[i];
    if (gs[r.name] && !handled[r.name]) {
      handled[r.name] = true;
      r[type](ev);
    }
  }
}

/**
 * @private
 * @param {TouchEvent} ev Event.
 * @return {void}
 */
function _handleTouchAction(ev) {
  let t = ev.changedTouches[0];
  let type = ev.type;
  if (type === 'touchstart') {
    POINTERSTATE.touch.x = t.clientX;
    POINTERSTATE.touch.y = t.clientY;
    POINTERSTATE.touch.scrollDecided = false;
  } else if (type === 'touchmove') {
    if (POINTERSTATE.touch.scrollDecided) {
      return;
    }
    POINTERSTATE.touch.scrollDecided = true;
    let ta = firstTouchAction(ev);
    let prevent = false;
    let dx = Math.abs(POINTERSTATE.touch.x - t.clientX);
    let dy = Math.abs(POINTERSTATE.touch.y - t.clientY);
    if (!ev.cancelable) {
      // scrolling is happening
    } else if (ta === 'none') {
      prevent = true;
    } else if (ta === 'pan-x') {
      prevent = dy > dx;
    } else if (ta === 'pan-y') {
      prevent = dx > dy;
    }
    if (prevent) {
      ev.preventDefault();
    } else {
      prevent('track');
    }
  }
}

/**
 * Adds an event listener to a node for the given gesture type.
 *
 * @param {!Node} node Node to add listener on
 * @param {string} evType Gesture type: `down`, `up`, `track`, or `tap`
 * @param {!function(!Event):void} handler Event listener function to call
 * @return {boolean} Returns true if a gesture event listener was added.
 * @this {Gestures}
 */
function addListener(node, evType, handler) {
  if (gestures[evType]) {
    _add(node, evType, handler);
    return true;
  }
  return false;
}

/**
 * Removes an event listener from a node for the given gesture type.
 *
 * @param {!Node} node Node to remove listener from
 * @param {string} evType Gesture type: `down`, `up`, `track`, or `tap`
 * @param {!function(!Event):void} handler Event listener function previously passed to
 *  `addListener`.
 * @return {boolean} Returns true if a gesture event listener was removed.
 * @this {Gestures}
 */
function removeListener(node, evType, handler) {
  if (gestures[evType]) {
    _remove(node, evType, handler);
    return true;
  }
  return false;
}

/**
 * automate the event listeners for the native events
 *
 * @private
 * @param {!HTMLElement} node Node on which to add the event.
 * @param {string} evType Event type to add.
 * @param {function(!Event)} handler Event handler function.
 * @return {void}
 * @this {Gestures}
 */
function _add(node, evType, handler) {
  let recognizer = gestures[evType];
  let deps = recognizer.deps;
  let name = recognizer.name;
  let gobj = node[GESTURE_KEY];
  if (!gobj) {
    node[GESTURE_KEY] = gobj = {};
  }
  for (let i = 0, dep, gd; i < deps.length; i++) {
    dep = deps[i];
    // don't add mouse handlers on iOS because they cause gray selection overlays
    if (IS_TOUCH_ONLY && isMouseEvent(dep) && dep !== 'click') {
      continue;
    }
    gd = gobj[dep];
    if (!gd) {
      gobj[dep] = gd = {_count: 0};
    }
    if (gd._count === 0) {
      node.addEventListener(dep, _handleNative, PASSIVE_TOUCH(dep));
    }
    gd[name] = (gd[name] || 0) + 1;
    gd._count = (gd._count || 0) + 1;
  }
  node.addEventListener(evType, handler);
  if (recognizer.touchAction) {
    setTouchAction(node, recognizer.touchAction);
  }
}

/**
 * automate event listener removal for native events
 *
 * @private
 * @param {!HTMLElement} node Node on which to remove the event.
 * @param {string} evType Event type to remove.
 * @param {function(Event?)} handler Event handler function.
 * @return {void}
 * @this {Gestures}
 */
function _remove(node, evType, handler) {
  let recognizer = gestures[evType];
  let deps = recognizer.deps;
  let name = recognizer.name;
  let gobj = node[GESTURE_KEY];
  if (gobj) {
    for (let i = 0, dep, gd; i < deps.length; i++) {
      dep = deps[i];
      gd = gobj[dep];
      if (gd && gd[name]) {
        gd[name] = (gd[name] || 1) - 1;
        gd._count = (gd._count || 1) - 1;
        if (gd._count === 0) {
          node.removeEventListener(dep, _handleNative, PASSIVE_TOUCH(dep));
        }
      }
    }
  }
  node.removeEventListener(evType, handler);
}

/**
 * Registers a new gesture event recognizer for adding new custom
 * gesture event types.
 *
 * @param {!GestureRecognizer} recog Gesture recognizer descriptor
 * @return {void}
 * @this {Gestures}
 */
function register(recog) {
  recognizers.push(recog);
  for (let i = 0; i < recog.emits.length; i++) {
    gestures[recog.emits[i]] = recog;
  }
}

/**
 * @private
 * @param {string} evName Event name.
 * @return {Object} Returns the gesture for the given event name.
 * @this {Gestures}
 */
function _findRecognizerByEvent(evName) {
  for (let i = 0, r; i < recognizers.length; i++) {
    r = recognizers[i];
    for (let j = 0, n; j < r.emits.length; j++) {
      n = r.emits[j];
      if (n === evName) {
        return r;
      }
    }
  }
  return null;
}

/**
 * Sets scrolling direction on node.
 *
 * This value is checked on first move, thus it should be called prior to
 * adding event listeners.
 *
 * @param {!Element} node Node to set touch action setting on
 * @param {string} value Touch action value
 * @return {void}
 */
function setTouchAction(node, value) {
  if (HAS_NATIVE_TA) {
    // NOTE: add touchAction async so that events can be added in
    // custom element constructors. Otherwise we run afoul of custom
    // elements restriction against settings attributes (style) in the
    // constructor.
    _async_js__WEBPACK_IMPORTED_MODULE_1__["microTask"].run(() => {
      node.style.touchAction = value;
    });
  }
  node[TOUCH_ACTION] = value;
}

/**
 * Dispatches an event on the `target` element of `type` with the given
 * `detail`.
 * @private
 * @param {!EventTarget} target The element on which to fire an event.
 * @param {string} type The type of event to fire.
 * @param {!Object=} detail The detail object to populate on the event.
 * @return {void}
 */
function _fire(target, type, detail) {
  let ev = new Event(type, { bubbles: true, cancelable: true, composed: true });
  ev.detail = detail;
  target.dispatchEvent(ev);
  // forward `preventDefault` in a clean way
  if (ev.defaultPrevented) {
    let preventer = detail.preventer || detail.sourceEvent;
    if (preventer && preventer.preventDefault) {
      preventer.preventDefault();
    }
  }
}

/**
 * Prevents the dispatch and default action of the given event name.
 *
 * @param {string} evName Event name.
 * @return {void}
 * @this {Gestures}
 */
function prevent(evName) {
  let recognizer = _findRecognizerByEvent(evName);
  if (recognizer.info) {
    recognizer.info.prevent = true;
  }
}

/**
 * Reset the 2500ms timeout on processing mouse input after detecting touch input.
 *
 * Touch inputs create synthesized mouse inputs anywhere from 0 to 2000ms after the touch.
 * This method should only be called during testing with simulated touch inputs.
 * Calling this method in production may cause duplicate taps or other Gestures.
 *
 * @return {void}
 */
function resetMouseCanceller() {
  if (POINTERSTATE.mouse.mouseIgnoreJob) {
    POINTERSTATE.mouse.mouseIgnoreJob.flush();
  }
}

/* eslint-disable valid-jsdoc */

register({
  name: 'downup',
  deps: ['mousedown', 'touchstart', 'touchend'],
  flow: {
    start: ['mousedown', 'touchstart'],
    end: ['mouseup', 'touchend']
  },
  emits: ['down', 'up'],

  info: {
    movefn: null,
    upfn: null
  },

  /**
   * @this {GestureRecognizer}
   * @return {void}
   */
  reset: function() {
    untrackDocument(this.info);
  },

  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  mousedown: function(e) {
    if (!hasLeftMouseButton(e)) {
      return;
    }
    let t = _findOriginalTarget(e);
    let self = this;
    let movefn = function movefn(e) {
      if (!hasLeftMouseButton(e)) {
        self._fire('up', t, e);
        untrackDocument(self.info);
      }
    };
    let upfn = function upfn(e) {
      if (hasLeftMouseButton(e)) {
        self._fire('up', t, e);
      }
      untrackDocument(self.info);
    };
    trackDocument(this.info, movefn, upfn);
    this._fire('down', t, e);
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchstart: function(e) {
    this._fire('down', _findOriginalTarget(e), e.changedTouches[0], e);
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchend: function(e) {
    this._fire('up', _findOriginalTarget(e), e.changedTouches[0], e);
  },
  /**
   * @param {string} type
   * @param {!EventTarget} target
   * @param {Event} event
   * @param {Function} preventer
   * @return {void}
   */
  _fire: function(type, target, event, preventer) {
    _fire(target, type, {
      x: event.clientX,
      y: event.clientY,
      sourceEvent: event,
      preventer: preventer,
      prevent: function(e) {
        return prevent(e);
      }
    });
  }
});

register({
  name: 'track',
  touchAction: 'none',
  deps: ['mousedown', 'touchstart', 'touchmove', 'touchend'],
  flow: {
    start: ['mousedown', 'touchstart'],
    end: ['mouseup', 'touchend']
  },
  emits: ['track'],

  info: {
    x: 0,
    y: 0,
    state: 'start',
    started: false,
    moves: [],
    /** @this {GestureRecognizer} */
    addMove: function(move) {
      if (this.moves.length > TRACK_LENGTH) {
        this.moves.shift();
      }
      this.moves.push(move);
    },
    movefn: null,
    upfn: null,
    prevent: false
  },

  /**
   * @this {GestureRecognizer}
   * @return {void}
   */
  reset: function() {
    this.info.state = 'start';
    this.info.started = false;
    this.info.moves = [];
    this.info.x = 0;
    this.info.y = 0;
    this.info.prevent = false;
    untrackDocument(this.info);
  },

  /**
   * @this {GestureRecognizer}
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  hasMovedEnough: function(x, y) {
    if (this.info.prevent) {
      return false;
    }
    if (this.info.started) {
      return true;
    }
    let dx = Math.abs(this.info.x - x);
    let dy = Math.abs(this.info.y - y);
    return (dx >= TRACK_DISTANCE || dy >= TRACK_DISTANCE);
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  mousedown: function(e) {
    if (!hasLeftMouseButton(e)) {
      return;
    }
    let t = _findOriginalTarget(e);
    let self = this;
    let movefn = function movefn(e) {
      let x = e.clientX, y = e.clientY;
      if (self.hasMovedEnough(x, y)) {
        // first move is 'start', subsequent moves are 'move', mouseup is 'end'
        self.info.state = self.info.started ? (e.type === 'mouseup' ? 'end' : 'track') : 'start';
        if (self.info.state === 'start') {
          // if and only if tracking, always prevent tap
          prevent('tap');
        }
        self.info.addMove({x: x, y: y});
        if (!hasLeftMouseButton(e)) {
          // always _fire "end"
          self.info.state = 'end';
          untrackDocument(self.info);
        }
        self._fire(t, e);
        self.info.started = true;
      }
    };
    let upfn = function upfn(e) {
      if (self.info.started) {
        movefn(e);
      }

      // remove the temporary listeners
      untrackDocument(self.info);
    };
    // add temporary document listeners as mouse retargets
    trackDocument(this.info, movefn, upfn);
    this.info.x = e.clientX;
    this.info.y = e.clientY;
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchstart: function(e) {
    let ct = e.changedTouches[0];
    this.info.x = ct.clientX;
    this.info.y = ct.clientY;
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchmove: function(e) {
    let t = _findOriginalTarget(e);
    let ct = e.changedTouches[0];
    let x = ct.clientX, y = ct.clientY;
    if (this.hasMovedEnough(x, y)) {
      if (this.info.state === 'start') {
        // if and only if tracking, always prevent tap
        prevent('tap');
      }
      this.info.addMove({x: x, y: y});
      this._fire(t, ct);
      this.info.state = 'track';
      this.info.started = true;
    }
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchend: function(e) {
    let t = _findOriginalTarget(e);
    let ct = e.changedTouches[0];
    // only trackend if track was started and not aborted
    if (this.info.started) {
      // reset started state on up
      this.info.state = 'end';
      this.info.addMove({x: ct.clientX, y: ct.clientY});
      this._fire(t, ct, e);
    }
  },

  /**
   * @this {GestureRecognizer}
   * @param {!EventTarget} target
   * @param {Touch} touch
   * @return {void}
   */
  _fire: function(target, touch) {
    let secondlast = this.info.moves[this.info.moves.length - 2];
    let lastmove = this.info.moves[this.info.moves.length - 1];
    let dx = lastmove.x - this.info.x;
    let dy = lastmove.y - this.info.y;
    let ddx, ddy = 0;
    if (secondlast) {
      ddx = lastmove.x - secondlast.x;
      ddy = lastmove.y - secondlast.y;
    }
    _fire(target, 'track', {
      state: this.info.state,
      x: touch.clientX,
      y: touch.clientY,
      dx: dx,
      dy: dy,
      ddx: ddx,
      ddy: ddy,
      sourceEvent: touch,
      hover: function() {
        return deepTargetFind(touch.clientX, touch.clientY);
      }
    });
  }

});

register({
  name: 'tap',
  deps: ['mousedown', 'click', 'touchstart', 'touchend'],
  flow: {
    start: ['mousedown', 'touchstart'],
    end: ['click', 'touchend']
  },
  emits: ['tap'],
  info: {
    x: NaN,
    y: NaN,
    prevent: false
  },
  /**
   * @this {GestureRecognizer}
   * @return {void}
   */
  reset: function() {
    this.info.x = NaN;
    this.info.y = NaN;
    this.info.prevent = false;
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  save: function(e) {
    this.info.x = e.clientX;
    this.info.y = e.clientY;
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  mousedown: function(e) {
    if (hasLeftMouseButton(e)) {
      this.save(e);
    }
  },
  /**
   * @this {GestureRecognizer}
   * @param {MouseEvent} e
   * @return {void}
   */
  click: function(e) {
    if (hasLeftMouseButton(e)) {
      this.forward(e);
    }
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchstart: function(e) {
    this.save(e.changedTouches[0], e);
  },
  /**
   * @this {GestureRecognizer}
   * @param {TouchEvent} e
   * @return {void}
   */
  touchend: function(e) {
    this.forward(e.changedTouches[0], e);
  },
  /**
   * @this {GestureRecognizer}
   * @param {Event | Touch} e
   * @param {Event=} preventer
   * @return {void}
   */
  forward: function(e, preventer) {
    let dx = Math.abs(e.clientX - this.info.x);
    let dy = Math.abs(e.clientY - this.info.y);
    // find original target from `preventer` for TouchEvents, or `e` for MouseEvents
    let t = _findOriginalTarget((preventer || e));
    if (!t || t.disabled) {
      return;
    }
    // dx,dy can be NaN if `click` has been simulated and there was no `down` for `start`
    if (isNaN(dx) || isNaN(dy) || (dx <= TAP_DISTANCE && dy <= TAP_DISTANCE) || isSyntheticClick(e)) {
      // prevent taps from being generated if an event has canceled them
      if (!this.info.prevent) {
        _fire(t, 'tap', {
          x: e.clientX,
          y: e.clientY,
          sourceEvent: e,
          preventer: preventer
        });
      }
    }
  }
});

/* eslint-enable valid-jsdoc */

/** @deprecated */
const findOriginalTarget = _findOriginalTarget;

/** @deprecated */
const add = addListener;

/** @deprecated */
const remove = removeListener;


/***/ }),

/***/ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/templatize.js":
/*!******************************************************************************!*\
  !*** ./dynamic-slider/node_modules/@polymer/polymer/lib/utils/templatize.js ***!
  \******************************************************************************/
/*! exports provided: templatize, modelForElement, TemplateInstanceBase */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "templatize", function() { return templatize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "modelForElement", function() { return modelForElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TemplateInstanceBase", function() { return TemplateInstanceBase; });
/* harmony import */ var _boot_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./boot.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/utils/boot.js");
/* harmony import */ var _boot_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_boot_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _mixins_property_effects_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../mixins/property-effects.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/mixins/property-effects.js");
/* harmony import */ var _mixins_mutable_data_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../mixins/mutable-data.js */ "./dynamic-slider/node_modules/@polymer/polymer/lib/mixins/mutable-data.js");
/**
@license
Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/





// Base class for HTMLTemplateElement extension that has property effects
// machinery for propagating host properties to children. This is an ES5
// class only because Babel (incorrectly) requires super() in the class
// constructor even though no `this` is used and it returns an instance.
let newInstance = null;
/**
 * @constructor
 * @extends {HTMLTemplateElement}
 */
function HTMLTemplateElementExtension() { return newInstance; }
HTMLTemplateElementExtension.prototype = Object.create(HTMLTemplateElement.prototype, {
  constructor: {
    value: HTMLTemplateElementExtension,
    writable: true
  }
});
/**
 * @constructor
 * @implements {Polymer_PropertyEffects}
 * @extends {HTMLTemplateElementExtension}
 */
const DataTemplate = Object(_mixins_property_effects_js__WEBPACK_IMPORTED_MODULE_1__["PropertyEffects"])(HTMLTemplateElementExtension);
/**
 * @constructor
 * @implements {Polymer_MutableData}
 * @extends {DataTemplate}
 */
const MutableDataTemplate = Object(_mixins_mutable_data_js__WEBPACK_IMPORTED_MODULE_2__["MutableData"])(DataTemplate);

// Applies a DataTemplate subclass to a <template> instance
function upgradeTemplate(template, constructor) {
  newInstance = template;
  Object.setPrototypeOf(template, constructor.prototype);
  new constructor();
  newInstance = null;
}

// Base class for TemplateInstance's
/**
 * @constructor
 * @implements {Polymer_PropertyEffects}
 */
const base = Object(_mixins_property_effects_js__WEBPACK_IMPORTED_MODULE_1__["PropertyEffects"])(class {});

/**
 * @polymer
 * @customElement
 * @appliesMixin PropertyEffects
 * @unrestricted
 */
class TemplateInstanceBase extends base {
  constructor(props) {
    super();
    this._configureProperties(props);
    this.root = this._stampTemplate(this.__dataHost);
    // Save list of stamped children
    let children = this.children = [];
    for (let n = this.root.firstChild; n; n=n.nextSibling) {
      children.push(n);
      n.__templatizeInstance = this;
    }
    if (this.__templatizeOwner &&
      this.__templatizeOwner.__hideTemplateChildren__) {
      this._showHideChildren(true);
    }
    // Flush props only when props are passed if instance props exist
    // or when there isn't instance props.
    let options = this.__templatizeOptions;
    if ((props && options.instanceProps) || !options.instanceProps) {
      this._enableProperties();
    }
  }
  /**
   * Configure the given `props` by calling `_setPendingProperty`. Also
   * sets any properties stored in `__hostProps`.
   * @private
   * @param {Object} props Object of property name-value pairs to set.
   * @return {void}
   */
  _configureProperties(props) {
    let options = this.__templatizeOptions;
    if (options.forwardHostProp) {
      for (let hprop in this.__hostProps) {
        this._setPendingProperty(hprop, this.__dataHost['_host_' + hprop]);
      }
    }
    // Any instance props passed in the constructor will overwrite host props;
    // normally this would be a user error but we don't specifically filter them
    for (let iprop in props) {
      this._setPendingProperty(iprop, props[iprop]);
    }
  }
  /**
   * Forwards a host property to this instance.  This method should be
   * called on instances from the `options.forwardHostProp` callback
   * to propagate changes of host properties to each instance.
   *
   * Note this method enqueues the change, which are flushed as a batch.
   *
   * @param {string} prop Property or path name
   * @param {*} value Value of the property to forward
   * @return {void}
   */
  forwardHostProp(prop, value) {
    if (this._setPendingPropertyOrPath(prop, value, false, true)) {
      this.__dataHost._enqueueClient(this);
    }
  }

  /**
   * Override point for adding custom or simulated event handling.
   *
   * @param {!Node} node Node to add event listener to
   * @param {string} eventName Name of event
   * @param {function(!Event):void} handler Listener function to add
   * @return {void}
   */
  _addEventListenerToNode(node, eventName, handler) {
    if (this._methodHost && this.__templatizeOptions.parentModel) {
      // If this instance should be considered a parent model, decorate
      // events this template instance as `model`
      this._methodHost._addEventListenerToNode(node, eventName, (e) => {
        e.model = this;
        handler(e);
      });
    } else {
      // Otherwise delegate to the template's host (which could be)
      // another template instance
      let templateHost = this.__dataHost.__dataHost;
      if (templateHost) {
        templateHost._addEventListenerToNode(node, eventName, handler);
      }
    }
  }
  /**
   * Shows or hides the template instance top level child elements. For
   * text nodes, `textContent` is removed while "hidden" and replaced when
   * "shown."
   * @param {boolean} hide Set to true to hide the children;
   * set to false to show them.
   * @return {void}
   * @protected
   */
  _showHideChildren(hide) {
    let c = this.children;
    for (let i=0; i<c.length; i++) {
      let n = c[i];
      // Ignore non-changes
      if (Boolean(hide) != Boolean(n.__hideTemplateChildren__)) {
        if (n.nodeType === Node.TEXT_NODE) {
          if (hide) {
            n.__polymerTextContent__ = n.textContent;
            n.textContent = '';
          } else {
            n.textContent = n.__polymerTextContent__;
          }
        // remove and replace slot
        } else if (n.localName === 'slot') {
          if (hide) {
            n.__polymerReplaced__ = document.createComment('hidden-slot');
            n.parentNode.replaceChild(n.__polymerReplaced__, n);
          } else {
            const replace = n.__polymerReplaced__;
            if (replace) {
              replace.parentNode.replaceChild(n, replace);
            }
          }
        }

        else if (n.style) {
          if (hide) {
            n.__polymerDisplay__ = n.style.display;
            n.style.display = 'none';
          } else {
            n.style.display = n.__polymerDisplay__;
          }
        }
      }
      n.__hideTemplateChildren__ = hide;
      if (n._showHideChildren) {
        n._showHideChildren(hide);
      }
    }
  }
  /**
   * Overrides default property-effects implementation to intercept
   * textContent bindings while children are "hidden" and cache in
   * private storage for later retrieval.
   *
   * @param {!Node} node The node to set a property on
   * @param {string} prop The property to set
   * @param {*} value The value to set
   * @return {void}
   * @protected
   */
  _setUnmanagedPropertyToNode(node, prop, value) {
    if (node.__hideTemplateChildren__ &&
        node.nodeType == Node.TEXT_NODE && prop == 'textContent') {
      node.__polymerTextContent__ = value;
    } else {
      super._setUnmanagedPropertyToNode(node, prop, value);
    }
  }
  /**
   * Find the parent model of this template instance.  The parent model
   * is either another templatize instance that had option `parentModel: true`,
   * or else the host element.
   *
   * @return {!Polymer_PropertyEffects} The parent model of this instance
   */
  get parentModel() {
    let model = this.__parentModel;
    if (!model) {
      let options;
      model = this;
      do {
        // A template instance's `__dataHost` is a <template>
        // `model.__dataHost.__dataHost` is the template's host
        model = model.__dataHost.__dataHost;
      } while ((options = model.__templatizeOptions) && !options.parentModel);
      this.__parentModel = model;
    }
    return model;
  }

  /**
   * Stub of HTMLElement's `dispatchEvent`, so that effects that may
   * dispatch events safely no-op.
   *
   * @param {Event} event Event to dispatch
   * @return {boolean} Always true.
   */
   dispatchEvent(event) { // eslint-disable-line no-unused-vars
     return true;
  }
}

/** @type {!DataTemplate} */
TemplateInstanceBase.prototype.__dataHost;
/** @type {!TemplatizeOptions} */
TemplateInstanceBase.prototype.__templatizeOptions;
/** @type {!Polymer_PropertyEffects} */
TemplateInstanceBase.prototype._methodHost;
/** @type {!Object} */
TemplateInstanceBase.prototype.__templatizeOwner;
/** @type {!Object} */
TemplateInstanceBase.prototype.__hostProps;

/**
 * @constructor
 * @extends {TemplateInstanceBase}
 * @implements {Polymer_MutableData}
 */
const MutableTemplateInstanceBase = Object(_mixins_mutable_data_js__WEBPACK_IMPORTED_MODULE_2__["MutableData"])(TemplateInstanceBase);

function findMethodHost(template) {
  // Technically this should be the owner of the outermost template.
  // In shadow dom, this is always getRootNode().host, but we can
  // approximate this via cooperation with our dataHost always setting
  // `_methodHost` as long as there were bindings (or id's) on this
  // instance causing it to get a dataHost.
  let templateHost = template.__dataHost;
  return templateHost && templateHost._methodHost || templateHost;
}

/* eslint-disable valid-jsdoc */
/**
 * @suppress {missingProperties} class.prototype is not defined for some reason
 */
function createTemplatizerClass(template, templateInfo, options) {
  // Anonymous class created by the templatize
  let base = options.mutableData ?
    MutableTemplateInstanceBase : TemplateInstanceBase;
  /**
   * @constructor
   * @extends {base}
   * @private
   */
  let klass = class extends base { };
  klass.prototype.__templatizeOptions = options;
  klass.prototype._bindTemplate(template);
  addNotifyEffects(klass, template, templateInfo, options);
  return klass;
}

/**
 * @suppress {missingProperties} class.prototype is not defined for some reason
 */
function addPropagateEffects(template, templateInfo, options) {
  let userForwardHostProp = options.forwardHostProp;
  if (userForwardHostProp) {
    // Provide data API and property effects on memoized template class
    let klass = templateInfo.templatizeTemplateClass;
    if (!klass) {
      let base = options.mutableData ? MutableDataTemplate : DataTemplate;
      klass = templateInfo.templatizeTemplateClass =
        class TemplatizedTemplate extends base {};
      // Add template - >instances effects
      // and host <- template effects
      let hostProps = templateInfo.hostProps;
      for (let prop in hostProps) {
        klass.prototype._addPropertyEffect('_host_' + prop,
          klass.prototype.PROPERTY_EFFECT_TYPES.PROPAGATE,
          {fn: createForwardHostPropEffect(prop, userForwardHostProp)});
        klass.prototype._createNotifyingProperty('_host_' + prop);
      }
    }
    upgradeTemplate(template, klass);
    // Mix any pre-bound data into __data; no need to flush this to
    // instances since they pull from the template at instance-time
    if (template.__dataProto) {
      // Note, generally `__dataProto` could be chained, but it's guaranteed
      // to not be since this is a vanilla template we just added effects to
      Object.assign(template.__data, template.__dataProto);
    }
    // Clear any pending data for performance
    template.__dataTemp = {};
    template.__dataPending = null;
    template.__dataOld = null;
    template._enableProperties();
  }
}
/* eslint-enable valid-jsdoc */

function createForwardHostPropEffect(hostProp, userForwardHostProp) {
  return function forwardHostProp(template, prop, props) {
    userForwardHostProp.call(template.__templatizeOwner,
      prop.substring('_host_'.length), props[prop]);
  };
}

function addNotifyEffects(klass, template, templateInfo, options) {
  let hostProps = templateInfo.hostProps || {};
  for (let iprop in options.instanceProps) {
    delete hostProps[iprop];
    let userNotifyInstanceProp = options.notifyInstanceProp;
    if (userNotifyInstanceProp) {
      klass.prototype._addPropertyEffect(iprop,
        klass.prototype.PROPERTY_EFFECT_TYPES.NOTIFY,
        {fn: createNotifyInstancePropEffect(iprop, userNotifyInstanceProp)});
    }
  }
  if (options.forwardHostProp && template.__dataHost) {
    for (let hprop in hostProps) {
      klass.prototype._addPropertyEffect(hprop,
        klass.prototype.PROPERTY_EFFECT_TYPES.NOTIFY,
        {fn: createNotifyHostPropEffect()});
    }
  }
}

function createNotifyInstancePropEffect(instProp, userNotifyInstanceProp) {
  return function notifyInstanceProp(inst, prop, props) {
    userNotifyInstanceProp.call(inst.__templatizeOwner,
      inst, prop, props[prop]);
  };
}

function createNotifyHostPropEffect() {
  return function notifyHostProp(inst, prop, props) {
    inst.__dataHost._setPendingPropertyOrPath('_host_' + prop, props[prop], true, true);
  };
}

/**
 * Module for preparing and stamping instances of templates that utilize
 * Polymer's data-binding and declarative event listener features.
 *
 * Example:
 *
 *     // Get a template from somewhere, e.g. light DOM
 *     let template = this.querySelector('template');
 *     // Prepare the template
 *     let TemplateClass = Templatize.templatize(template);
 *     // Instance the template with an initial data model
 *     let instance = new TemplateClass({myProp: 'initial'});
 *     // Insert the instance's DOM somewhere, e.g. element's shadow DOM
 *     this.shadowRoot.appendChild(instance.root);
 *     // Changing a property on the instance will propagate to bindings
 *     // in the template
 *     instance.myProp = 'new value';
 *
 * The `options` dictionary passed to `templatize` allows for customizing
 * features of the generated template class, including how outer-scope host
 * properties should be forwarded into template instances, how any instance
 * properties added into the template's scope should be notified out to
 * the host, and whether the instance should be decorated as a "parent model"
 * of any event handlers.
 *
 *     // Customize property forwarding and event model decoration
 *     let TemplateClass = Templatize.templatize(template, this, {
 *       parentModel: true,
 *       forwardHostProp(property, value) {...},
 *       instanceProps: {...},
 *       notifyInstanceProp(instance, property, value) {...},
 *     });
 *
 * @summary Module for preparing and stamping instances of templates
 *   utilizing Polymer templating features.
 */
`TODO(modulizer): A namespace named Polymer.Templatize was
declared here. The surrounding comments should be reviewed,
and this string can then be deleted`;

/**
 * Returns an anonymous `PropertyEffects` class bound to the
 * `<template>` provided.  Instancing the class will result in the
 * template being stamped into a document fragment stored as the instance's
 * `root` property, after which it can be appended to the DOM.
 *
 * Templates may utilize all Polymer data-binding features as well as
 * declarative event listeners.  Event listeners and inline computing
 * functions in the template will be called on the host of the template.
 *
 * The constructor returned takes a single argument dictionary of initial
 * property values to propagate into template bindings.  Additionally
 * host properties can be forwarded in, and instance properties can be
 * notified out by providing optional callbacks in the `options` dictionary.
 *
 * Valid configuration in `options` are as follows:
 *
 * - `forwardHostProp(property, value)`: Called when a property referenced
 *   in the template changed on the template's host. As this library does
 *   not retain references to templates instanced by the user, it is the
 *   templatize owner's responsibility to forward host property changes into
 *   user-stamped instances.  The `instance.forwardHostProp(property, value)`
 *    method on the generated class should be called to forward host
 *   properties into the template to prevent unnecessary property-changed
 *   notifications. Any properties referenced in the template that are not
 *   defined in `instanceProps` will be notified up to the template's host
 *   automatically.
 * - `instanceProps`: Dictionary of property names that will be added
 *   to the instance by the templatize owner.  These properties shadow any
 *   host properties, and changes within the template to these properties
 *   will result in `notifyInstanceProp` being called.
 * - `mutableData`: When `true`, the generated class will skip strict
 *   dirty-checking for objects and arrays (always consider them to be
 *   "dirty").
 * - `notifyInstanceProp(instance, property, value)`: Called when
 *   an instance property changes.  Users may choose to call `notifyPath`
 *   on e.g. the owner to notify the change.
 * - `parentModel`: When `true`, events handled by declarative event listeners
 *   (`on-event="handler"`) will be decorated with a `model` property pointing
 *   to the template instance that stamped it.  It will also be returned
 *   from `instance.parentModel` in cases where template instance nesting
 *   causes an inner model to shadow an outer model.
 *
 * All callbacks are called bound to the `owner`. Any context
 * needed for the callbacks (such as references to `instances` stamped)
 * should be stored on the `owner` such that they can be retrieved via
 * `this`.
 *
 * When `options.forwardHostProp` is declared as an option, any properties
 * referenced in the template will be automatically forwarded from the host of
 * the `<template>` to instances, with the exception of any properties listed in
 * the `options.instanceProps` object.  `instanceProps` are assumed to be
 * managed by the owner of the instances, either passed into the constructor
 * or set after the fact.  Note, any properties passed into the constructor will
 * always be set to the instance (regardless of whether they would normally
 * be forwarded from the host).
 *
 * Note that `templatize()` can be run only once for a given `<template>`.
 * Further calls will result in an error. Also, there is a special
 * behavior if the template was duplicated through a mechanism such as
 * `<dom-repeat>` or `<test-fixture>`. In this case, all calls to
 * `templatize()` return the same class for all duplicates of a template.
 * The class returned from `templatize()` is generated only once using
 * the `options` from the first call. This means that any `options`
 * provided to subsequent calls will be ignored. Therefore, it is very
 * important not to close over any variables inside the callbacks. Also,
 * arrow functions must be avoided because they bind the outer `this`.
 * Inside the callbacks, any contextual information can be accessed
 * through `this`, which points to the `owner`.
 *
 * @param {!HTMLTemplateElement} template Template to templatize
 * @param {Polymer_PropertyEffects=} owner Owner of the template instances;
 *   any optional callbacks will be bound to this owner.
 * @param {Object=} options Options dictionary (see summary for details)
 * @return {function(new:TemplateInstanceBase)} Generated class bound to the template
 *   provided
 * @suppress {invalidCasts}
 */
function templatize(template, owner, options) {
  options = /** @type {!TemplatizeOptions} */(options || {});
  if (template.__templatizeOwner) {
    throw new Error('A <template> can only be templatized once');
  }
  template.__templatizeOwner = owner;
  const ctor = owner ? owner.constructor : TemplateInstanceBase;
  let templateInfo = ctor._parseTemplate(template);
  // Get memoized base class for the prototypical template, which
  // includes property effects for binding template & forwarding
  let baseClass = templateInfo.templatizeInstanceClass;
  if (!baseClass) {
    baseClass = createTemplatizerClass(template, templateInfo, options);
    templateInfo.templatizeInstanceClass = baseClass;
  }
  // Host property forwarding must be installed onto template instance
  addPropagateEffects(template, templateInfo, options);
  // Subclass base class and add reference for this specific template
  /** @private */
  let klass = class TemplateInstance extends baseClass {};
  klass.prototype._methodHost = findMethodHost(template);
  klass.prototype.__dataHost = template;
  klass.prototype.__templatizeOwner = owner;
  klass.prototype.__hostProps = templateInfo.hostProps;
  klass = /** @type {function(new:TemplateInstanceBase)} */(klass); //eslint-disable-line no-self-assign
  return klass;
}

/**
 * Returns the template "model" associated with a given element, which
 * serves as the binding scope for the template instance the element is
 * contained in. A template model is an instance of
 * `TemplateInstanceBase`, and should be used to manipulate data
 * associated with this template instance.
 *
 * Example:
 *
 *   let model = modelForElement(el);
 *   if (model.index < 10) {
 *     model.set('item.checked', true);
 *   }
 *
 * @param {HTMLTemplateElement} template The model will be returned for
 *   elements stamped from this template
 * @param {Node=} node Node for which to return a template model.
 * @return {TemplateInstanceBase} Template instance representing the
 *   binding scope for the element
 */
function modelForElement(template, node) {
  let model;
  while (node) {
    // An element with a __templatizeInstance marks the top boundary
    // of a scope; walk up until we find one, and then ensure that
    // its __dataHost matches `this`, meaning this dom-repeat stamped it
    if ((model = node.__templatizeInstance)) {
      // Found an element stamped by another template; keep walking up
      // from its __dataHost
      if (model.__dataHost != template) {
        node = model.__dataHost;
      } else {
        return model;
      }
    } else {
      // Still in a template scope, keep going up until
      // a __templatizeInstance is found
      node = node.parentNode;
    }
  }
  return null;
}




/***/ }),

/***/ "./dynamic-slider/node_modules/babel-runtime/core-js/number/is-nan.js":
/*!****************************************************************************!*\
  !*** ./dynamic-slider/node_modules/babel-runtime/core-js/number/is-nan.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/number/is-nan */ "./dynamic-slider/node_modules/core-js/library/fn/number/is-nan.js"), __esModule: true };

/***/ }),

/***/ "./dynamic-slider/node_modules/babel-runtime/core-js/object/assign.js":
/*!****************************************************************************!*\
  !*** ./dynamic-slider/node_modules/babel-runtime/core-js/object/assign.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(/*! core-js/library/fn/object/assign */ "./dynamic-slider/node_modules/core-js/library/fn/object/assign.js"), __esModule: true };

/***/ }),

/***/ "./dynamic-slider/node_modules/core-js/library/fn/number/is-nan.js":
/*!*************************************************************************!*\
  !*** ./dynamic-slider/node_modules/core-js/library/fn/number/is-nan.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.number.is-nan */ "./dynamic-slider/node_modules/core-js/library/modules/es6.number.is-nan.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./dynamic-slider/node_modules/core-js/library/modules/_core.js").Number.isNaN;


/***/ }),

/***/ "./dynamic-slider/node_modules/core-js/library/fn/object/assign.js":
/*!*************************************************************************!*\
  !*** ./dynamic-slider/node_modules/core-js/library/fn/object/assign.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.assign */ "./dynamic-slider/node_modules/core-js/library/modules/es6.object.assign.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./dynamic-slider/node_modules/core-js/library/modules/_core.js").Object.assign;


/***/ }),

/***/ "./dynamic-slider/node_modules/core-js/library/modules/_object-assign.js":
/*!*******************************************************************************!*\
  !*** ./dynamic-slider/node_modules/core-js/library/modules/_object-assign.js ***!
  \*******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(/*! ./_object-keys */ "./dynamic-slider/node_modules/core-js/library/modules/_object-keys.js");
var gOPS = __webpack_require__(/*! ./_object-gops */ "./dynamic-slider/node_modules/core-js/library/modules/_object-gops.js");
var pIE = __webpack_require__(/*! ./_object-pie */ "./dynamic-slider/node_modules/core-js/library/modules/_object-pie.js");
var toObject = __webpack_require__(/*! ./_to-object */ "./dynamic-slider/node_modules/core-js/library/modules/_to-object.js");
var IObject = __webpack_require__(/*! ./_iobject */ "./dynamic-slider/node_modules/core-js/library/modules/_iobject.js");
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(/*! ./_fails */ "./dynamic-slider/node_modules/core-js/library/modules/_fails.js")(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ "./dynamic-slider/node_modules/core-js/library/modules/es6.number.is-nan.js":
/*!**********************************************************************************!*\
  !*** ./dynamic-slider/node_modules/core-js/library/modules/es6.number.is-nan.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 20.1.2.4 Number.isNaN(number)
var $export = __webpack_require__(/*! ./_export */ "./dynamic-slider/node_modules/core-js/library/modules/_export.js");

$export($export.S, 'Number', {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});


/***/ }),

/***/ "./dynamic-slider/node_modules/core-js/library/modules/es6.object.assign.js":
/*!**********************************************************************************!*\
  !*** ./dynamic-slider/node_modules/core-js/library/modules/es6.object.assign.js ***!
  \**********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(/*! ./_export */ "./dynamic-slider/node_modules/core-js/library/modules/_export.js");

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(/*! ./_object-assign */ "./dynamic-slider/node_modules/core-js/library/modules/_object-assign.js") });


/***/ })

}]);
//# sourceMappingURL=vendors~dynamic-slider.bundle.js.map