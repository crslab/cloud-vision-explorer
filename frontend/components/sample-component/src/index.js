import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

/**
 * `sample-component`
 * < Your component description >
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SampleComponent extends PolymerElement {
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
      `;
  }

  constructor() {
    super();
  }

  static get is() {
    return 'sample-component';
  }
}

window.customElements.define(SampleComponent.is, SampleComponent);
