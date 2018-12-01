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

export class AndroidMultiDetector {
   _handle: number = -1;
  _resolveFunc: Function | null = null;
  _rejectFunc: Function | null = null;
  static _created: boolean = false;
  _closed: boolean = false;
  _listener: Function | null = null;

  constructor() {
  }

  async init(params: any): Promise<any> {

    if (window._kaia === undefined)
      return Promise.reject('AndroidMultiDetector requires Android Kaia.ai app to run');
    if (this._handle !== -1)
      return Promise.reject('Already initialized');

    if (window._kaia.androidMultiDetector === undefined) {
      window._kaia.androidMultiDetector = function() {};
      window._kaia.androidMultiDetector.engine = this;
      window._kaia.androidMultiDetector.cb = function(jsonString: string) {
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

  _clearCallback(): void {
    this._resolveFunc = null;
    this._rejectFunc = null;
    window._kaia.androidMultiDetector.engine = null;
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

  async detect(params: any): Promise<any> {
    if (this.isClosed())
      return Promise.reject('AndroidMultiDetector instance has been closed');
    if (params === undefined)
      params = {enabled: true};
    else if (typeof params === 'boolean')
      params = {enabled: params};
    else if (params instanceof ArrayBuffer) {
      const textDecoder = new TextDecoder("iso-8859-1");
      params = textDecoder.decode(params);
    } else if (typeof params === 'string') {}
    else
      return Promise.reject('Unsupported argument type');

    let res = JSON.parse(window._kaia.androidMultiDetectorDetect(params));
    return this._makePromise(res);
  }

  _makePromise(res: any): Promise<any> {
    if (res.err)
      return Promise.reject(res.err);

    let promise = new Promise<any>((resolve, reject) => {
      this._resolveFunc = resolve;
      this._rejectFunc = reject;
    });
    window._kaia.androidMultiDetector.engine = this;
    return promise;
  }

  isClosed(): boolean {
    return this._closed;
  }

  close(): void {
    this._closed = true;
    let res = JSON.parse(window._kaia.androidMultiDetectorClose(''));
    if (res.err)
      throw(res.err);
    this._clearCallback();
    this._listener = null;
  }

  setEventListener(listener: Function | null): void {
    this._listener = listener;
  }
}

export async function createAndroidMultiDetector(params: any) {
  const androidMultiDetector = new AndroidMultiDetector();
  return androidMultiDetector.init(params);
}
