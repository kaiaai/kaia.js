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
export class Sensors {
  _closed: boolean = false;
  _listener: any;
  static initialized: boolean = false;

  static singleton(): any {
    return (window._kaia && window._kaia.sensors) ?
      window._kaia.sensors.engine : undefined;
  }

  constructor() {
    if (window._kaia === undefined)
      throw 'Sensors require Android Kaia.ai app to run';
    if (Sensors.singleton())
      throw 'Only one instance allowed';

    window._kaia.sensors = function() {};
    window._kaia.sensors.engine = this;
    window._kaia.sensors.cb = function(jsonString: string) {
      const opRes = JSON.parse(jsonString);
      const obj = window._kaia.sensors.engine;
      if (obj._listener)
        obj._listener(opRes.err, opRes);
    };
  }

  async init(params: any): Promise<any> {
    if (Sensors.initialized)
      return Promise.reject('Already initialized');

    params = params || {};
    this.setEventListener(params.eventListener);

    Sensors.initialized = true;
    const res = JSON.parse(window._kaia.sensorsInit(JSON.stringify(params)));
    return res.err ? Promise.reject(res.err) : Promise.resolve(this);
  }

  list(): any {
    if (this.closed())
      throw 'Sensors instance has been closed';

    return JSON.parse(window._kaia.sensorsList(''));
  }

  configure(params: any): any {
    if (this.closed())
      throw 'Sensors instance has been closed';
    if (!params)
      throw 'Parameters object required';

    return JSON.parse(window._kaia.sensorsConfigure(JSON.stringify(params)));
  }

  describe(params: any): any {
    if (this.closed())
      throw 'Sensors instance has been closed';
    if (!params)
      throw 'Argument required';
    if (Array.isArray(params))
      params = {sensors: params};

    return JSON.parse(window._kaia.sensorsDescribe(JSON.stringify(params)));
  }

  closed(): boolean {
    return this._closed;
  }

  close(): void {
    this._closed = true;
    let res = JSON.parse(window._kaia.sensorsClose());
    if (res.err)
      throw res.err;
    this._listener = null;
  }

  setEventListener(listener: any): void {
    if (!listener || typeof listener === 'function')
      this._listener = listener;
  }
}

export async function createSensors(params: any) {
  const sensors = Sensors.singleton() || new Sensors();
  return Sensors.initialized ? Promise.resolve(sensors) : sensors.init(params);
}
