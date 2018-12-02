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
  _resolveFunc: Function | null = null;
  _rejectFunc: Function | null = null;
  _closed: boolean = false;
  _listener: Function | null = null;
  static initialized: boolean = false;

  static singleton(): any {
    return (window._kaia && window._kaia.deviceSettings) ?
      window._kaia.deviceSettings.engine : undefined;
  }

  constructor() {
    if (window._kaia === undefined)
      throw 'DeviceSettings requires Android Kaia.ai app to run';
    if (DeviceSettings.singleton())
      throw 'Only one instance allowed';

    window._kaia.deviceSettings = function() {};
    window._kaia.deviceSettings.engine = this;
    window._kaia.deviceSettings.cb = function(jsonString: string) {
      const opRes = JSON.parse(jsonString);
      const obj = window._kaia.deviceSettings.engine; // get this
      if (opRes.event === 'configure' || opRes.event === 'getConfig') {
        if (opRes.err)
          obj._reject(opRes.err);
        else if (!opRes.err)
          obj._resolve(opRes.event === 'configure' ? obj : opRes);
      }
      if (obj._listener != null)
        obj._listener(opRes.err, opRes);
    };
  }

  async init(params: any): Promise<any> {
    if (DeviceSettings.initialized)
      return Promise.reject('Already initialized');
    if (params && typeof params.eventListener === 'function')
      this.setEventListener(params.eventListener);

    DeviceSettings.initialized = true;
    return (typeof params === 'object') ? this.configure(params) : Promise.resolve(this);
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

  async configure(params: any): Promise<any> {
    if (!params)
      return Promise.resolve(this);
    if (this.isClosed())
      return Promise.reject('DeviceSettings instance has been closed');

    params = params || {};
    const res = JSON.parse(window._kaia.deviceSettingsConfigure(JSON.stringify(params)));
    return this._makePromise(res);
  }

  async getConfig(): Promise<any> {
    if (this.isClosed())
      return Promise.reject('DeviceSettings instance has been closed');

    const res = JSON.parse(window._kaia.deviceSettingsGetConfig(''));
    return this._makePromise(res);
  }

  _makePromise(res: any, ): Promise<any> {
    if (res.err)
      return Promise.reject(res.err);

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
    let res = JSON.parse(window._kaia.deviceSettingsClose());
    if (res.err)
      throw res.err;
    this._clearCallback();
    this._listener = null;
  }

  setEventListener(listener: Function | null): void {
    this._listener = listener;
  }
}

export async function createDeviceSettings(params: any) {
  const deviceSettings = DeviceSettings.singleton() || new DeviceSettings();

  return DeviceSettings.initialized ? deviceSettings.configure(params) :
    deviceSettings.init(params);
}
