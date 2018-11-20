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
export class DeviceSettings {
   readonly _handle: number;
  _resolveFunc: Function | null = null;
  _rejectFunc: Function | null = null;
  _initialized: boolean = false;
  static _created: boolean = false;
  _closed: boolean = false;
  _listener: Function | null = null;

  constructor() {

    if (window._kaia === undefined)
      throw('DeviceSettings requires Android Kaia.ai app to run');

    if (window._kaia.deviceSettings === undefined) {
      window._kaia.deviceSettings = function () {};
      window._kaia.deviceSettings.engine = [];
      window._kaia.deviceSettings.cb = function (jsonString: string) {
        const opRes = JSON.parse(jsonString);
        const obj = window._kaia.deviceSettings.engine[0];
        if (opRes.event === "getConfig" || opRes.event === "configure") {
          if (opRes.err && (obj._rejectFunc != null))
            obj._rejectFunc(opRes.err);
          else if (!opRes.err && (obj._resolveFunc != null))
            obj._resolveFunc(opRes);
        }
        if (obj._listener != null)
          obj._listener(opRes.err, opRes);
      };
    }

    if (DeviceSettings._created)
      throw("Only one instance allowed");

    window._kaia.deviceSettings.engine.push(this);
    this._handle = window._kaia.deviceSettings.engine.length - 1;
    DeviceSettings._created = true;
  }

  _clearCallback(): void {
    this._resolveFunc = null;
    this._rejectFunc = null;
    window._kaia.deviceSettings.engine[this._handle] = null;
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

  async configure(params: any): Promise<any> {
    if (!params)
      throw('Parameters object required');
    if (this.isClosed())
      throw('DeviceSettings instance has been closed');

    const res = JSON.parse(window._kaia.deviceSettingsConfigure(JSON.stringify(params)));
    return this._makePromise(res);
  }

  async getConfig(): Promise<any> {
    if (this.isClosed())
      throw('DeviceSettings instance has been closed');

    const res = JSON.parse(window._kaia.deviceSettingsGetConfig(''));
    return this._makePromise(res);
  }

  _makePromise(res: any): Promise<any> {
    if (res.err)
      throw(res.err);

    let promise = new Promise<any>((resolve, reject) => {
      this._resolveFunc = resolve;
      this._rejectFunc = reject;
    });
    window._kaia.deviceSettings.engine[this._handle] = this;
    return promise;
  }

  isClosed(): boolean {
    return this._closed;
  }

  close(): void {
    this._closed = true;
    let res = JSON.parse(window._kaia.deviceSettingsClose());
    if (res.err)
      throw(res.err);
    this._clearCallback();
    this._listener = null;
  }

  setEventListener(listener: Function | null): void {
    this._listener = listener;
  }
}

export function createDeviceSettings() {
  return new DeviceSettings();
}
