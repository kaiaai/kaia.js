# Kaia.js
Kaia.ai platform's JS client library

## Live Demo
- [Sample app](https://kaia.ai/view-app/5a110a4cc0c25c1f565eba63)
- Sample app [source code](https://github.com/kaiaai/sensors)

## Installation
Kaia.ai robot apps run on Android smartphones. To run sample apps:
1. Go to [kaia.ai](https://kaia.ai/), familiarize yourself with how the robot platform works
2. Optional, but highly recommended: if you don't have Kaia.ai account, create an account
3. Go to Google Play, search for "kaia.ai" to find and install Kaia.ai Android app
4. Launch Kaia.ai Android app on your Android smartphone
5. In Kaia.ai Android app: (optional, but highly recommended): sign in, navigate to Kaia.ai App Store
6. Choose a robot app to launch
7. Optionally: click the heart icon to pin the robot app to your launch screen

## API Overview

### TfMobile

- [Sample app](https://kaia.ai/view-app/5ba319fc89bed10c954a2702)
- Sample app [source code](https://github.com/kaiaai/tensorflow-mobile-app)
- Sample app [source code](https://github.com/kaiaai/tensorflow-mobile-app-node), built with node.js and webpack

```js
let tfMobile = await createTfMobile(model); // load model
...
let result = await tfMobile.run([img], // classify image
  {feed: [
    {width: size,
     height: size,
     inputName: 'input',
     imageMean: 128.0,
     imageStd: 128.0,
     feedType: 'colorBitmapAsFloat'
    }],
   run: {enableStats: false},
   fetch: {outputNames: ['MobilenetV1/Predictions/Softmax'], outputTypes: ['float']}
  });
let probabilities = result.output[0];
...
tfMobile.close(); // optional
```

### TfLite

- [Sample app](https://kaia.ai/view-app/5bbaccffa2f5f31d466259b6)
- Sample app [source code](https://github.com/kaiaai/tensorflow-lite-app)
- Sample app [source code](https://github.com/kaiaai/tensorflow-lite-app-node), built with node.js and webpack

```js
let tfLite = await createTfLite(model); // load model
...
let result = await tfLite.run([img], // classify image
  {input: [
    {width: size,
     height: size,
     channels: 4,
     batchSize: 1,
     imageMean: 128.0,
     imageStd: 128.0,
     type: 'colorBitmapAsFloat'
    }],
   output: [
    {type: 'float',
     size: [1, 1001],
    }]
  });
let probabilities = result.output[0][0];
...
tfLite.close(); // optional
```

## Installing

### Via npm + webpack/rollup

```sh
npm install kaia.js
```

Now you can require/import `kaia.js`:

```js
import { createTfMobile, createTfLite } from 'kaia.js';
```

### Via `<script>`

* `dist/kaia.mjs` is a valid JS module.
* `dist/kaia-iife.js` can be used in browsers that don't support modules. `idbKeyval` is created as a global.
* `dist/kaia-iife.min.js` As above, but minified.
* `dist/kaia-iife-compat.min.js` As above, but works in older browsers such as IE 10.
* `dist/kaia-amd.js` is an AMD module.
* `dist/kaia-amd.min.js` As above, but minified.

These built versions are also available on jsDelivr, e.g.:

```html
<script src="https://cdn.jsdelivr.net/npm/kaia.js/dist/kaia-iife.min.js"></script>
<!-- Or in modern browsers: -->
<script type="module">
  import { createTfMobile, createTfLite } from 'https://cdn.jsdelivr.net/npm/kaia.js';
</script>
```
and unpkg
```html
<script src="https://unpkg.com/kaia.js/dist/kaia-iife.min.js"></script>
<!-- Or in modern browsers: -->
<script type="module">
  import { createTfMobile, createTfLite } from 'https://unpkg.com/kaia.js';
</script>
```

## Customizing NN Model

- To make a custom TfMobile model please follow a detailed [Google Codelabs TFMobile](https://codelabs.developers.google.com/codelabs/tensorflow-for-poets-2/#0) tutorial
- To make a custom TfLite model please follow a detailed [Google Codelabs TFLite](https://codelabs.developers.google.com/codelabs/tensorflow-for-poets-2-tflite/index.html#0) tutorial
