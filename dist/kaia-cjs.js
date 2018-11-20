'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
class TensorFlowMobile {
    constructor() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        this._modelLoaded = false;
        if (window._kaia === undefined)
            throw ('TensorFlowMobile requires Android Kaia.ai app to run');
        if (window._kaia.tensorFlowMobile === undefined) {
            window._kaia.tensorFlowMobile = function () { };
            window._kaia.tensorFlowMobile.engine = [];
            window._kaia.tensorFlowMobile.cb = function (jsonString) {
                const opRes = JSON.parse(unescape(jsonString));
                const obj = window._kaia.tensorFlowMobile.engine[opRes.handle];
                opRes.err ? obj._rejectFunc(opRes.err) : obj._resolveFunc(opRes);
            };
        }
        window._kaia.tensorFlowMobile.engine.push(this);
        this._handle = window._kaia.tensorFlowMobile.engine.length - 1;
    }
    init(model, params) {
        if (this._modelLoaded)
            throw ("Model already loaded");
        this._modelLoaded = true;
        // Must use Chrome
        const modelDecoded = new TextDecoder("iso-8859-1").decode(model);
        params = params || {};
        params.handle = this._handle;
        let res = JSON.parse(window._kaia.tensorFlowMobileInit(JSON.stringify(params), modelDecoded));
        return this._makePromise(res);
    }
    _clearCallback() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        window._kaia.tensorFlowMobile.engine[this._handle] = null;
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
            throw ('TensorFlowMobile instance has been closed');
        const textDecoder = new TextDecoder("iso-8859-1");
        let dataDecoded = [];
        for (let i = 0; i < data.length; i++)
            dataDecoded[i] = textDecoder.decode(data[i]);
        params = params || {};
        params.handle = this._handle;
        let res = JSON.parse(window._kaia.tensorFlowMobileRun(JSON.stringify(params), dataDecoded));
        return this._makePromise(res);
    }
    _makePromise(res) {
        if (res.err)
            throw (res.err);
        let promise = new Promise((resolve, reject) => {
            this._resolveFunc = resolve;
            this._rejectFunc = reject;
        });
        window._kaia.tensorFlowMobile.engine[this._handle] = this;
        return promise;
    }
    isClosed() {
        return window._kaia.tensorFlowMobile.engine[this._handle] === null;
    }
    close() {
        let params = { handle: this._handle };
        window._kaia.tensorFlowMobile.engine[this._handle] = null;
        let res = JSON.parse(window._kaia.tensorFlowMobileClose(JSON.stringify(params)));
        if (res.err)
            throw (res.err);
        this._clearCallback();
    }
}
async function createTensorFlowMobile(model, params) {
    const tfMobile = new TensorFlowMobile();
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
class TensorFlowLite {
    constructor() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        this._modelLoaded = false;
        if (window._kaia === undefined)
            throw ('TensorFlowLite requires Android Kaia.ai app to run');
        if (window._kaia.tensorFlowLite === undefined) {
            window._kaia.tensorFlowLite = function () { };
            window._kaia.tensorFlowLite.engine = [];
            window._kaia.tensorFlowLite.cb = function (jsonString) {
                const opRes = JSON.parse(unescape(jsonString));
                let obj = window._kaia.tensorFlowLite.engine[opRes.handle];
                opRes.err ? obj._rejectFunc(opRes.err) : obj._resolveFunc(opRes);
            };
        }
        window._kaia.tensorFlowLite.engine.push(this);
        this._handle = window._kaia.tensorFlowLite.engine.length - 1;
    }
    init(model, params) {
        if (this._modelLoaded)
            throw ("Model already loaded");
        this._modelLoaded = true;
        // Must use Chrome
        const modelDecoded = new TextDecoder("iso-8859-1").decode(model);
        params = params || {};
        params.handle = this._handle;
        let res = JSON.parse(window._kaia.tensorFlowLiteInit(JSON.stringify(params), modelDecoded));
        return this._makePromise(res);
    }
    _clearCallback() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        window._kaia.tensorFlowLite.engine[this._handle] = null;
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
            throw ('TensorFlowLite instance has been closed');
        const textDecoder = new TextDecoder("iso-8859-1");
        let dataDecoded = [];
        for (let i = 0; i < data.length; i++)
            dataDecoded[i] = textDecoder.decode(data[i]);
        params = params || {};
        params.handle = this._handle;
        let res = JSON.parse(window._kaia.tensorFlowLiteRun(JSON.stringify(params), dataDecoded));
        return this._makePromise(res);
    }
    _makePromise(res) {
        if (res.err)
            throw (res.err);
        let promise = new Promise((resolve, reject) => {
            this._resolveFunc = resolve;
            this._rejectFunc = reject;
        });
        window._kaia.tensorFlowLite.engine[this._handle] = this;
        return promise;
    }
    isClosed() {
        return window._kaia.tensorFlowLite.engine[this._handle] === null;
    }
    close() {
        let params = { handle: this._handle };
        window._kaia.tensorFlowLite.engine[this._handle] = null;
        let res = JSON.parse(window._kaia.tensorFlowLiteClose(JSON.stringify(params)));
        if (res.err)
            throw (res.err);
        this._clearCallback();
    }
}
async function createTensorFlowLite(model, params) {
    const tfLite = new TensorFlowLite();
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
            throw ('PocketSphinx requires Android Kaia.ai app to run');
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
class AndroidMultiDetector {
    constructor() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        this._initialized = false;
        this._closed = false;
        this._listener = null;
        if (window._kaia === undefined)
            throw ('AndroidMultiDetector requires Android Kaia.ai app to run');
        if (window._kaia.androidMultiDetector === undefined) {
            window._kaia.androidMultiDetector = function () { };
            window._kaia.androidMultiDetector.engine = [];
            window._kaia.androidMultiDetector.cb = function (jsonString) {
                const opRes = JSON.parse(unescape(jsonString));
                const obj = window._kaia.androidMultiDetector.engine[0];
                if (opRes.event === "init" && (obj._rejectFunc != null) && (obj._resolveFunc != null))
                    opRes.err ? obj._rejectFunc(opRes.err) : obj._resolveFunc(opRes);
                if (obj._listener != null)
                    obj._listener(opRes.err, opRes);
            };
        }
        if (AndroidMultiDetector._created)
            throw ('Only one instance allowed');
        window._kaia.androidMultiDetector.engine.push(this);
        this._handle = window._kaia.androidMultiDetector.engine.length - 1;
        AndroidMultiDetector._created = true;
    }
    init(params) {
        if (this._initialized)
            throw ("Already initialized");
        this._initialized = true;
        let res = JSON.parse(window._kaia.androidMultiDetectorInit(JSON.stringify(params || {})));
        return this._makePromise(res);
    }
    _clearCallback() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        window._kaia.androidMultiDetector.engine[this._handle] = null;
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
    detect(params) {
        if (this.isClosed())
            throw ('AndroidMultiDetector instance has been closed');
        if (params === undefined)
            params = { enabled: true };
        else if (typeof params === 'boolean')
            params = { enabled: params };
        else if (params instanceof ArrayBuffer) {
            const textDecoder = new TextDecoder("iso-8859-1");
            params = textDecoder.decode(params);
        }
        else if (typeof params === 'string') { }
        else
            throw ('Unsupported argument type');
        let res = JSON.parse(window._kaia.androidMultiDetectorDetect(params));
        return this._makePromise(res);
    }
    _makePromise(res) {
        if (res.err)
            throw (res.err);
        let promise = new Promise((resolve, reject) => {
            this._resolveFunc = resolve;
            this._rejectFunc = reject;
        });
        window._kaia.androidMultiDetector.engine[this._handle] = this;
        return promise;
    }
    isClosed() {
        return this._closed;
    }
    close() {
        this._closed = true;
        let res = JSON.parse(window._kaia.androidMultiDetectorClose(''));
        if (res.err)
            throw (res.err);
        this._clearCallback();
        this._listener = null;
    }
    setEventListener(listener) {
        this._listener = listener;
    }
}
AndroidMultiDetector._created = false;
async function createAndroidMultiDetector(params) {
    const androidMultiDetector = new AndroidMultiDetector();
    const res = await androidMultiDetector.init(params || {});
    if (typeof res === "string")
        throw (res);
    return androidMultiDetector;
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
class Serial {
    constructor() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        this._initialized = false;
        this._closed = false;
        this._listener = null;
        if (window._kaia === undefined)
            throw ('Serial requires Android Kaia.ai app to run');
        if (window._kaia.serial === undefined) {
            window._kaia.serial = function () { };
            window._kaia.serial.engine = [];
            window._kaia.serial.cb = function (jsonString) {
                const opRes = JSON.parse(jsonString);
                const obj = window._kaia.serial.engine[0];
                if (opRes.event === "serialUsbReady" && (obj._resolveFunc != null))
                    obj._resolveFunc(opRes.event);
                if ((opRes.event === "usbNotSupported" || opRes.event === "usbDeviceNotWorking" ||
                    opRes.event === "cdcDriverNotWorking") && (obj._rejectFunc != null))
                    obj._rejectFunc(opRes.event);
                if (obj._listener != null)
                    obj._listener(opRes.err, opRes);
            };
        }
        if (Serial._created)
            throw ('Only one instance allowed');
        window._kaia.serial.engine.push(this);
        this._handle = window._kaia.serial.engine.length - 1;
        Serial._created = true;
    }
    init(params) {
        if (this._initialized)
            throw ("Already initialized");
        this._initialized = true;
        params = params || {};
        let res = JSON.parse(window._kaia.serialInit(JSON.stringify(params)));
        return this._makePromise(res);
    }
    _clearCallback() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        window._kaia.serial.engine[this._handle] = null;
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
    write(params) {
        if (this.isClosed())
            throw ('Serial instance has been closed');
        if (typeof params === 'string')
            params = { message: params };
        return JSON.parse(window._kaia.serialWrite(JSON.stringify(params)));
    }
    _makePromise(res) {
        if (res.err)
            throw (res.err);
        let promise = new Promise((resolve, reject) => {
            this._resolveFunc = resolve;
            this._rejectFunc = reject;
        });
        window._kaia.serial.engine[this._handle] = this;
        return promise;
    }
    isClosed() {
        return this._closed;
    }
    close() {
        this._closed = true;
        let res = JSON.parse(window._kaia.serialClose());
        if (res.err)
            throw (res.err);
        this._clearCallback();
        this._listener = null;
    }
    setEventListener(listener) {
        this._listener = listener;
    }
}
Serial._created = false;
async function createSerial(params) {
    const serial = new Serial();
    const res = await serial.init(params || {});
    if (res !== "serialUsbReady")
        throw (res);
    return serial;
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
class TextToSpeech {
    constructor() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        this._initialized = false;
        this._closed = false;
        this._listener = null;
        if (window._kaia === undefined)
            throw ('TextToSpeech requires Android Kaia.ai app to run');
        if (window._kaia.textToSpeech === undefined) {
            window._kaia.textToSpeech = function () { };
            window._kaia.textToSpeech.engine = [];
            window._kaia.textToSpeech.cb = function (jsonString) {
                const opRes = JSON.parse(jsonString);
                const obj = window._kaia.textToSpeech.engine[0];
                if (opRes.event === "init" || opRes.event === "done" || opRes.event === "error") {
                    if (opRes.err && (obj._rejectFunc != null))
                        obj._rejectFunc(opRes.err);
                    else if (!opRes.err && (obj._resolveFunc != null))
                        obj._resolveFunc(opRes.event);
                }
                if (obj._listener != null)
                    obj._listener(opRes.err, opRes);
            };
        }
        if (TextToSpeech._created)
            throw ("Only one instance allowed");
        window._kaia.textToSpeech.engine.push(this);
        this._handle = window._kaia.textToSpeech.engine.length - 1;
        TextToSpeech._created = true;
    }
    init(params) {
        if (this._initialized)
            throw ("Already initialized");
        this._initialized = true;
        params = params || {};
        let res = JSON.parse(window._kaia.textToSpeechInit(JSON.stringify(params)));
        return this._makePromise(res);
    }
    _clearCallback() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        window._kaia.textToSpeech.engine[this._handle] = null;
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
    speak(params) {
        if (this.isClosed())
            throw ('TextToSpeech instance has been closed');
        if (typeof params === 'string')
            params = { text: params };
        let res = JSON.parse(window._kaia.textToSpeechSpeak(JSON.stringify(params)));
        return this._makePromise(res);
    }
    configure(params) {
        if (!params)
            throw ('Parameters object required');
        if (this.isClosed())
            throw ('TextToSpeech instance has been closed');
        return JSON.parse(window._kaia.textToSpeechConfigure(JSON.stringify(params)));
    }
    getConfig() {
        if (this.isClosed())
            throw ('TextToSpeech instance has been closed');
        return JSON.parse(window._kaia.textToSpeechGetConfig(''));
    }
    _makePromise(res) {
        if (res.err)
            throw (res.err);
        let promise = new Promise((resolve, reject) => {
            this._resolveFunc = resolve;
            this._rejectFunc = reject;
        });
        window._kaia.textToSpeech.engine[this._handle] = this;
        return promise;
    }
    isClosed() {
        return this._closed;
    }
    close() {
        this._closed = true;
        let res = JSON.parse(window._kaia.textToSpeechClose());
        if (res.err)
            throw (res.err);
        this._clearCallback();
        this._listener = null;
    }
    setEventListener(listener) {
        this._listener = listener;
    }
}
TextToSpeech._created = false;
async function createTextToSpeech(params) {
    const textToSpeech = new TextToSpeech();
    let res = await textToSpeech.init({});
    if (res !== "init")
        throw (res);
    if (params !== undefined) {
        res = textToSpeech.configure(params);
        if (res.err)
            throw (res);
    }
    return textToSpeech;
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
class Sensors {
    constructor() {
        this._initialized = false;
        this._closed = false;
        this._listener = null;
        if (window._kaia === undefined)
            throw ('Sensors requires Android Kaia.ai app to run');
        if (window._kaia.sensors === undefined) {
            window._kaia.sensors = function () { };
            window._kaia.sensors.engine = [];
            window._kaia.sensors.cb = function (jsonString) {
                const opRes = JSON.parse(jsonString);
                const obj = window._kaia.sensors.engine[0];
                if (obj._listener != null)
                    obj._listener(opRes.err, opRes);
            };
        }
        if (Sensors._created)
            throw ("Only one instance allowed");
        window._kaia.sensors.engine.push(this);
        this._handle = window._kaia.sensors.engine.length - 1;
        Sensors._created = true;
    }
    init(params) {
        if (this._initialized)
            throw ("Already initialized");
        this._initialized = true;
        params = params || {};
        return JSON.parse(window._kaia.sensorsInit(JSON.stringify(params)));
    }
    _clearCallback() {
        window._kaia.sensors.engine[this._handle] = null;
    }
    list() {
        if (this.isClosed())
            throw ('Sensors instance has been closed');
        return JSON.parse(window._kaia.sensorsList(''));
    }
    configure(params) {
        if (this.isClosed())
            throw ('Sensors instance has been closed');
        if (!params)
            throw ('Parameters object required');
        return JSON.parse(window._kaia.sensorsConfigure(JSON.stringify(params)));
    }
    describe(params) {
        if (this.isClosed())
            throw ('Sensors instance has been closed');
        if (!params)
            throw ('Argument required');
        if (Array.isArray(params))
            params = { sensors: params };
        return JSON.parse(window._kaia.sensorsDescribe(JSON.stringify(params)));
    }
    isClosed() {
        return this._closed;
    }
    close() {
        this._closed = true;
        let res = JSON.parse(window._kaia.sensorsClose());
        if (res.err)
            throw (res.err);
        this._clearCallback();
        this._listener = null;
    }
    setEventListener(listener) {
        this._listener = listener;
    }
}
Sensors._created = false;
function createSensors(params) {
    const sensors = new Sensors();
    const res = sensors.init(params || {});
    if (res.err)
        throw (res.err);
    return sensors;
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
class DeviceSettings {
    constructor() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        this._initialized = false;
        this._closed = false;
        this._listener = null;
        if (window._kaia === undefined)
            throw ('DeviceSettings requires Android Kaia.ai app to run');
        if (window._kaia.deviceSettings === undefined) {
            window._kaia.deviceSettings = function () { };
            window._kaia.deviceSettings.engine = [];
            window._kaia.deviceSettings.cb = function (jsonString) {
                const opRes = JSON.parse(jsonString);
                const obj = window._kaia.deviceSettings.engine[0];
                if (opRes.event === "getConfig" || opRes.event === "configure") {
                    if (opRes.err && (obj._rejectFunc != null))
                        obj._rejectFunc(opRes.err);
                    else if (!opRes.err && (obj._resolveFunc != null))
                        obj._resolveFunc(opRes);
                }
                if (obj._listener != null)
                    obj._listener(opRes.err, opRes);
            };
        }
        if (DeviceSettings._created)
            throw ("Only one instance allowed");
        window._kaia.deviceSettings.engine.push(this);
        this._handle = window._kaia.deviceSettings.engine.length - 1;
        DeviceSettings._created = true;
    }
    _clearCallback() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        window._kaia.deviceSettings.engine[this._handle] = null;
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
    async configure(params) {
        if (!params)
            throw ('Parameters object required');
        if (this.isClosed())
            throw ('DeviceSettings instance has been closed');
        const res = JSON.parse(window._kaia.deviceSettingsConfigure(JSON.stringify(params)));
        return this._makePromise(res);
    }
    async getConfig() {
        if (this.isClosed())
            throw ('DeviceSettings instance has been closed');
        const res = JSON.parse(window._kaia.deviceSettingsGetConfig(''));
        return this._makePromise(res);
    }
    _makePromise(res) {
        if (res.err)
            throw (res.err);
        let promise = new Promise((resolve, reject) => {
            this._resolveFunc = resolve;
            this._rejectFunc = reject;
        });
        window._kaia.deviceSettings.engine[this._handle] = this;
        return promise;
    }
    isClosed() {
        return this._closed;
    }
    close() {
        this._closed = true;
        let res = JSON.parse(window._kaia.deviceSettingsClose());
        if (res.err)
            throw (res.err);
        this._clearCallback();
        this._listener = null;
    }
    setEventListener(listener) {
        this._listener = listener;
    }
}
DeviceSettings._created = false;
function createDeviceSettings() {
    return new DeviceSettings();
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

exports.TensorFlowMobile = TensorFlowMobile;
exports.createTensorFlowMobile = createTensorFlowMobile;
exports.TensorFlowLite = TensorFlowLite;
exports.createTensorFlowLite = createTensorFlowLite;
exports.PocketSphinx = PocketSphinx;
exports.createPocketSphinx = createPocketSphinx;
exports.AndroidSpeechRecognizer = AndroidSpeechRecognizer;
exports.createAndroidSpeechRecognizer = createAndroidSpeechRecognizer;
exports.AndroidMultiDetector = AndroidMultiDetector;
exports.createAndroidMultiDetector = createAndroidMultiDetector;
exports.Serial = Serial;
exports.createSerial = createSerial;
exports.TextToSpeech = TextToSpeech;
exports.createTextToSpeech = createTextToSpeech;
exports.Sensors = Sensors;
exports.createSensors = createSensors;
exports.DeviceSettings = DeviceSettings;
exports.createDeviceSettings = createDeviceSettings;
