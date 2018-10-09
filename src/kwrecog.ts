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

export class KeywordRecognizer {
  readonly _handle: number;
  _resolveFunc: Function | null = null;
  _rejectFunc: Function | null = null;
  _configured: boolean = false;

  constructor() {

    if (window._kaia === undefined)
      throw('kaia.js requires Android Kaia.ai app to run');

    if (window._kaia.kwRecog === undefined) {
      window._kaia.kwRecog = function () {};
      window._kaia.kwRecog.engine = [];
      window._kaia.kwRecog.cb = function (jsonString: string) {
        const opRes = JSON.parse(unescape(jsonString));
        let obj = window._kaia.kwRecog.engine[opRes.handle];
        opRes.err ? obj._rejectFunc(opRes.err) : obj._resolveFunc(opRes);
      };
    }

    window._kaia.kwRecog.engine.push(this);
    this._handle = window._kaia.kwRecog.engine.length - 1;
  }

  configure(params: any, model: ArrayBuffer): Promise<any> {
    if (this._configured)
      throw("Already configured");
    this._configured = true;

    // Must use Chrome
    const modelDecoded = model ? (new TextDecoder("iso-8859-1").decode(model)) : '';
    params = params || {};
    params.handle = this._handle;

    let res = JSON.parse(window._kaia.kwRecogInit(JSON.stringify(params), modelDecoded));
    return this._makePromise(res);
  }

  _clearCallback(): void {
    this._resolveFunc = null;
    this._rejectFunc = null;
    window._kaia.kwRecog.engine[this._handle] = null;
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
      throw('KeywordRecognizer instance has been closed');
    params = params || {active: true};
    if (typeof params == 'boolean')
      params = {active: params};
    params.handle = this._handle;

    let res = JSON.parse(window._kaia.kwRecogListen(JSON.stringify(params)));
    return this._makePromise(res);
  }

  _makePromise(res: any): Promise<any> {
    if (res.err)
      throw(res.err);

    let promise = new Promise<any>((resolve, reject) => {
      this._resolveFunc = resolve;
      this._rejectFunc = reject;
    });
    window._kaia.kwRecog.engine[this._handle] = this;
    return promise;
  }

  isClosed(): boolean {
    return window._kaia.kwRecog.engine[this._handle] === null;
  }

  close(): void {
    let params = { handle: this._handle };
    window._kaia.kwRecog.engine[this._handle] = null;
    let res = JSON.parse(window._kaia.kwRecogClose(JSON.stringify(params)));
    if (res.err)
      throw(res.err);
  }
}

export async function createKeywordRecognizer(params: any, model: ArrayBuffer) {
  const kwRecog = new KeywordRecognizer();
  const res = await kwRecog.configure(params || {}, model);
  if (typeof res === "string")
    throw(res);
  return kwRecog;
}
