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
export declare class PocketSphinx {
    readonly _handle: number;
    _resolveFunc: Function | null;
    _rejectFunc: Function | null;
    _configured: boolean;
    constructor();
    configure(params: any, model: ArrayBuffer): Promise<any>;
    _clearCallback(): void;
    _resolve(res: any): void;
    _reject(err: any): void;
    listen(params: any): Promise<any>;
    _makePromise(res: any): Promise<any>;
    isClosed(): boolean;
    close(): void;
}
export declare function createPocketSphinx(params: any, model: ArrayBuffer): Promise<PocketSphinx>;
