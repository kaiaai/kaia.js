export class TfMobile {
  constructor(model: ArrayBuffer, params: any) {

    if (window._kaia === undefined)
      throw('kaia.js requires Android Kaia.ai app to run');

    console.log('TfMobile constructor called');

    const modelDecoded = new TextDecoder("iso-8859-1").decode(model);
    return JSON.parse(window._kaia.tfmobileInit(modelDecoded, JSON.stringify(params || {})));
  }

  run(data: ArrayBuffer[], params: any) {
    const textDecoder = new TextDecoder("iso-8859-1");
    let dataDecoded = [];
    for (let i = 0; i < data.length; i++) {
      dataDecoded[i] = textDecoder.decode(data[i]);
    }

    return JSON.parse(window._kaia.tfmobileRun(dataDecoded, JSON.stringify(params || {})));
  }

  close() {
    return window._kaia.tfmobileClose();
  }
}
