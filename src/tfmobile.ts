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

export class TfMobile {
  readonly _handle: number;
  _resolveFunc: Function | null = null;
  _rejectFunc: Function | null = null;
  _modelLoaded: boolean = false;

  constructor() {

    if (window._kaia === undefined)
      throw('kaia.js requires Android Kaia.ai app to run');

    if (window._kaia.tfMobile === undefined) {
      window._kaia.tfMobile = function () {};
      window._kaia.tfMobile.engine = [];
      window._kaia.tfMobile.cb = function (jsonString: string) {
        const opRes = JSON.parse(unescape(jsonString));
        let obj = window._kaia.tfMobile.engine[opRes.handle];
        opRes.err ? obj._rejectFunc(opRes.err) : obj._resolveFunc(opRes);
      };
    }

    window._kaia.tfMobile.engine.push(this);
    this._handle = window._kaia.tfMobile.engine.length - 1;
  }

  init(model: ArrayBuffer, params: any): Promise<any> {
    if (this._modelLoaded)
      throw("Model already loaded");
    this._modelLoaded = true;

    // Must use Chrome
    const modelDecoded = new TextDecoder("iso-8859-1").decode(model);

    params = params || {};
    params.handle = this._handle;

    let res = JSON.parse(window._kaia.tfMobileInit(JSON.stringify(params), modelDecoded));
    return this._makePromise(res);
  }

  _clearCallback(): void {
    this._resolveFunc = null;
    this._rejectFunc = null;
    window._kaia.tfMobile.engine[this._handle] = null;
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

  run(data: ArrayBuffer[], params: any): Promise<any> {
    if (this.isClosed())
      throw('TfMobile instance has been closed');
    const textDecoder = new TextDecoder("iso-8859-1");
    let dataDecoded = [];
    for (let i = 0; i < data.length; i++)
      dataDecoded[i] = textDecoder.decode(data[i]);
    params = params || {};
    params.handle = this._handle;

    let res = JSON.parse(window._kaia.tfMobileRun(JSON.stringify(params), dataDecoded));
    return this._makePromise(res);
  }

  _makePromise(res: any): Promise<any> {
    if (res.err)
      throw(res.err);

    let promise = new Promise<any>((resolve, reject) => {
      this._resolveFunc = resolve;
      this._rejectFunc = reject;
    });
    window._kaia.tfMobile.engine[this._handle] = this;
    return promise;
  }

  isClosed(): boolean {
    return window._kaia.tfMobile.engine[this._handle] === null;
  }

  close(): void {
    let params = { handle: this._handle };
    window._kaia.tfMobile.engine[this._handle] = null;
    let res = JSON.parse(window._kaia.tfMobileClose(JSON.stringify(params)));
    if (res.err)
      throw(res.err);
    this._clearCallback();
  }
}

export async function createTfMobile(model: ArrayBuffer, params: any) {
  const tfMobile = new TfMobile();
  const res = await tfMobile.init(model, params || {});
  if (typeof res === "string")
    throw(res);
  return tfMobile;
}
