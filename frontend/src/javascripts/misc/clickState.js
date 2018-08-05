// Initial state
export const stages = {
  CLEAN: "CLEAN",
  SELECTED_1ST: "SELECTED_1ST",
  SELECTED_2ND: "SELECTED_2ND",
  PREVIEWED: "PREVIEWED",
  PREVIEWED_AFTER_1ST: "PREVIEWED_AFTER_1ST",
  SLIDER_DISPLAYED: "SLIDER_DISPLAYED",
  INTERPOLATED: "INTERPOLATED",
  SLIDER_MOVING: "SLIDER_MOVING",
  SLIDER_STOPPED: "SLIDER_STOPPED",
  BLOCKED: "BLOCKED",
  BLOCKED_AFTER_1ST: "BLOCKED_AFTER_1ST",
  BLOCKED_BY_RESET: "BLOCKED_BY_RESET",
  LOADED_1ST_IMG: "LOADED_1ST_IMG",
  LOADED_2ND_IMG: "LOADED_2ND_IMG"
};

export const isMouseHit = (mouseX, mouseY, x, y, size) => ((mouseX - x)**2)/(size*size/4) +((mouseY - y)**2)/(size*size/4) < 1;
export const delay = (t, v) => new Promise(resolve => { setTimeout(resolve.bind(null, v), t) });

export default class ClickState {
  constructor() {
    this.interpolationMs = 280;
    this.state = {
      stage: stages.CLEAN,
      interpolationQueue: delay(0),
      currentInterpolationParams: undefined
    };
  }

  get stage() {
    return this.state.stage;
  }

  select(selectStartDispatch, selectEndDispatch, params) {
    switch (this.state.stage) {
      case stages.SELECTED_1ST:
      case stages.PREVIEWED_AFTER_1ST:
        selectEndDispatch(...params);
        this.state.stage = stages.SELECTED_2ND;
        break;
      case stages.CLEAN:
      case stages.PREVIEWED:
        selectStartDispatch(...params);
        this.state.stage = stages.SELECTED_1ST;
        break;
      default:
        break;
    }
  }

  preview() {
    switch(this.state.stage) {
      //case stages.CLEAN:
      case stages.BLOCKED:
        this.state.stage = stages.PREVIEWED;
        break;
      //case stages.SELECTED_1ST:
      case stages.BLOCKED_AFTER_1ST:
        this.state.stage = stages.PREVIEWED_AFTER_1ST;
        break;
    }
  }

  block() { //Hope I covered all possible cases...
    switch(this.state.stage) {
      case stages.CLEAN:
      case stages.PREVIEWED:
        this.state.stage = stages.BLOCKED;
        break;
      case stages.SELECTED_1ST:
      case stages.PREVIEWED_AFTER_1ST:
        this.state.stage = stages.BLOCKED_AFTER_1ST;
        break;
    }
  }

  block_reset() { //This is the ultimate blocker that is independent of previous state. During this block, both previewing and selecting doesn't work.
    this.state.stage = stages.BLOCKED_BY_RESET;
  }

  unblock_reset() { //This gets called when the promises in trackNode in RenderView.js get resolved, which is at the end of camera operation.
    this.state.stage = stages.CLEAN;
  }

  load_img() {
    switch(this.state.stage) {
      case stages.SLIDER_DISPLAYED: //This reads oddly but, think of "slider displayed" state as more like, attempting to display slider.
        this.state.stage = stages.LOADED_1ST_IMG;
        break;
      case stages.LOADED_1ST_IMG:
        this.state.stage = stages.LOADED_2ND_IMG;
        break;
    }
  }

  displaySlider(pinSliderDispatch, params) {
    pinSliderDispatch(...params);
    this.state.stage = stages.SLIDER_DISPLAYED;
  }

  startSlider() {
    this.state.stage = stages.SLIDER_MOVING;
  }

  interpolate(interpolateDispatch, params) {
    this.state.currentInterpolationParams = params;
    this.state.interpolationQueue = this.state.interpolationQueue
      .then(() => delay(this.interpolationMs))
      .then(() => {
        if (this.state.stage !== stages.SLIDER_STOPPED) {
          interpolateDispatch(...this.state.currentInterpolationParams);
          this.state.stage = stages.INTERPOLATED;
          return delay(0);
        }
        else {
          throw "Exit current interpolation chain."
        }
      })
  }

  stopSlider() {
    this.state.interpolationQueue = this.state.interpolationQueue
      .catch(err => {
        console.log(err)
      })
    this.state.stage = stages.SLIDER_STOPPED;
  }

  clean(cleanDispatch) {
    cleanDispatch();
    this.state.stage = stages.CLEAN;
  }
}
