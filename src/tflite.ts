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

export class TensorFlowLite {
  _handle: number = -1;
   _closed: boolean = false;
  _resolveFunc: Function | null = null;
  _rejectFunc: Function | null = null;
  _modelLoaded: boolean = false;
  _listener: any;

  constructor() {
    if (window._kaia === undefined)
      throw 'TensorFlowLite requires Android Kaia.ai app to run';

    if (window._kaia.tensorFlowLite === undefined) {
      window._kaia.tensorFlowLite = function() {};
      window._kaia.tensorFlowLite.engine = [];
      window._kaia.tensorFlowLite.cb = function(jsonString: string) {
        const opRes = JSON.parse(unescape(jsonString));
        let obj = window._kaia.tensorFlowLite.engine[opRes.handle];
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

    window._kaia.tensorFlowLite.engine.push(this);
    this._handle = window._kaia.tensorFlowLite.engine.length - 1;

    if (this._modelLoaded)
      return Promise.reject('Model already loaded');
    this._modelLoaded = true;

    // Must use Chrome
    const modelDecoded = new TextDecoder('iso-8859-1').decode(model);

    params = params || {};
    this.setEventListener(params.eventListener);
    params.handle = this._handle;

    let res = JSON.parse(window._kaia.tensorFlowLiteInit(JSON.stringify(params), modelDecoded));
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
      return Promise.reject('TensorFlowLite instance has been closed');
    const textDecoder = new TextDecoder('iso-8859-1');
    let dataDecoded = [];
    for (let i = 0; i < data.length; i++)
      dataDecoded[i] = textDecoder.decode(data[i]);
    params = params || {};
    params.handle = this._handle;

    let res = JSON.parse(window._kaia.tensorFlowLiteRun(JSON.stringify(params), dataDecoded));
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
    return this._closed;
    //return window._kaia.tensorFlowLite.engine[this._handle] === null;
  }

  close(): void {
    this._closed = true;
    let params = { handle: this._handle };
    let res = JSON.parse(window._kaia.tensorFlowLiteClose(JSON.stringify(params)));
    this._listener = null;
    this._clearCallback();
    //window._kaia.tensorFlowLite.engine[this._handle] = null;
    if (res.err)
      throw res.err;
  }

  setEventListener(listener: any): void {
    if (!listener || typeof listener === 'function')
      this._listener = listener;
  }
}

export async function createTensorFlowLite(model: ArrayBuffer, params: any) {
  const tfLite = new TensorFlowLite();
  return tfLite.init(model, params);
}
