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
export class TextToSpeech {
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
      return Promise.reject('TextToSpeech requires Android Kaia.ai app to run');
    if (this._handle !== -1)
      return Promise.reject('Already initialized');

    if (window._kaia.textToSpeech === undefined) {
      window._kaia.textToSpeech = function() {};
      window._kaia.textToSpeech.engine = this;
      window._kaia.textToSpeech.cb = function(jsonString: string) {
        const opRes = JSON.parse(jsonString);
        const obj = window._kaia.textToSpeech.engine;
        if (opRes.event === 'init' || opRes.event === 'done' || opRes.event === 'error') {
          if (opRes.err && (obj._rejectFunc != null))
            obj._rejectFunc(opRes.err);
          else if (!opRes.err && (obj._resolveFunc != null))
            obj._resolveFunc(opRes.event === 'init' ? this : opRes.event);
        }
        if (obj._listener != null)
          obj._listener(opRes.err, opRes);
      };
    }

    if (TextToSpeech._created)
      return Promise.reject('Only one instance allowed');
    TextToSpeech._created = true;

    if (params && typeof params.eventListener === 'function')
      this.setEventListener(params.eventListener);

    let res = JSON.parse(window._kaia.textToSpeechInit(JSON.stringify(params || {})));

    return params ? this._makePromise(res).then(this.configure(params)) :
      this._makePromise(res);
  }

  _clearCallback(): void {
    this._resolveFunc = null;
    this._rejectFunc = null;
    window._kaia.textToSpeech.engine[this._handle] = null;
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

  async speak(params: any): Promise<any> {
    if (this.isClosed())
      throw('TextToSpeech instance has been closed');
    if (typeof params === 'string')
      params = {text: params};

    let res = JSON.parse(window._kaia.textToSpeechSpeak(JSON.stringify(params)));
    return this._makePromise(res);
  }

  configure(params: any): any {
    if (!params)
      throw('Parameters object required');
    if (this.isClosed())
      throw('TextToSpeech instance has been closed');

    return JSON.parse(window._kaia.textToSpeechConfigure(JSON.stringify(params)));
  }

  getConfig(): any {
    if (this.isClosed())
      throw('TextToSpeech instance has been closed');

    return JSON.parse(window._kaia.textToSpeechGetConfig(''));
  }

  _makePromise(res: any): Promise<any> {
    if (res.err)
      throw(res.err);

    let promise = new Promise<any>((resolve, reject) => {
      this._resolveFunc = resolve;
      this._rejectFunc = reject;
    });
    window._kaia.textToSpeech.engine[this._handle] = this;
    return promise;
  }

  isClosed(): boolean {
    return this._closed;
  }

  close(): void {
    this._closed = true;
    let res = JSON.parse(window._kaia.textToSpeechClose());
    if (res.err)
      throw(res.err);
    this._clearCallback();
    this._listener = null;
  }

  setEventListener(listener: Function | null): void {
    this._listener = listener;
  }
}

export async function createTextToSpeech(params: any) {
  const textToSpeech = new TextToSpeech();
  return textToSpeech.init(params);
}
