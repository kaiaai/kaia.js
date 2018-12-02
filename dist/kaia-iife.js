var kaiaJs = (function (exports) {
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
class TensorFlowMobile {
    constructor() {
        this._handle = -1;
        this._resolveFunc = null;
        this._rejectFunc = null;
        this._modelLoaded = false;
        this._listener = null;
    }
    async init(model, params) {
        if (window._kaia === undefined)
            return Promise.reject('TensorFlowMobile requires Android Kaia.ai app to run');
        if (this._handle !== -1)
            return Promise.reject('Already initialized');
        if (window._kaia.tensorFlowMobile === undefined) {
            window._kaia.tensorFlowMobile = function () { };
            window._kaia.tensorFlowMobile.engine = [];
            window._kaia.tensorFlowMobile.cb = function (jsonString) {
                const opRes = JSON.parse(unescape(jsonString));
                const obj = window._kaia.tensorFlowMobile.engine[opRes.handle];
                opRes.err ? obj._rejectFunc(opRes.err) :
                    obj._resolveFunc(opRes.event === 'init' ? this : opRes);
                if (obj._listener != null)
                    obj._listener(opRes.err, opRes);
            };
        }
        window._kaia.tensorFlowMobile.engine.push(this);
        this._handle = window._kaia.tensorFlowMobile.engine.length - 1;
        if (this._modelLoaded)
            return Promise.reject('Model already loaded');
        this._modelLoaded = true;
        // Must use Chrome
        const modelDecoded = new TextDecoder("iso-8859-1").decode(model);
        params = params || {};
        params.handle = this._handle;
        if (typeof params.eventListener === 'function')
            this.setEventListener(params.eventListener);
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
    async run(data, params) {
        if (this.isClosed())
            Promise.reject('TensorFlowMobile instance has been closed');
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
            return Promise.reject(res.err);
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
    setEventListener(listener) {
        this._listener = listener;
    }
    close() {
        let params = { handle: this._handle };
        window._kaia.tensorFlowMobile.engine[this._handle] = null;
        let res = JSON.parse(window._kaia.tensorFlowMobileClose(JSON.stringify(params)));
        this._listener = null;
        this._clearCallback();
        if (res.err)
            throw res.err;
    }
}
async function createTensorFlowMobile(model, params) {
    const tfMobile = new TensorFlowMobile();
    return tfMobile.init(model, params);
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
        this._handle = -1;
        this._resolveFunc = null;
        this._rejectFunc = null;
        this._modelLoaded = false;
        this._listener = null;
        if (window._kaia === undefined)
            throw 'TensorFlowLite requires Android Kaia.ai app to run';
        if (window._kaia.tensorFlowLite === undefined) {
            window._kaia.tensorFlowLite = function () { };
            window._kaia.tensorFlowLite.engine = [];
            window._kaia.tensorFlowLite.cb = function (jsonString) {
                const opRes = JSON.parse(unescape(jsonString));
                let obj = window._kaia.tensorFlowLite.engine[opRes.handle];
                if (opRes.err)
                    obj._reject(opRes.err);
                else
                    obj._resolve(opRes.event === 'init' ? obj : opRes);
                if (obj._listener != null)
                    obj._listener(opRes.err, opRes);
            };
        }
    }
    async init(model, params) {
        if (this._handle !== -1)
            return Promise.reject('Already initialized');
        if (params && typeof params.eventListener === 'function')
            this.setEventListener(params.eventListener);
        window._kaia.tensorFlowLite.engine.push(this);
        this._handle = window._kaia.tensorFlowLite.engine.length - 1;
        if (this._modelLoaded)
            return Promise.reject('Model already loaded');
        this._modelLoaded = true;
        // Must use Chrome
        const modelDecoded = new TextDecoder('iso-8859-1').decode(model);
        params = params || {};
        params.handle = this._handle;
        let res = JSON.parse(window._kaia.tensorFlowLiteInit(JSON.stringify(params), modelDecoded));
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
    async run(data, params) {
        if (this.isClosed())
            return Promise.reject('TensorFlowLite instance has been closed');
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
            return Promise.reject(res.err);
        let promise = new Promise((resolve, reject) => {
            this._resolveFunc = resolve;
            this._rejectFunc = reject;
        });
        return promise;
    }
    isClosed() {
        return window._kaia.tensorFlowLite.engine[this._handle] === null;
    }
    setEventListener(listener) {
        this._listener = listener;
    }
    close() {
        let params = { handle: this._handle };
        let res = JSON.parse(window._kaia.tensorFlowLiteClose(JSON.stringify(params)));
        this._listener = null;
        this._clearCallback();
        window._kaia.tensorFlowLite.engine[this._handle] = null;
        if (res.err)
            throw res.err;
    }
}
async function createTensorFlowLite(model, params) {
    const tfLite = new TensorFlowLite();
    return tfLite.init(model, params);
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
        this._closed = false;
        this._listener = null;
    }
    _extractArrayBufs(params) {
        const data = [];
        const fileNames = [];
        const textDecoder = new TextDecoder("iso-8859-1");
        if (params.searchFile) {
            if (!Array.isArray(params.searchFile))
                throw 'searchFile must be an array';
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
    async init(params) {
        if (window._kaia === undefined)
            return Promise.reject('PocketSphinx requires Android Kaia.ai app to run');
        if (window._kaia.pocketSphinx === undefined) {
            window._kaia.pocketSphinx = function () { };
            window._kaia.pocketSphinx.engine = this;
            window._kaia.pocketSphinx.cb = function (jsonString) {
                const opRes = JSON.parse(unescape(jsonString));
                const obj = window._kaia.pocketSphinx.engine;
                if (opRes.event === 'init' && (obj._rejectFunc != null) && (obj._resolveFunc != null))
                    opRes.err ? obj._rejectFunc(opRes.err) : obj._resolveFunc(opRes);
                if (obj._listener != null)
                    obj._listener(opRes.err, opRes);
            };
        }
        if (PocketSphinx._created)
            return Promise.reject('Only one instance allowed');
        PocketSphinx._created = true;
        params = params || {};
        if (typeof params.eventListener === 'function')
            this.setEventListener(params.eventListener);
        const data = this._extractArrayBufs(params);
        let res = JSON.parse(window._kaia.pocketSphinxInit(JSON.stringify(params), data));
        return this._makePromise(res);
    }
    async addSearch(params) {
        params = params || {};
        const data = this._extractArrayBufs(params);
        let res = JSON.parse(window._kaia.pocketSphinxAddSearch(JSON.stringify(params), data));
        return this._makePromise(res);
    }
    _clearCallback() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        window._kaia.pocketSphinx.engine = null;
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
    async listen(params) {
        if (this.isClosed())
            return Promise.reject('PocketSphinx instance has been closed');
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
            return Promise.reject(res.err);
        let promise = new Promise((resolve, reject) => {
            this._resolveFunc = resolve;
            this._rejectFunc = reject;
        });
        window._kaia.pocketSphinx.engine = this;
        return promise;
    }
    isClosed() {
        return this._closed;
    }
    close() {
        this._closed = true;
        let res = JSON.parse(window._kaia.pocketSphinxClose());
        if (res.err)
            throw res.err;
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
    return pocketSphinx.init(params);
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
        this._closed = false;
        this._listener = null;
        if (window._kaia === undefined)
            throw 'AndroidSpeechRecognizer requires Android Kaia.ai app to run';
        if (AndroidSpeechRecognizer.singleton())
            throw 'Only one instance allowed';
        window._kaia.androidSpeechRecognizer = function () { };
        window._kaia.androidSpeechRecognizer.engine = this;
        window._kaia.androidSpeechRecognizer.cb = function (jsonString) {
            const opRes = JSON.parse(unescape(jsonString));
            const obj = window._kaia.androidSpeechRecognizer.engine;
            if (opRes.event === 'init')
                if (opRes.err)
                    obj._reject(opRes.err);
                else
                    obj._resolve(this);
            if (obj._listener != null)
                obj._listener(opRes.err, opRes);
        };
    }
    static singleton() {
        return (window._kaia && window._kaia.androidSpeechRecognizer) ?
            window._kaia.androidSpeechRecognizer.engine : undefined;
    }
    async init(params) {
        if (AndroidSpeechRecognizer.initialized)
            return Promise.reject('Already initialized');
        if (params && typeof params.eventListener === 'function')
            this.setEventListener(params.eventListener);
        let res = JSON.parse(window._kaia.androidSpeechRecognizerInit(JSON.stringify(params || {})));
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
    async listen(params) {
        if (this.isClosed())
            return Promise.reject('AndroidSpeechRecognizer instance has been closed');
        if (params == undefined)
            params = { enabled: true };
        else if (typeof params == 'boolean')
            params = { enabled: params };
        let res = JSON.parse(window._kaia.androidSpeechRecognizerListen(JSON.stringify(params)));
        return this._makePromise(res);
    }
    _makePromise(res) {
        if (res.err)
            return Promise.reject(res.err);
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
        let res = JSON.parse(window._kaia.androidSpeechRecognizerClose());
        if (res.err)
            throw res.err;
        this._clearCallback();
        this._listener = null;
    }
    setEventListener(listener) {
        this._listener = listener;
    }
}
AndroidSpeechRecognizer.initialized = false;
async function createAndroidSpeechRecognizer(params) {
    const androidSpeechRecognizer = AndroidSpeechRecognizer.singleton() || new AndroidSpeechRecognizer();
    return AndroidSpeechRecognizer.initialized ?
        Promise.resolve(androidSpeechRecognizer) : androidSpeechRecognizer.init(params);
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
        this._handle = -1;
        this._resolveFunc = null;
        this._rejectFunc = null;
        this._closed = false;
        this._listener = null;
    }
    async init(params) {
        if (window._kaia === undefined)
            return Promise.reject('AndroidMultiDetector requires Android Kaia.ai app to run');
        if (this._handle !== -1)
            return Promise.reject('Already initialized');
        if (window._kaia.androidMultiDetector === undefined) {
            window._kaia.androidMultiDetector = function () { };
            window._kaia.androidMultiDetector.engine = this;
            window._kaia.androidMultiDetector.cb = function (jsonString) {
                const opRes = JSON.parse(unescape(jsonString));
                const obj = window._kaia.androidMultiDetector.engine;
                if (opRes.event === 'init' && (obj._rejectFunc != null) && (obj._resolveFunc != null))
                    opRes.err ? obj._rejectFunc(opRes.err) : obj._resolveFunc(this);
                if (obj._listener != null)
                    obj._listener(opRes.err, opRes);
            };
        }
        if (AndroidMultiDetector._created)
            return Promise.reject('Only one instance allowed');
        AndroidMultiDetector._created = true;
        params = params || {};
        if (params.eventListener)
            this.setEventListener(params.eventListener);
        let res = JSON.parse(window._kaia.androidMultiDetectorInit(JSON.stringify(params)));
        return this._makePromise(res);
    }
    _clearCallback() {
        this._resolveFunc = null;
        this._rejectFunc = null;
        window._kaia.androidMultiDetector.engine = null;
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
    async detect(params) {
        if (this.isClosed())
            return Promise.reject('AndroidMultiDetector instance has been closed');
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
            return Promise.reject('Unsupported argument type');
        let res = JSON.parse(window._kaia.androidMultiDetectorDetect(params));
        return this._makePromise(res);
    }
    _makePromise(res) {
        if (res.err)
            return Promise.reject(res.err);
        let promise = new Promise((resolve, reject) => {
            this._resolveFunc = resolve;
            this._rejectFunc = reject;
        });
        window._kaia.androidMultiDetector.engine = this;
        return promise;
    }
    isClosed() {
        return this._closed;
    }
    close() {
        this._closed = true;
        let res = JSON.parse(window._kaia.androidMultiDetectorClose(''));
        if (res.err)
            throw res.err;
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
    return androidMultiDetector.init(params);
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
        this._closed = false;
        this._listener = null;
        if (window._kaia === undefined)
            throw 'Serial requires Android Kaia.ai app to run';
        if (Serial.singleton())
            throw 'Only one instance allowed';
        window._kaia.serial = function () { };
        window._kaia.serial.engine = this;
        window._kaia.serial.cb = function (jsonString) {
            const opRes = JSON.parse(jsonString);
            const obj = window._kaia.serial.engine;
            if (opRes.event === 'serialUsbReady')
                obj._resolve(obj);
            if ((opRes.event === 'usbNotSupported' || opRes.event === 'usbDeviceNotWorking' ||
                opRes.event === 'cdcDriverNotWorking'))
                obj._reject(opRes.event);
            if (obj._listener != null)
                obj._listener(opRes.err, opRes);
        };
    }
    static singleton() {
        return (window._kaia && window._kaia.serial) ?
            window._kaia.serial.engine : undefined;
    }
    async init(params) {
        if (Serial.initialized)
            return Promise.reject('Already initialized');
        if (params && typeof params.eventListener === 'function')
            this.setEventListener(params.eventListener);
        Serial.initialized = true;
        let res = JSON.parse(window._kaia.serialInit(JSON.stringify(params || {})));
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
    write(params) {
        if (this.isClosed())
            throw 'Serial instance has been closed';
        if (typeof params === 'string')
            params = { message: params };
        return JSON.parse(window._kaia.serialWrite(JSON.stringify(params)));
    }
    _makePromise(res) {
        if (res.err)
            return Promise.reject(res.err);
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
        let res = JSON.parse(window._kaia.serialClose());
        if (res.err)
            throw res.err;
        this._clearCallback();
        this._listener = null;
    }
    setEventListener(listener) {
        this._listener = listener;
    }
}
Serial.initialized = false;
async function createSerial(params) {
    const serial = Serial.singleton() || new Serial();
    return Serial.initialized ? Promise.resolve(serial) : serial.init(params);
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
        this._closed = false;
        this._listener = null;
        if (window._kaia === undefined)
            throw 'TextToSpeech requires Android Kaia.ai app to run';
        if (TextToSpeech.singleton())
            throw 'Only one instance allowed';
        window._kaia.textToSpeech = function () { };
        window._kaia.textToSpeech.engine = this;
        window._kaia.textToSpeech.cb = function (jsonString) {
            const opRes = JSON.parse(jsonString);
            const obj = window._kaia.textToSpeech.engine;
            if (opRes.event === 'init' || opRes.event === 'done' || opRes.event === 'error') {
                if (opRes.err)
                    obj._reject(opRes.err);
                else if (!opRes.err)
                    obj._resolve(opRes.event === 'init' ? obj : opRes.event);
            }
            if (obj._listener != null)
                obj._listener(opRes.err, opRes);
        };
    }
    static singleton() {
        return (window._kaia && window._kaia.textToSpeech) ?
            window._kaia.textToSpeech.engine : undefined;
    }
    async init(params) {
        if (TextToSpeech.initialized)
            return Promise.reject('Already initialized');
        if (params && typeof params.eventListener === 'function')
            this.setEventListener(params.eventListener);
        TextToSpeech.initialized = true;
        let res = JSON.parse(window._kaia.textToSpeechInit(JSON.stringify(params || {})));
        if (params) {
            await this._makePromise(res);
            return this.configure(params);
        }
        else
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
    async speak(params) {
        if (this.isClosed())
            throw 'TextToSpeech instance has been closed';
        if (typeof params === 'string')
            params = { text: params };
        let res = JSON.parse(window._kaia.textToSpeechSpeak(JSON.stringify(params)));
        return this._makePromise(res);
    }
    async configure(params) {
        if (!params)
            return Promise.resolve(this);
        if (this.isClosed())
            return Promise.reject('TextToSpeech instance has been closed');
        const res = JSON.parse(window._kaia.textToSpeechConfigure(JSON.stringify(params)));
        return res.err ? Promise.reject(res.err) : Promise.resolve(this);
    }
    getConfig() {
        if (this.isClosed())
            throw 'TextToSpeech instance has been closed';
        return JSON.parse(window._kaia.textToSpeechGetConfig(''));
    }
    _makePromise(res) {
        if (res.err)
            return Promise.reject(res.err);
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
        let res = JSON.parse(window._kaia.textToSpeechClose());
        if (res.err)
            throw res.err;
        this._clearCallback();
        this._listener = null;
    }
    setEventListener(listener) {
        this._listener = listener;
    }
}
TextToSpeech.initialized = false;
async function createTextToSpeech(params) {
    const textToSpeech = TextToSpeech.singleton() || new TextToSpeech();
    return TextToSpeech.initialized ? textToSpeech.configure(params) :
        textToSpeech.init(params);
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
        this._closed = false;
        this._listener = null;
    }
    async init(params) {
        if (window._kaia === undefined)
            return Promise.reject('Sensors requires Android Kaia.ai app to run');
        if (window._kaia.sensors === undefined) {
            window._kaia.sensors = function () { };
            window._kaia.sensors.engine = this;
            window._kaia.sensors.cb = function (jsonString) {
                const opRes = JSON.parse(jsonString);
                const obj = window._kaia.sensors.engine;
                if (obj._listener != null)
                    obj._listener(opRes.err, opRes);
            };
        }
        if (Sensors._created)
            return Promise.reject('Only one instance allowed');
        Sensors._created = true;
        params = params || {};
        if (params && typeof params.eventListener === 'function')
            this.setEventListener(params.eventListener);
        const res = JSON.parse(window._kaia.sensorsInit(JSON.stringify(params)));
        return res.err ? Promise.reject(res.err) : Promise.resolve(this);
    }
    _clearCallback() {
        window._kaia.sensors.engine = null;
    }
    list() {
        if (this.isClosed())
            throw 'Sensors instance has been closed';
        return JSON.parse(window._kaia.sensorsList(''));
    }
    configure(params) {
        if (this.isClosed())
            throw 'Sensors instance has been closed';
        if (!params)
            throw 'Parameters object required';
        return JSON.parse(window._kaia.sensorsConfigure(JSON.stringify(params)));
    }
    describe(params) {
        if (this.isClosed())
            throw 'Sensors instance has been closed';
        if (!params)
            throw 'Argument required';
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
            throw res.err;
        this._clearCallback();
        this._listener = null;
    }
    setEventListener(listener) {
        this._listener = listener;
    }
}
Sensors._created = false;
async function createSensors(params) {
    const sensors = new Sensors();
    return sensors.init(params);
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
        this._closed = false;
        this._listener = null;
        if (window._kaia === undefined)
            throw 'DeviceSettings requires Android Kaia.ai app to run';
        if (DeviceSettings.singleton())
            throw 'Only one instance allowed';
        window._kaia.deviceSettings = function () { };
        window._kaia.deviceSettings.engine = this;
        window._kaia.deviceSettings.cb = function (jsonString) {
            const opRes = JSON.parse(jsonString);
            const obj = window._kaia.deviceSettings.engine; // get this
            if (opRes.event === 'configure' || opRes.event === 'getConfig') {
                if (opRes.err)
                    obj._reject(opRes.err);
                else if (!opRes.err)
                    obj._resolve(opRes.event === 'configure' ? obj : opRes);
            }
            if (obj._listener != null)
                obj._listener(opRes.err, opRes);
        };
    }
    static singleton() {
        return (window._kaia && window._kaia.deviceSettings) ?
            window._kaia.deviceSettings.engine : undefined;
    }
    async init(params) {
        if (DeviceSettings.initialized)
            return Promise.reject('Already initialized');
        if (params && typeof params.eventListener === 'function')
            this.setEventListener(params.eventListener);
        DeviceSettings.initialized = true;
        return (typeof params === 'object') ? this.configure(params) : Promise.resolve(this);
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
    async configure(params) {
        if (!params)
            return Promise.resolve(this);
        if (this.isClosed())
            return Promise.reject('DeviceSettings instance has been closed');
        params = params || {};
        const res = JSON.parse(window._kaia.deviceSettingsConfigure(JSON.stringify(params)));
        return this._makePromise(res);
    }
    async getConfig() {
        if (this.isClosed())
            return Promise.reject('DeviceSettings instance has been closed');
        const res = JSON.parse(window._kaia.deviceSettingsGetConfig(''));
        return this._makePromise(res);
    }
    _makePromise(res) {
        if (res.err)
            return Promise.reject(res.err);
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
        let res = JSON.parse(window._kaia.deviceSettingsClose());
        if (res.err)
            throw res.err;
        this._clearCallback();
        this._listener = null;
    }
    setEventListener(listener) {
        this._listener = listener;
    }
}
DeviceSettings.initialized = false;
async function createDeviceSettings(params) {
    const deviceSettings = DeviceSettings.singleton() || new DeviceSettings();
    return DeviceSettings.initialized ? deviceSettings.configure(params) :
        deviceSettings.init(params);
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

return exports;

}({}));
