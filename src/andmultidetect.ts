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

export class AndroidMultiDetect {
   readonly _handle: number;
  _resolveFunc: Function | null = null;
  _rejectFunc: Function | null = null;
  _initialized: boolean = false;
  static _created: boolean = false;
  _closed: boolean = false;
  _listener: Function | null = null;

  constructor() {

    if (window._kaia === undefined)
      throw('kaia.js requires Android Kaia.ai app to run');

    if (window._kaia.androidMultiDetect === undefined) {
      window._kaia.androidMultiDetect = function () {};
      window._kaia.androidMultiDetect.engine = [];
      window._kaia.androidMultiDetect.cb = function (jsonString: string) {
        const opRes = JSON.parse(unescape(jsonString));
        const obj = window._kaia.androidMultiDetect.engine[0];
        if (opRes.event === "init" && (obj._rejectFunc != null) && (obj._resolveFunc != null))
          opRes.err ? obj._rejectFunc(opRes.err) : obj._resolveFunc(opRes);
        if (obj._listener != null)
          obj._listener(opRes.err, opRes);
      };
    }

    if (AndroidMultiDetect._created)
      throw('Only one instance allowed');

    window._kaia.androidMultiDetect.engine.push(this);
    this._handle = window._kaia.androidMultiDetect.engine.length - 1;
    AndroidMultiDetect._created = true;
  }

  init(params: any): Promise<any> {
    if (this._initialized)
      throw("Already initialized");
    this._initialized = true;

    let res = JSON.parse(window._kaia.androidMultiDetectInit(JSON.stringify(params || {})));
    return this._makePromise(res);
  }

  _clearCallback(): void {
    this._resolveFunc = null;
    this._rejectFunc = null;
    window._kaia.androidMultiDetect.engine[this._handle] = null;
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

  detect(params: any): Promise<any> {
    if (this.isClosed())

      throw('AndroidMultiDetect instance has been closed');
    if (params == undefined)
      params = {enabled: true};
    else if (typeof params == 'boolean')
      params = {enabled: params};

    let res = JSON.parse(window._kaia.androidMultiDetectDetect(JSON.stringify(params)));
    return this._makePromise(res);
  }

  _makePromise(res: any): Promise<any> {
    if (res.err)
      throw(res.err);

    let promise = new Promise<any>((resolve, reject) => {
      this._resolveFunc = resolve;
      this._rejectFunc = reject;
    });
    window._kaia.androidMultiDetect.engine[this._handle] = this;
    return promise;
  }

  isClosed(): boolean {
    return this._closed;
  }

  close(): void {
    this._closed = true;
    let res = JSON.parse(window._kaia.androidMultiDetectClose());
    if (res.err)
      throw(res.err);
    this._clearCallback();
    this._listener = null;
  }

  setEventListener(listener: Function | null): void {
    this._listener = listener;
  }
}

export async function createAndroidMultiDetect(params: any) {
  const androidMultiDetect = new AndroidMultiDetect();
  const res = await androidMultiDetect.init(params || {});
  if (typeof res === "string")
    throw(res);
  return androidMultiDetect;
}
