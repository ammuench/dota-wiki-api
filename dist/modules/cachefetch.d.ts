import { Request, RequestInit } from 'node-fetch';
export declare class CacheFetch {
    private apiCache;
    private lastFetch;
    cacheFetch(url: string | Request, init?: RequestInit): Promise<any>;
    fakeFetch(url: string | Request, init?: RequestInit): Promise<any>;
    private _canFetchNew(currentTime);
}
