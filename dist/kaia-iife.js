var idbKeyval = (function (exports) {
'use strict';

/**
 * @license
 * Copyright 2018 OOMWOO LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class TfMobile {
    constructor() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        this._modelLoaded = false;
        if (window._kaia === undefined)
            throw ('kaia.js requires Android Kaia.ai app to run');
        if (window._kaia.tfMobile === undefined) {
            window._kaia.tfMobile = function () { };
            window._kaia.tfMobile.engine = [];
            window._kaia.tfMobile.cb = function (jsonString) {
                const opRes = JSON.parse(unescape(jsonString));
                let obj = window._kaia.tfMobile.engine[opRes.handle];
                opRes.err ? obj._rejectFunc(opRes.err) : obj._resolveFunc(opRes);
            };
        }
        window._kaia.tfMobile.engine.push(this);
        this._handle = window._kaia.tfMobile.engine.length - 1;
    }
    init(model, params) {
        if (this._modelLoaded)
            throw ("Model already loaded");
        this._modelLoaded = true;
        // Must use Chrome
        const modelDecoded = new TextDecoder("iso-8859-1").decode(model);
        params = params || {};
        params.handle = this._handle;
        let res = JSON.parse(window._kaia.tfMobileInit(JSON.stringify(params), modelDecoded));
        return this._makePromise(res);
    }
    _clearCallback() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        window._kaia.tfMobile.engine[this._handle] = null;
    }
    _resolve(res) {
        let cb = this._resolveFunc;
        this._clearCallback();
        if (cb !== null)
            cb(res);
    }
    _reject(err) {
        let cb = this._rejectFunc;
        this._clearCallback();
        if (cb !== null)
            cb(err);
    }
    run(data, params) {
        if (this.isClosed())
            throw ('TfMobile instance has been closed');
        const textDecoder = new TextDecoder("iso-8859-1");
        let dataDecoded = [];
        for (let i = 0; i < data.length; i++)
            dataDecoded[i] = textDecoder.decode(data[i]);
        params = params || {};
        params.handle = this._handle;
        let res = JSON.parse(window._kaia.tfMobileRun(JSON.stringify(params), dataDecoded));
        return this._makePromise(res);
    }
    _makePromise(res) {
        if (res.err)
            throw (res.err);
        let promise = new Promise((resolve, reject) => {
            this._resolveFunc = resolve;
            this._rejectFunc = reject;
        });
        window._kaia.tfMobile.engine[this._handle] = this;
        return promise;
    }
    isClosed() {
        return window._kaia.tfMobile.engine[this._handle] === null;
    }
    close() {
        let params = { handle: this._handle };
        window._kaia.tfMobile.engine[this._handle] = null;
        let res = JSON.parse(window._kaia.tfMobileClose(JSON.stringify(params)));
        if (res.err)
            throw (res.err);
        this._clearCallback();
    }
}
async function createTfMobile(model, params) {
    const tfMobile = new TfMobile();
    const res = await tfMobile.init(model, params || {});
    if (typeof res === "string")
        throw (res);
    return tfMobile;
}

/**
 * @license
 * Copyright 2018 OOMWOO LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class TfLite {
    constructor() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        this._modelLoaded = false;
        if (window._kaia === undefined)
            throw ('kaia.js requires Android Kaia.ai app to run');
        if (window._kaia.tfLite === undefined) {
            window._kaia.tfLite = function () { };
            window._kaia.tfLite.engine = [];
            window._kaia.tfLite.cb = function (jsonString) {
                const opRes = JSON.parse(unescape(jsonString));
                let obj = window._kaia.tfLite.engine[opRes.handle];
                opRes.err ? obj._rejectFunc(opRes.err) : obj._resolveFunc(opRes);
            };
        }
        window._kaia.tfLite.engine.push(this);
        this._handle = window._kaia.tfLite.engine.length - 1;
    }
    init(model, params) {
        if (this._modelLoaded)
            throw ("Model already loaded");
        this._modelLoaded = true;
        // Must use Chrome
        const modelDecoded = new TextDecoder("iso-8859-1").decode(model);
        params = params || {};
        params.handle = this._handle;
        let res = JSON.parse(window._kaia.tfLiteInit(JSON.stringify(params), modelDecoded));
        return this._makePromise(res);
    }
    _clearCallback() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        window._kaia.tfLite.engine[this._handle] = null;
    }
    _resolve(res) {
        let cb = this._resolveFunc;
        this._clearCallback();
        if (cb !== null)
            cb(res);
    }
    _reject(err) {
        let cb = this._rejectFunc;
        this._clearCallback();
        if (cb !== null)
            cb(err);
    }
    run(data, params) {
        if (this.isClosed())
            throw ('TfLite instance has been closed');
        const textDecoder = new TextDecoder("iso-8859-1");
        let dataDecoded = [];
        for (let i = 0; i < data.length; i++)
            dataDecoded[i] = textDecoder.decode(data[i]);
        params = params || {};
        params.handle = this._handle;
        let res = JSON.parse(window._kaia.tfLiteRun(JSON.stringify(params), dataDecoded));
        return this._makePromise(res);
    }
    _makePromise(res) {
        if (res.err)
            throw (res.err);
        let promise = new Promise((resolve, reject) => {
            this._resolveFunc = resolve;
            this._rejectFunc = reject;
        });
        window._kaia.tfLite.engine[this._handle] = this;
        return promise;
    }
    isClosed() {
        return window._kaia.tfLite.engine[this._handle] === null;
    }
    close() {
        let params = { handle: this._handle };
        window._kaia.tfLite.engine[this._handle] = null;
        let res = JSON.parse(window._kaia.tfLiteClose(JSON.stringify(params)));
        if (res.err)
            throw (res.err);
        this._clearCallback();
    }
}
async function createTfLite(model, params) {
    const tfLite = new TfLite();
    const res = await tfLite.init(model, params || {});
    if (typeof res === "string")
        throw (res);
    return tfLite;
}

/**
 * @license
 * Copyright 2018 OOMWOO LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
class PocketSphinx {
    constructor() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        this._initialized = false;
        this._closed = false;
        this._listener = null;
        if (window._kaia === undefined)
            throw ('kaia.js requires Android Kaia.ai app to run');
        if (window._kaia.pocketSphinx === undefined) {
            window._kaia.pocketSphinx = function () { };
            window._kaia.pocketSphinx.cb = function (jsonString) {
                console.log(jsonString);
                const opRes = JSON.parse(unescape(jsonString));
                if (opRes.event === "init" && (this._rejectFunc != null) && (this._resolveFunc != null))
                    opRes.err ? this._rejectFunc(opRes.err) : this._resolveFunc(opRes);
                this._listener(opRes.err, opRes);
            };
        }
    }
    init(params) {
        if (this._initialized)
            throw ("Model already loaded");
        this._initialized = true;
        params = params || {};
        const model = params.modelZip;
        // check it's ArrayBuffer
        delete params.modelZip;
        // Must use Chrome
        const modelDecoded = model ? (new TextDecoder("iso-8859-1").decode(model)) : '';
        let res = JSON.parse(window._kaia.pocketSphinxInit(JSON.stringify(params), modelDecoded, ['abc', 'def']));
        return this._makePromise(res);
    }
    addSearch(params, model) {
        // Must use Chrome
        const modelDecoded = model ? (new TextDecoder("iso-8859-1").decode(model)) : '';
        params = params || {};
        let res = JSON.parse(window._kaia.pocketSphinxAddSearch(JSON.stringify(params), modelDecoded));
        return this._makePromise(res);
    }
    _clearCallback() {
        this._resolveFunc = null;
        this._rejectFunc = null;
    }
    _resolve(res) {
        let cb = this._resolveFunc;
        this._clearCallback();
        if (cb !== null)
            cb(res);
    }
    _reject(err) {
        let cb = this._rejectFunc;
        this._clearCallback();
        if (cb !== null)
            cb(err);
    }
    listen(params) {
        if (this.isClosed())
            throw ('PocketSphinx instance has been closed');
        params = params || { active: true };
        if (typeof params == 'boolean')
            params = { active: params };
        let res = JSON.parse(window._kaia.pocketSphinxListen(JSON.stringify(params)));
        return this._makePromise(res);
    }
    _makePromise(res) {
        if (res.err)
            throw (res.err);
        let promise = new Promise((resolve, reject) => {
            this._resolveFunc = resolve;
            this._rejectFunc = reject;
        });
        return promise;
    }
    isClosed() {
        return this._closed;
    }
    close() {
        this._closed = true;
        let res = JSON.parse(window._kaia.pocketSphinxClose());
        if (res.err)
            throw (res.err);
        this._clearCallback();
        this._listener = null;
    }
    setListener(listener) {
        this._listener = listener;
    }
}
async function createPocketSphinx(params) {
    const pocketSphinx = new PocketSphinx();
    const res = await pocketSphinx.init(params || {});
    if (typeof res === "string")
        throw (res);
    return pocketSphinx;
}

/**
 * @license
 * Copyright 2018 OOMWOO LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

exports.TfMobile = TfMobile;
exports.createTfMobile = createTfMobile;
exports.TfLite = TfLite;
exports.createTfLite = createTfLite;
exports.PocketSphinx = PocketSphinx;
exports.createPocketSphinx = createPocketSphinx;

return exports;

}({}));
