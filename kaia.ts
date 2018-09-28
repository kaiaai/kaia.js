export class TfMobile {
  readonly _handle: number;

  constructor(model: ArrayBuffer, params: any) {

    if (window._kaia === undefined)
      throw('kaia.js requires Android Kaia.ai app to run');

    console.log('TfMobile constructor called');

    if (window._kaia.tfmobile === undefined) {
      window._kaia.tfmobile = function () {};
      window._kaia.tfmobile.engine = [];
      window._kaia.tfmobile.cb = function (jsonString: string) {
        const opResult = JSON.parse(unescape(jsonString));
        console.log(opResult);
      };
    }
    window._kaia.tfmobile.engine.push(this);
    this._handle = window._kaia.tfmobile.engine.length - 1;
    console.log('_handle = ' + this._handle);

    const modelDecoded = new TextDecoder("iso-8859-1").decode(model); // must use Chrome
    params = params || {};
    params.handle = this._handle;
    let result = JSON.parse(window._kaia.tfmobileInit(modelDecoded, JSON.stringify(params)));
    if (result.err)
      throw('Error in constructor ' + result.err);
  }

  run(data: ArrayBuffer[], params: any) {
    if (this.isClosed())
      throw('Engine instance has been closed');
    const textDecoder = new TextDecoder("iso-8859-1");
    let dataDecoded = [];
    for (let i = 0; i < data.length; i++)
      dataDecoded[i] = textDecoder.decode(data[i]);
    params = params || {};
    params.handle = this._handle;

    return JSON.parse(window._kaia.tfmobileRun(dataDecoded, JSON.stringify(params)));
  }

  isClosed() {
    return window._kaia.tfmobile.engine[this._handle] === null;
  }

  close() {
    let params = { handle: this._handle };
    window._kaia.tfmobile.engine[this._handle] = null;
    return window._kaia.tfmobileClose(params);
  }
}
