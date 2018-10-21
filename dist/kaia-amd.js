define(['exports'], function (exports) { 'use strict';

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
                const obj = window._kaia.tfMobile.engine[opRes.handle];
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
            window._kaia.pocketSphinx.engine = [];
            window._kaia.pocketSphinx.cb = function (jsonString) {
                const opRes = JSON.parse(unescape(jsonString));
                const obj = window._kaia.pocketSphinx.engine[0];
                if (opRes.event === "init" && (obj._rejectFunc != null) && (obj._resolveFunc != null))
                    opRes.err ? obj._rejectFunc(opRes.err) : obj._resolveFunc(opRes);
                if (obj._listener != null)
                    obj._listener(opRes.err, opRes);
            };
        }
        if (PocketSphinx._created)
            throw ('Only one instance allowed');
        window._kaia.pocketSphinx.engine.push(this);
        this._handle = window._kaia.pocketSphinx.engine.length - 1;
        PocketSphinx._created = true;
    }
    _extractArrayBufs(params) {
        const data = [];
        const fileNames = [];
        const textDecoder = new TextDecoder("iso-8859-1");
        if (params.searchFile) {
            if (!Array.isArray(params.searchFile))
                throw "searchFile must be an array";
            params.searchFile.forEach((item) => {
                fileNames.push(item.fileName);
                // Must use Chrome
                data.push(textDecoder.decode(item.file || ''));
            });
        }
        params.searchFile = fileNames;
        // TODO check it's ArrayBuffer
        if (params.modelZip) {
            data.push(textDecoder.decode(params.modelZip));
            delete params.modelZip;
        }
        return data;
    }
    init(params) {
        if (this._initialized)
            throw ("Already initialized");
        this._initialized = true;
        params = params || {};
        const data = this._extractArrayBufs(params);
        let res = JSON.parse(window._kaia.pocketSphinxInit(JSON.stringify(params), data));
        return this._makePromise(res);
    }
    addSearch(params) {
        params = params || {};
        const data = this._extractArrayBufs(params);
        let res = JSON.parse(window._kaia.pocketSphinxAddSearch(JSON.stringify(params), data));
        return this._makePromise(res);
    }
    _clearCallback() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        window._kaia.pocketSphinx.engine[this._handle] = null;
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
        if (params == undefined)
            params = { cmd: "listen" };
        else if (typeof params == 'boolean')
            params = params ? { cmd: "listen" } : { cmd: "cancel" };
        else if (typeof params == 'string')
            params = { cmd: "listen", searchName: params };
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
        window._kaia.pocketSphinx.engine[this._handle] = this;
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
    setEventListener(listener) {
        this._listener = listener;
    }
}
PocketSphinx._created = false;
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
class AndroidSpeechRecognizer {
    constructor() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        this._initialized = false;
        this._closed = false;
        this._listener = null;
        if (window._kaia === undefined)
            throw ('kaia.js requires Android Kaia.ai app to run');
        if (window._kaia.androidSpeechRecognizer === undefined) {
            window._kaia.androidSpeechRecognizer = function () { };
            window._kaia.androidSpeechRecognizer.engine = [];
            window._kaia.androidSpeechRecognizer.cb = function (jsonString) {
                const opRes = JSON.parse(unescape(jsonString));
                const obj = window._kaia.androidSpeechRecognizer.engine[0];
                if (opRes.event === "init" && (obj._rejectFunc != null) && (obj._resolveFunc != null))
                    opRes.err ? obj._rejectFunc(opRes.err) : obj._resolveFunc(opRes);
                if (obj._listener != null)
                    obj._listener(opRes.err, opRes);
            };
        }
        if (AndroidSpeechRecognizer._created)
            throw ('Only one instance allowed');
        window._kaia.androidSpeechRecognizer.engine.push(this);
        this._handle = window._kaia.androidSpeechRecognizer.engine.length - 1;
        AndroidSpeechRecognizer._created = true;
    }
    init(params) {
        if (this._initialized)
            throw ("Already initialized");
        this._initialized = true;
        let res = JSON.parse(window._kaia.androidSpeechRecognizerInit(JSON.stringify(params || {})));
        return this._makePromise(res);
    }
    _clearCallback() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        window._kaia.androidSpeechRecognizer.engine[this._handle] = null;
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
            throw ('AndroidSpeechRecognizer instance has been closed');
        if (params == undefined)
            params = { enabled: true };
        else if (typeof params == 'boolean')
            params = { enabled: params };
        let res = JSON.parse(window._kaia.androidSpeechRecognizerListen(JSON.stringify(params)));
        return this._makePromise(res);
    }
    _makePromise(res) {
        if (res.err)
            throw (res.err);
        let promise = new Promise((resolve, reject) => {
            this._resolveFunc = resolve;
            this._rejectFunc = reject;
        });
        window._kaia.androidSpeechRecognizer.engine[this._handle] = this;
        return promise;
    }
    isClosed() {
        return this._closed;
    }
    close() {
        this._closed = true;
        let res = JSON.parse(window._kaia.androidSpeechRecognizerClose());
        if (res.err)
            throw (res.err);
        this._clearCallback();
        this._listener = null;
    }
    setEventListener(listener) {
        this._listener = listener;
    }
}
AndroidSpeechRecognizer._created = false;
async function createAndroidSpeechRecognizer(params) {
    const androidSpeechRecognizer = new AndroidSpeechRecognizer();
    const res = await androidSpeechRecognizer.init(params || {});
    if (typeof res === "string")
        throw (res);
    return androidSpeechRecognizer;
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
exports.AndroidSpeechRecognizer = AndroidSpeechRecognizer;
exports.createAndroidSpeechRecognizer = createAndroidSpeechRecognizer;

Object.defineProperty(exports, '__esModule', { value: true });

});
