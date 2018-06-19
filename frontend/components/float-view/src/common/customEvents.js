class CustomEventsCollection {
  constructor() {}

  static get resetCanvas() {
    return "reset-canvas";
  }

  static get selectEntity() {
    return "select-entity";
  }

  static get previewEntity() {
    return "preview-entity";
  }

  static resetCanvasObj(dataJSON = null, bubbles = true, composed = true) {
    let params = {
      detail: dataJSON,
      bubbles,
      composed
    };
    return new CustomEvent(this.resetCanvas, params);
  }

  static selectEntityObj(dataJSON = null, bubbles = true, composed = true) {
    let params = {
      detail: dataJSON,
      bubbles,
      composed
    };
    return new CustomEvent(this.selectEntity, params);
  }

  static previewEntityObj(dataJSON = null, bubbles = true, composed = true) {
    let params = {
      detail: dataJSON,
      bubbles,
      composed
    };
    return new CustomEvent(this.previewEntity, params);
  }
}

export default CustomEventsCollection;
