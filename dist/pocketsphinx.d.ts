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
    _resolveFunc: Function | null;
    _rejectFunc: Function | null;
    static _created: boolean;
    _closed: boolean;
    _listener: Function | null;
    constructor();
    _extractArrayBufs(params: any): any[];
    init(params: any): Promise<any>;
    addSearch(params: any): Promise<any>;
    _clearCallback(): void;
    _resolve(res: any): void;
    _reject(err: any): void;
    listen(params: any): Promise<any>;
    _makePromise(res: any): Promise<any>;
    isClosed(): boolean;
    close(): void;
    setEventListener(listener: Function | null): void;
}
export declare function createPocketSphinx(params: any): Promise<any>;
