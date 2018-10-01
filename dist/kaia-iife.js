var idbKeyval = (function (exports) {
'use strict';

class TfMobile {
    constructor() {
        this._resolvePromise = null;
        this._rejectPromise = null;
        this._modelLoaded = false;
        if (window._kaia === undefined)
            throw ('kaia.js requires Android Kaia.ai app to run');
        console.log('TfMobile constructor called');
        if (window._kaia.tfmobile === undefined) {
            window._kaia.tfmobile = function () { };
            window._kaia.tfmobile.engine = [];
            window._kaia.tfmobile.cb = function (jsonString) {
                const opRes = JSON.parse(unescape(jsonString));
                console.log(opRes);
                let obj = window._kaia.tfmobile.engine[opRes.handle];
                opRes.err ? obj._rejectPromise(opRes.err) : obj._resolvePromise(opRes);
            };
        }
        window._kaia.tfmobile.engine.push(this);
        this._handle = window._kaia.tfmobile.engine.length - 1;
        console.log('_handle = ' + this._handle);
    }
    loadModel(model, params) {
        if (this._modelLoaded)
            throw ("Model already loaded");
        this._modelLoaded = true;
        // Must use Chrome
        const modelDecoded = new TextDecoder("iso-8859-1").decode(model);
        params = params || {};
        params.handle = this._handle;
        let res = JSON.parse(window._kaia.tfmobileInit(modelDecoded, JSON.stringify(params)));
        return this._makePromise(res);
    }
    _clearCallback() {
        this._resolvePromise = null;
        this._rejectPromise = null;
        window._kaia.tfmobile.engine[this._handle] = null;
    }
    _resolve(res) {
        let cb = this._resolvePromise;
        this._clearCallback();
        if (cb !== null)
            cb(res);
    }
    _reject(err) {
        let cb = this._rejectPromise;
        this._clearCallback();
        if (cb !== null)
            cb(err);
    }
    run(data, params) {
        if (this.isClosed())
            throw ('Engine instance has been closed');
        const textDecoder = new TextDecoder("iso-8859-1");
        let dataDecoded = [];
        for (let i = 0; i < data.length; i++)
            dataDecoded[i] = textDecoder.decode(data[i]);
        params = params || {};
        params.handle = this._handle;
        let res = JSON.parse(window._kaia.tfmobileRun(dataDecoded, JSON.stringify(params)));
        return this._makePromise(res);
    }
    _makePromise(res) {
        if (res.err)
            throw (res.err);
        let promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
        window._kaia.tfmobile.engine[this._handle] = this;
        return promise;
    }
    isClosed() {
        return window._kaia.tfmobile.engine[this._handle] === null;
    }
    close() {
        let params = { handle: this._handle };
        window._kaia.tfmobile.engine[this._handle] = null;
        let res = window._kaia.tfmobileClose(params);
        if (res.err)
            throw (res.err);
    }
}

exports.TfMobile = TfMobile;

return exports;

}({}));
