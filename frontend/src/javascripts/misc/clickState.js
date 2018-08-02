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
  BLOCKED_AFTER_1ST: "BLOCKED_AFTER_1ST"
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
      case stages.CLEAN:
      case stages.BLOCKED:
        this.state.stage = stages.PREVIEWED;
        break;
      case stages.SELECTED_1ST:
      case stages.BLOCKED_AFTER_1ST:
        this.state.stage = stages.PREVIEWED_AFTER_1ST;
        break;
    }
  }

  block() { //Hope I covered all possible cases...
    switch(this.state.stage) {
      case stages.CLEAN:
      case stages.PREVIEWED:
      case stages.SELECTED_1ST:
        this.state.stage = stages.BLOCKED;
        break;
      case stages.PREVIEWED_AFTER_1ST:
        this.state.stage = stages.BLOCKED_AFTER_1ST;
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
        }
        return delay(0);
      })
    this.state.stage = stages.INTERPOLATED;
  }

  stopSlider() {
    this.state.stage = stages.SLIDER_STOPPED;
  }

  clean(cleanDispatch) {
    cleanDispatch();
    this.state.stage = stages.CLEAN;
  }
}
