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

export class PocketSphinx {
  _resolveFunc: Function | null = null;
  _rejectFunc: Function | null = null;
  _initialized: boolean = false;
  _closed: boolean = false;
  _listener: Function | null = null;

  constructor() {

    if (window._kaia === undefined)
      throw('kaia.js requires Android Kaia.ai app to run');

    if (window._kaia.pocketSphinx === undefined) {
      window._kaia.pocketSphinx = function () {};
      window._kaia.pocketSphinx.cb = function (jsonString: string) {
console.log(jsonString);
        const opRes = JSON.parse(unescape(jsonString));
        if (opRes.event === "init" && (this._rejectFunc != null) && (this._resolveFunc != null))
          opRes.err ? this._rejectFunc(opRes.err) : this._resolveFunc(opRes);
        if (this._listener != null)
          this._listener(opRes.err, opRes);
      };
    }
  }

  init(params: any): Promise<any> {
    if (this._initialized)
      throw("Model already loaded");
    this._initialized = true;

    params = params || {};
    const model = params.modelZip;
    // check it's ArrayBuffer
    delete params.modelZip;

    // Must use Chrome
    const modelDecoded = model ? (new TextDecoder("iso-8859-1").decode(model)) : '';

    let res = JSON.parse(window._kaia.pocketSphinxInit(JSON.stringify(params), modelDecoded, ['abc','def']));
    return this._makePromise(res);
  }

  addSearch(params: any, model: ArrayBuffer): Promise<any> {
    // Must use Chrome
    const modelDecoded = model ? (new TextDecoder("iso-8859-1").decode(model)) : '';
    params = params || {};

    let res = JSON.parse(window._kaia.pocketSphinxAddSearch(JSON.stringify(params), modelDecoded));
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

  listen(params: any): Promise<any> {
    if (this.isClosed())
      throw('PocketSphinx instance has been closed');
    params = params || {active: true};
    if (typeof params == 'boolean')
      params = {active: params};

    let res = JSON.parse(window._kaia.pocketSphinxListen(JSON.stringify(params)));
    return this._makePromise(res);
  }

  _makePromise(res: any): Promise<any> {
    if (res.err)
      throw(res.err);

    let promise = new Promise<any>((resolve, reject) => {
      this._resolveFunc = resolve;
      this._rejectFunc = reject;
    });
    return promise;
  }

  isClosed(): boolean {
    return this._closed;
  }

  close(): void {
    this._closed = true;
    let res = JSON.parse(window._kaia.pocketSphinxClose());
    if (res.err)
      throw(res.err);
    this._clearCallback();
    this._listener = null;
  }

  setListener(listener: Function | null): void {
    this._listener = listener;
  }
}

export async function createPocketSphinx(params: any) {
  const pocketSphinx = new PocketSphinx();
  const res = await pocketSphinx.init(params || {});
  if (typeof res === "string")
    throw(res);
  return pocketSphinx;
}
