# Developing Web Components with Polymer 3 + Webpack 4

The goal is to create reusable web components then package it to be used with any frontend development frameworks.

Create a folder with the desired name for your component. When importing by external systems, it would be more convenient to be able to search by directory names.

Official Polymer 3.0 documentation can be found [here](https://www.polymer-project.org/3.0/docs/devguide/feature-overview).

## Structure

For convenience, a project template is provided in `sample-component`.

* **webpack.config.js -** component build configuration file
* **polymer.json -** polymer settings for when running the demo
* **package.json -** package dependencies and script definition file
* **.babelrc -** javascript transpiler configuration
* **src/ -** source folder for the code for your component
* **src/index.js -** root file for your component
* **demo/ -** demo html/css/js code for debugging and showcasing
* **build/ -** output folder for built components

## Starting out

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

Alternatively, install node, which comes with npm, then run these commands to get polymer and bower. Bower is used because the package management is more lightweight than npm, thus is more suitable for frontend stuff:
```
npm install -g polymer-cli
```

After creating the project folder, go into that folder, where `package.json` is present, then run:
```
npm install
```

Make sure that you have the latest version of NodeJS and npm.

## Running the demo/debugging results

Polymer have a convenient command to serve the current source and demo on a local server. Simply run the following command to preview your demo on the browser:

```
polymer serve
```

## Build

We use Webpack 4 to build our project. Configurations could be found in `webpack.config.js`. There are 2 build modes: dev and prod. Dev builds preserve the general aesthetics of the src for easy debugging. Prod mode minify the whole src to make it easy for shipping.

We opted Webpack instead of the official Polymer build tools because Webpack give us more granular tuning in how we want to package and ship the components. And since we are only interested in shipping individual web components and not a Polymer app, this conflicts with the stated purpose (at the time of writing) that suggests Polymer build tools should only be used for building Polymer apps.

* **Build Target:** ES5 (to support all browsers)
* **3rd Party Modules:** Ignored unless specified otherwise
* **Modules Conversion:** Use CommonJS's `require` for import/export of modules
* **Minifying:** Options set to default (more info [here](https://github.com/babel/minify/tree/master/packages/babel-preset-minify#options))

> If you want to change the transpile target and other js related things, you can edit the `.babelrc`. If you wish to add more support for different file types (loaders) or extra steps when building (plugin), you can edit the `webpack.config.js`.

To build the component into a js bundle, run either of the following commands:

* dev build:
```
webpack
```
or
```
npm run build-dev
```
* dev build:
```
webpack -p
```
or
```
npm run build-prod
```

The build will output to `build/`. The dev build will output as `{your component name}.js` and the prod build will output as `{your component name}.min.js`.

## How to use the component?

Like importing any webcomponents, you need some polyfills. The following code is inspired by [this](https://github.com/webpack-contrib/polymer-webpack-loader/blob/master/demo/src/index.ejs).

* Required Package:
  * **@webcomponents/webcomponentsjs**
* Required Polyfills:
  * **@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js**
  * **@webcomponents/webcomponentsjs/webcomponents-loader.js**


1.  Import `custom-elements-es5-adapter.js` if the browser supports CustomElements.
    * **Why?** From the [official documentation](https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs)
    >*According to the spec, only ES6 classes (https://html.spec.whatwg.org/multipage/scripting.html#custom-element-conformance) may be passed to the native customElements.define API. For best performnace, ES6 should be served to browsers that support it, and ES5 code should be serve to those that don't. Since this may not always be possible, it may make sense to compile and serve ES5 to all browsers. However, ES5-style custom element classes will not work on browsers with native Custom Elements because ES5-style classes cannot properly extend ES6 classes, like HTMLElement.*
    >
    >*To work around this, load custom-elements-es5-adapter.js before defining Custom Elements. This adapter will automatically wrap ES5.*
    >
    >*The adapter must NOT be compiled.*

    * **How?**
    ```
    if (window.customElements) {
      require('@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js');
    }
    ```

2.  Import the `webcomponents-loader.js`.
    * **Why?** Because it loads the polyfills necessary for the browser to support rendering of web components.
    * **How?**
    ```
    require('@webcomponents/webcomponentsjs/webcomponents-loader.js');
    ```
3.  Wait for `WebComponentsReady` event to fire then import your custom web components.
    * **Why?** Because this event is fired by `webcomponents-loader` when it finishes loading all the polyfills. We want to make sure our browser is ready before importing custom web components.
    * **How?**
    ```
    const componentsReady = e => {
      // Remove the listener because we no longer need it after this.
      document.removeEventListener('WebComponentsReady', componentsReady, false);
      // Import your component
      require('path/to/your/component.js');
    };
    // Wait till the browser is ready for components.
    document.addEventListener('WebComponentsReady', componentsReady, false);
    ```

**IMPORTANT:** All this must be the first thing that was run in your app.

The code discussed in this section is provided in `how-to-import.js`. Feel free to copy them to be used in your project.

## Caveats

### Creating a new project

You can copy everything from `sample-project`. HOWEVER. Don't forget to change the `name` property inside `package.json`! `src/index.js` and `demo/index.html` also have stub names, so change that as well. When that's done, you should be good to go!

### 3rd party modules

On top of importing 3rd party modules in your src files, you need to also specify it int he webpack config. Some 3rd party libraries, like P5, attaches its p5 object to the global scope, so when you import it the script gets executed and p5 gets attached. The problem with shipping to clients is that there is no easy way to manage what considers a global scope at each point of the app lifecycle. To handle this you need webpack's `script-loader` to execute p5's import script and actually bind the result to the global scope.

> There are many ways to handle legacy third party libraries. Check out [imports-loader](https://github.com/webpack-contrib/imports-loader), [exports-loader](https://github.com/webpack-contrib/exports-loader), [expose-loader](https://github.com/webpack-contrib/expose-loader), [scripts-loader](https://github.com/webpack-contrib/script-loader), [ProvidePlugin](https://webpack.js.org/plugins/provide-plugin/), etc. There are more stuff, and they are part of the webpack concept called [Shimming](https://webpack.js.org/guides/shimming/). Use different stuff for different legacy libraries, depending on how those libraries work.

Simply go to `webpack.config.js` and scroll down to where module rules are defined. In the case of p5, add a rule for this particular library to be load with `script-loader`. You rule would look something like this:
```
{
  module: {
    rules: [
      {
        //  LOAD IN 3RD PARTY LIBRARIES TO GET THE GLOBAL VARIABLE THAT IT REGISTERS
        test: resolve(path.join("node_modules", "p5", "lib", "p5.min.js")),
        use: [
          "script-loader"
        ]
      }
      ...
    ]
  }
```
