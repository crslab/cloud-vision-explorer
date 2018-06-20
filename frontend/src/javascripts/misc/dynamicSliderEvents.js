class DynamicSliderEvents {
  static get sliderStart() {
    return "slider-start";
  }

  static get sliderMove() {
    return "slider-move";
  }

  static get sliderStop() {
    return "slider-stop";
  }

  static get defaultParams() {
    return {bubbles: true, composed: true};
  }

  static sliderStartObj(dataJSON = null, bubbles = true, composed = true) {
    let params = {
      detail: dataJSON,
      bubbles,
      composed
    };
    return new CustomEvent(this.sliderStart, params);
  }

  static sliderMoveObj(dataJSON = null, bubbles = true, composed = true) {
    let params = {
      detail: dataJSON,
      bubbles,
      composed
    };
    return new CustomEvent(this.sliderMove, params);
  }

  static sliderStopObj(dataJSON = null, bubbles = true, composed = true) {
    let params = {
      detail: dataJSON,
      bubbles,
      composed
    };
    return new CustomEvent(this.sliderStop, params);
  }
}

export default DynamicSliderEvents;
