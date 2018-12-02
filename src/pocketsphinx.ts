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
  static _created: boolean = false;
  _closed: boolean = false;
  _listener: Function | null = null;

  constructor() {
  }

  _extractArrayBufs(params: any): any[] {
    const data:any[] = [];
    const fileNames:any[] = [];

    const textDecoder = new TextDecoder("iso-8859-1");

    if (params.searchFile) {
      if (!Array.isArray(params.searchFile))
        throw 'searchFile must be an array';
      params.searchFile.forEach((item:any) => {
        fileNames.push(item.fileName);
        // Must use Chrome
        data.push(textDecoder.decode(item.file || ''));
      });
    }
    params.searchFile = fileNames;

    // TODO check it's ArrayBuffer
    if (params.modelZip) {
      data.push(textDecoder.decode(params.modelZip));
      delete params.modelZip;
    }
    return data;
  }

  async init(params: any): Promise<any> {
    if (window._kaia === undefined)
      return Promise.reject('PocketSphinx requires Android Kaia.ai app to run');

    if (window._kaia.pocketSphinx === undefined) {
      window._kaia.pocketSphinx = function() {};
      window._kaia.pocketSphinx.engine = this;
      window._kaia.pocketSphinx.cb = function(jsonString: string) {
        const opRes = JSON.parse(unescape(jsonString));
        const obj = window._kaia.pocketSphinx.engine;
        if (opRes.event === 'init' && (obj._rejectFunc != null) && (obj._resolveFunc != null))
          opRes.err ? obj._rejectFunc(opRes.err) : obj._resolveFunc(opRes);
        if (obj._listener != null)
          obj._listener(opRes.err, opRes);
      };
    }

    if (PocketSphinx._created)
      return Promise.reject('Only one instance allowed');
    PocketSphinx._created = true;

    params = params || {};
    if (typeof params.eventListener === 'function')
      this.setEventListener(params.eventListener);

    const data = this._extractArrayBufs(params);
    let res = JSON.parse(window._kaia.pocketSphinxInit(JSON.stringify(params), data));
    return this._makePromise(res);
  }

  async addSearch(params: any): Promise<any> {
    params = params || {};
    const data = this._extractArrayBufs(params);
    let res = JSON.parse(window._kaia.pocketSphinxAddSearch(JSON.stringify(params), data));
    return this._makePromise(res);
  }

  _clearCallback(): void {
    this._resolveFunc = null;
    this._rejectFunc = null;
    window._kaia.pocketSphinx.engine = null;
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

  async listen(params: any): Promise<any> {
    if (this.isClosed())
      return Promise.reject('PocketSphinx instance has been closed');
    if (params == undefined)
      params = {cmd: "listen"};
    else if (typeof params == 'boolean')
      params = params ? {cmd: "listen"} : {cmd: "cancel"};
    else if (typeof params == 'string')
      params = {cmd: "listen", searchName: params};

    let res = JSON.parse(window._kaia.pocketSphinxListen(JSON.stringify(params)));
    return this._makePromise(res);
  }

  _makePromise(res: any): Promise<any> {
    if (res.err)
      return Promise.reject(res.err);

    let promise = new Promise<any>((resolve, reject) => {
      this._resolveFunc = resolve;
      this._rejectFunc = reject;
    });
    window._kaia.pocketSphinx.engine = this;
    return promise;
  }

  isClosed(): boolean {
    return this._closed;
  }

  close(): void {
    this._closed = true;
    let res = JSON.parse(window._kaia.pocketSphinxClose());
    if (res.err)
      throw res.err;
    this._clearCallback();
    this._listener = null;
  }

  setEventListener(listener: Function | null): void {
    this._listener = listener;
  }
}

export async function createPocketSphinx(params: any) {
  const pocketSphinx = new PocketSphinx();
  return pocketSphinx.init(params);
}
