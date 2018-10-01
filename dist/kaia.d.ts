export declare class TfMobile {
    readonly _handle: number;
    _resolvePromise: Function | null;
    _rejectPromise: Function | null;
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
