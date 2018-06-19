import Entity from "./entity.js";
import entityActions from "./entityActions.js";
import { types as actionTypes } from "./entityActions.js";
import ce from "../common/customEvents.js";

class Visualization {
  constructor(imgPathPrefix, data, containerDOM, parentWidth, parentHeight, bgColor = "#000000") {
    this.imgPathPrefix = imgPathPrefix;
    this.data = data;
    this.containerDOM = containerDOM;
    this.parentWidth = parentWidth;
    this.parentHeight = parentHeight;
    this.bgColor = bgColor;
  }

  sketch(p) {
    p.setup = setup;
    p.draw = draw;
    p.mousePressed = mousePressed;
    p.mouseReleased = mouseReleased;
    p.mouseClicked = mouseClicked;

    let self = this;
    let entityList = [];
    let startTime = 0;
    let endTime = 0;
    let checkpointTime = 0;
    let longPressMs = 300;
    let startMouseX = 0;
    let startMouseY = 0;
    let mouseClickMoveTolerance = 1e-13;

    function setup() {
      p.createCanvas(self.parentWidth, self.parentHeight);
      for (let i = 0; i < self.data.length; i++) {
        entityList.push(new Entity(self.imgPathPrefix, p, self.data[i]));
      }
      reset();
      p.noLoop();

      // Hook up events
      self.containerDOM.addEventListener(ce.resetCanvas, reset);
    }

    function draw() {
      let timeNow = Date.now();
      let timeDifferenceMs = timeNow - checkpointTime;
      if (timeDifferenceMs >= longPressMs &&
          Math.abs(startMouseX - p.mouseX) < mouseClickMoveTolerance &&
          Math.abs(startMouseY - p.mouseY) < mouseClickMoveTolerance) {
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
      let timeDifferenceMs = endTime - startTime;
      if (timeDifferenceMs < longPressMs) {
        preview();
      }
    }

    function reset() {
      p.background(self.bgColor);
      for (let i = 0; i < self.data.length; i++) {
        entityActions(actionTypes.CLEAR, entityList[i]);
      }
    }

    function preview() { // Generally for previewing, not for selecting.
      for (let i = 0; i < entityList.length; i++) {
        let data = entityActions(actionTypes.PREVIEW, entityList[i]);
        if (data) {
          self.dispatch(ce.previewEntityObj(data));
          return;
        }
      }
    }

    function select() { // Generally for selecting
      for (let i = 0; i < entityList.length; i++) {
        let data = entityActions(actionTypes.SELECT, entityList[i]);
        if (data) {
          self.dispatch(ce.selectEntityObj(data));
          return;
        }
      }
    }
  }

  dispatch(eventObject) {
    this.containerDOM.dispatchEvent(eventObject);
  }
}

export default Visualization;
