import { Request, RequestInit } from 'node-fetch';
export declare class CacheFetch {
    urlStub: string;
    private apiCache;
    private lastFetch;
    constructor(useHttps?: boolean);
    cacheFetch(url: string | Request, init?: RequestInit): Promise<any>;
    checkRedirect(response: any, requestInfo: any): Promise<any>;
    fakeFetch(url: string | Request, init?: RequestInit): Promise<any>;
    private _canFetchNew(currentTime);
}
