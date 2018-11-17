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
export class Serial {
   readonly _handle: number;
  _resolveFunc: Function | null = null;
  _rejectFunc: Function | null = null;
  _initialized: boolean = false;
  static _created: boolean = false;
  _closed: boolean = false;
  _listener: Function | null = null;

  constructor() {

    if (window._kaia === undefined)
      throw('Serial requires Android Kaia.ai app to run');

    if (window._kaia.serial === undefined) {
      window._kaia.serial = function () {};
      window._kaia.serial.engine = [];
      window._kaia.serial.cb = function (jsonString: string) {
        const opRes = JSON.parse(jsonString);
        const obj = window._kaia.serial.engine[0];
        if (opRes.event === "serialUsbReady" && (obj._resolveFunc != null))
          obj._resolveFunc(opRes.event);
        if ((opRes.event === "usbNotSupported" || opRes.event === "usbDeviceNotWorking" ||
          opRes.event === "cdcDriverNotWorking") && (obj._rejectFunc != null))
          obj._rejectFunc(opRes.event);
        if (obj._listener != null)
          obj._listener(opRes.err, opRes);
      };
    }

    if (Serial._created)
      throw('Only one instance allowed');

    window._kaia.serial.engine.push(this);
    this._handle = window._kaia.serial.engine.length - 1;
    Serial._created = true;
  }

  init(params: any): Promise<any> {
    if (this._initialized)
      throw("Already initialized");
    this._initialized = true;

    params = params || {};
    let res = JSON.parse(window._kaia.serialInit(JSON.stringify(params)));
    return this._makePromise(res);
  }

  _clearCallback(): void {
    this._resolveFunc = null;
    this._rejectFunc = null;
    window._kaia.serial.engine[this._handle] = null;
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

  write(params: any): any {
    if (this.isClosed())
      throw('Serial instance has been closed');
    if (typeof params === 'string')
      params = {message: params};

    return JSON.parse(window._kaia.serialWrite(JSON.stringify(params)));
  }

  _makePromise(res: any): Promise<any> {
    if (res.err)
      throw(res.err);

    let promise = new Promise<any>((resolve, reject) => {
      this._resolveFunc = resolve;
      this._rejectFunc = reject;
    });
    window._kaia.serial.engine[this._handle] = this;
    return promise;
  }

  isClosed(): boolean {
    return this._closed;
  }

  close(): void {
    this._closed = true;
    let res = JSON.parse(window._kaia.serialClose());
    if (res.err)
      throw(res.err);
    this._clearCallback();
    this._listener = null;
  }

  setEventListener(listener: Function | null): void {
    this._listener = listener;
  }
}

export async function createSerial(params: any) {
  const serial = new Serial();
  const res = await serial.init(params || {});
  if (res !== "serialUsbReady")
    throw(res);
  return serial;
}
