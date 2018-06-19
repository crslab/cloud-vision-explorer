// Inject script compatibility script if browser natively supports CustomElements
if (window.customElements) {
  require('@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js');
}
// Import polyfills to help load web components
require('@webcomponents/webcomponentsjs/webcomponents-loader.js');

// Import the web components when the browser is ready to handle them
var componentEntrypoint = './float-view.js';
const componentsReady = e => {
  document.removeEventListener('WebComponentsReady', componentsReady, false);
  // Trick webpack into thinking this is require-ing with a string rather than
  // a variable name
  require(`${componentEntrypoint}`);
};
document.addEventListener('WebComponentsReady', componentsReady, false);
