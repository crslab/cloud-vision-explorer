const mainComponentPath = "./web_components/main/";
let assetsJson = require(mainComponentPath + "asset-manifest.json");
let importPaths = [];
for (let key in assetsJson) {
	if (key.split(".").splice(-1, 1)[0] === "map") {
		continue;
	}
	importPaths.push(mainComponentPath + assetsJson[key])
}
importPaths.reverse();

const importWebComponents = () => {
  // Do nothing if no component paths are given
  if (importPaths.length === 0) {
    return;
  }
  // Inject script compatibility script if browser natively supports CustomElements
  if (window.customElements) {
    require('@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js');
  }
  // Import polyfills to help load web components
  require('@webcomponents/webcomponentsjs/webcomponents-loader.js');

  // Import the web components when the browser is ready to handle them
  const componentsReady = e => {
    document.removeEventListener('WebComponentsReady', componentsReady, false);
    for (let path of importPaths) {
      // Trick webpack into thinking this is require-ing with a string rather than
      // a variable name
      require(`${path}`);
    }
  };
  document.addEventListener('WebComponentsReady', componentsReady, false);
};

export default importWebComponents;
