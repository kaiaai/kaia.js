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

export class TensorFlowMobile {
  _handle: number = -1;
  _closed: boolean = false;
  _resolveFunc: Function | null = null;
  _rejectFunc: Function | null = null;
  _modelLoaded: boolean = false;
  _listener: any;

  constructor() {
    if (window._kaia === undefined)
      throw 'TensorFlowLite requires Android Kaia.ai app to run';

    if (window._kaia.tensorFlowMobile === undefined) {
      window._kaia.tensorFlowMobile = function() {};
      window._kaia.tensorFlowMobile.engine = [];
      window._kaia.tensorFlowMobile.cb = function(jsonString: string) {
        const opRes = JSON.parse(unescape(jsonString));
        const obj = window._kaia.tensorFlowMobile.engine[opRes.handle];
        if (opRes.err)
          obj._reject(opRes.err);
        else
          obj._resolve(opRes.event === 'init' ? obj : opRes);
        if (obj._listener)
          obj._listener(opRes.err, opRes);
      };
    }
  }

  async init(model: ArrayBuffer, params: any): Promise<any> {
    if (this._handle !== -1)
      return Promise.reject('Already initialized');

    window._kaia.tensorFlowMobile.engine.push(this);
    this._handle = window._kaia.tensorFlowMobile.engine.length - 1;

    if (this._modelLoaded)
      return Promise.reject('Model already loaded');
    this._modelLoaded = true;

    // Must use Chrome
    const modelDecoded = new TextDecoder("iso-8859-1").decode(model);

    params = params || {};
    this.setEventListener(params.eventListener);
    params.handle = this._handle;

    let res = JSON.parse(window._kaia.tensorFlowMobileInit(JSON.stringify(params), modelDecoded));
    return this._makePromise(res);
  }

  _clearCallback(): void {
    this._resolveFunc = null;
    this._rejectFunc = null;
  }

  _resolve(res: any): void {
    let cb = this._resolveFunc;
    this._clearCallback();
    if (cb !== null)
      cb(res);
  }

  _reject(err: any): void {
    let cb = this._rejectFunc;
    this._clearCallback();
    if (cb !== null)
      cb(err);
  }

  async run(data: ArrayBuffer[], params: any): Promise<any> {
    if (this.closed())
      return Promise.reject('TensorFlowMobile instance has been closed');
    const textDecoder = new TextDecoder('iso-8859-1');
    let dataDecoded = [];
    for (let i = 0; i < data.length; i++)
      dataDecoded[i] = textDecoder.decode(data[i]);
    params = params || {};
    params.handle = this._handle;

    let res = JSON.parse(window._kaia.tensorFlowMobileRun(JSON.stringify(params), dataDecoded));
    return this._makePromise(res);
  }

  _makePromise(res: any): Promise<any> {
    if (res.err)
      return Promise.reject(res.err);

    let promise = new Promise<any>((resolve, reject) => {
      this._resolveFunc = resolve;
      this._rejectFunc = reject;
    });
    return promise;
  }

  closed(): boolean {
    // return window._kaia.tensorFlowMobile.engine[this._handle] === null;
    return this._closed;
  }

  close(): void {
    this._closed = true;
    let params = { handle: this._handle };
    let res = JSON.parse(window._kaia.tensorFlowMobileClose(JSON.stringify(params)));
    this._clearCallback();
    this._listener = null;
    // window._kaia.tensorFlowMobile.engine[this._handle] = null;
    if (res.err)
      throw res.err;
  }

  setEventListener(listener: any): void {
    if (!listener || typeof listener === 'function')
      this._listener = listener;
  }
}

export async function createTensorFlowMobile(model: ArrayBuffer, params: any) {
  const tfMobile = new TensorFlowMobile();
  return tfMobile.init(model, params);
}
