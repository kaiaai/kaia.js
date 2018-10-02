export declare class TfMobile {
    readonly _handle: number;
    _resolveFunc: Function | null;
    _rejectFunc: Function | null;
    _modelLoaded: boolean;
    constructor();
    loadModel(model: ArrayBuffer, params: any): Promise<any>;
    _clearCallback(): void;
    _resolve(res: any): void;
    _reject(err: any): void;
    run(data: ArrayBuffer[], params: any): Promise<any>;
    _makePromise(res: any): Promise<any>;
    isClosed(): boolean;
    close(): void;
}
export declare function createTfMobile(model: ArrayBuffer, params: any): Promise<TfMobile>;
