# Kaia.js
Kaia.ai platform's JS client library

We have not yet launched the platform. For launch announcement please follow us on [Facebook](https://www.facebook.com/kaiaai/).

## Live Demos
- Browse [sample apps](https://github.com/kaiaai/sample-apps) for live demos, source code

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

### TensorFlow Lite API
- [Sample app](https://kaia.ai/view-app/5bbaccffa2f5f31d466259b6)
- Sample app [source code](https://github.com/kaiaai/tensorflow-lite-app)
- Sample app [source code](https://github.com/kaiaai/tensorflow-lite-app-node), built with node.js and webpack

```js
let tfLite = await createTensorFlowLite(model); // load model
let result = await tfLite.run([img], {  // classify image
  input: [{width: size, height: size, channels: 4, batchSize: 1, imageMean: 128.0, imageStd: 128.0,
           type: 'colorBitmapAsFloat'}],
  output:[{type: 'float', size: [1, 1001]}]
});
let probabilities = result.output[0][0];
```

Configuration options passed to run():
```js
// Input parameters
  type: 'colorBitmapAsFloat', // input data type colorBitmapAsFloat|float|int|double|long|byte|colorBitmapAsByte
  width: inputWidth,          // input layer width
  height: inputHeight,        // input layer height
  channels: inputChannels,    // input layer channels
  batchSize: inputBatchSize,  // input layer batch size
  imageMean: imageMean,       // input image mean, 0...255, default 128
  imageStd: imageStd,         // input image standard deviation, default 128
// Output parameters
  type: 'float',              // output data type float|int|double|long|byte
  size: [1, 1001],            // output data size
// Miscellaneous options
  useNNAPI: false,            // use Android NN API, default false
  numThreads: 0               // number of threads to use, default 0
```

### TensorFlow Mobile API
- [Sample app](https://kaia.ai/view-app/5ba319fc89bed10c954a2702)
- Sample app [source code](https://github.com/kaiaai/tensorflow-mobile-app)
- Sample app [source code](https://github.com/kaiaai/tensorflow-mobile-app-node), built with node.js and webpack

```js
let tfMobile = await createTensorFlowMobile(model); // load model
let result = await tfMobile.run([img], {    // classify image
  feed: [{width: size, height: size, inputName: 'input', imageMean: 128.0, imageStd: 128.0,
          feedType: 'colorBitmapAsFloat'}],
  run: {enableStats: false},
  fetch: {outputNames: ['MobilenetV1/Predictions/Softmax'], outputTypes: ['float']}
});
let probabilities = result.output[0];
```

### TextToSpeech API
- [Sample App](https://kaia.ai/view-app/5a055af654d7fc08c068f3b9)
- Sample app [source code](https://github.com/kaiaai/tree/master/text-to-speech)

```js
textToSpeech = await createTextToSpeech();
await textToSpeech.speak('Hello');
```

### Serial API
- [Sample App](https://kaia.ai/view-app/5bea7418f8864127d7ee4cac)
- Sample app [source code](https://github.com/kaiaai/tree/master/usb-serial)

```js
serial = await createSerial({ baudRate: 115200, eventListener: onSerialEvent });
serial.write('Hello Arduino!\n')

function onSerialEvent(err, data) {
  if (!err && data.event === 'received')
     console.log(data.message);
}
```

### MultiDetector API
Detects faces, barcodes, text. Decodes barcode data. Performs OCR (optical character recognition) on text.
- [Sample App](https://kaia.ai/view-app/5b8b8336c38e3b3579ca986f)
- Sample app [source code](https://github.com/kaiaai/tree/master/face-detection)

```js
let multiDet = await createAndroidMultiDetector({
  "face" : {"enableDetection" : true, "computeLandmarks" : false, "useFastSpeed" : true, "tracking" : true,
            "prominentFacesOnly" : true, "computeClassifications" : false, "minFaceSize" : 0.2},
  "barcodes" : {"enableDetection" : false},
  "text" : {"enableDetection" : false},
  eventListener: (err, res) => { if (!err) reactToFaces(res); }
});
let imageURI = grabFrame();
await multiDet.detect(imageURI);

function reactToFaces(data) {
  if (data.faces.length == 0) {
    console.log('I don\'t see any faces'); return;
  }
  if (data.faces.length > 1)
    console.log('I see ' + data.faces.length + ' faces');    
  let face = data.faces[0];
  let left_x = face.left;
  let width = face.width;
  let top = face.top;
  let height = face.height;
  // ...
}
```

## Installing

### Via npm + webpack/rollup
```sh
npm install kaia.js
```

Now you can require/import `kaia.js`:

```js
import { createTfMobile, createTfLite, createTextToSpeech, createAndroidMultiDetect, createPocketSphinx
         createAndroidSpeechRecognition, createDeviceSettings, createSerial, createSensors} from 'kaia.js';
```

### Via `<script>`
* `dist/kaia.mjs` is a valid JS module.
* `dist/kaia-iife.js` can be used in browsers that don't support modules. `kaiaJs` is created as a global.
* `dist/kaia-iife.min.js` As above, but minified.
* `dist/kaia-iife-compat.min.js` As above, but works in older browsers such as IE 10.
* `dist/kaia-amd.js` is an AMD module.
* `dist/kaia-amd.min.js` As above, but minified.

These built versions are also available on jsDelivr, e.g.:

```html
<script src="https://cdn.jsdelivr.net/npm/kaia.js/dist/kaia-iife.min.js"></script>
<!-- Or in modern browsers: -->
<script type="module">
  import { createTfMobile, createTfLite, createTextToSpeech } from 'https://cdn.jsdelivr.net/npm/kaia.js';
</script>
```
and unpkg
```html
<script src="https://unpkg.com/kaia.js/dist/kaia-iife.min.js"></script>
<!-- Or in modern browsers: -->
<script type="module">
  import { createTfMobile, createTfLite, createTextToSpeech } from 'https://unpkg.com/kaia.js';
</script>
```

## Customizing NN Model
- To make a custom TfMobile model please follow a detailed [Google Codelabs TFMobile](https://codelabs.developers.google.com/codelabs/tensorflow-for-poets-2/#0) tutorial
- To make a custom TfLite model please follow a detailed [Google Codelabs TFLite](https://codelabs.developers.google.com/codelabs/tensorflow-for-poets-2-tflite/index.html#0) tutorial

## Deprecations
- Expect TextToSpeech to be eventually deprecated in favor of Web text-to-speech API.
- Expect Serial API to be eventually deprecated in favor of WebUSB
