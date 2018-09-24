# Kaia.js

Kaia.ai platform's JS client library

## Usage

### TODO

```js
TODO
```

## Installing

### Via npm + webpack/rollup

```sh
npm install kaia.js
```

Now you can require/import `kaia.js`:

```js
import { TODO } from 'kaia.js';
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
<script src="https://cdn.jsdelivr.net/npm/kaia@0/dist/kaia-iife.min.js"></script>
<!-- Or in modern browsers: -->
<script type="module">
  import { get, set } from 'https://cdn.jsdelivr.net/npm/kaia@0/dist/kaia.mjs';
</script>
```

