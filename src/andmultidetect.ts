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
  _resolveFunc: Function | null = null;
  _rejectFunc: Function | null = null;
  _closed: boolean = false;
  _listener: any;
  static initialized: boolean = false;

  static singleton(): any {
    return (window._kaia && window._kaia.androidMultiDetector) ?
      window._kaia.androidMultiDetector.engine : undefined;
  }

  constructor() {
    if (window._kaia === undefined)
      throw 'AndroidMultiDetector requires Android Kaia.ai app to run';
    if (AndroidMultiDetector.singleton())
      throw 'Only one instance allowed';

    window._kaia.androidMultiDetector = function() {};
    window._kaia.androidMultiDetector.engine = this;
    window._kaia.androidMultiDetector.cb = function(jsonString: string) {
      const opRes = JSON.parse(unescape(jsonString));
      const obj = window._kaia.androidMultiDetector.engine;
      if (opRes.event === 'init')
        if (opRes.err)
          obj._reject(opRes.err);
        else
          obj._resolve(obj);
      if (obj._listener)
        obj._listener(opRes.err, opRes);
    };
  }

  async init(params: any): Promise<any> {
    if (AndroidMultiDetector.initialized)
      return Promise.reject('Already initialized');

    // TODO mark initialized if res success
    AndroidMultiDetector.initialized = true;
    params = params || {};
    this.setEventListener(params.eventListener);
    
    let res = JSON.parse(window._kaia.androidMultiDetectorInit(JSON.stringify(params)));
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

  async detect(params: any): Promise<any> {
    if (this.closed())
      return Promise.reject('AndroidMultiDetector instance has been closed');
    if (params === undefined)
      params = {enabled: true};
    else if (typeof params === 'boolean')
      params = {enabled: params};
    else if (params instanceof ArrayBuffer) {
      const textDecoder = new TextDecoder('iso-8859-1');
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
    return promise;
  }

  closed(): boolean {
    return this._closed;
  }

  close(): void {
    this._closed = true;
    let res = JSON.parse(window._kaia.androidMultiDetectorClose(''));
    if (res.err)
      throw res.err;
    this._clearCallback();
    this._listener = null;
  }

  setEventListener(listener: any): void {
    if (!listener || typeof listener === 'function')
      this._listener = listener;
  }
}

export async function createAndroidMultiDetector(params: any) {
  const androidMultiDetector = AndroidMultiDetector.singleton() ||
    new AndroidMultiDetector();

  return AndroidMultiDetector.initialized ? Promise.resolve(androidMultiDetector) :
    androidMultiDetector.init(params);
}
