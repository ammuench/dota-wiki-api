import fetch, { Request, RequestInit } from 'node-fetch';

import { dpcTable } from './cache';

export class CacheFetch {
    private apiCache: any = {};
    private lastFetch = new Date('1-1-1970');

    /**
     * Does a new fetch of data or fetches a cached version of the api call
     *
     * @param {(string | Request)} url Fetch URI or URI Request Object
     * @param {RequestInit} [init] Fetch options (headers, etc)
     * @returns {Promise<any>}
     * @memberof CacheFetch
     */
    public cacheFetch(url: string | Request, init?: RequestInit): Promise<any> {
        return new Promise((resolve, reject) => {
            if (this._canFetchNew(new Date())) {
                fetch(url, init)
                    .then((res) => {
                        this.lastFetch = new Date();
                        const json = res.json();
                        this.apiCache[url.toString()] = json;
                        resolve(json);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            } else {
                if (this.apiCache[url.toString()]) {
                    resolve(this.apiCache[url.toString()]);
                } else {
                    reject();
                }
            }
        });
    }

    public fakeFetch(url: string | Request, init?: RequestInit): Promise<any> {
        return new Promise((resolve, reject) => {
            resolve(dpcTable);
        });
    }

    /**
     * Checks to see if client can make a fetch request or if it needs to use a cached request
     *
     * @private
     * @param {Date} currentTime Timestamp of current
     * @returns {boolean} True if the fetch request can be made
     * @memberof CacheFetch
     */
    private _canFetchNew(currentTime: Date): boolean {
        if (currentTime.getTime() - this.lastFetch.getTime() >= 3000) {
            return true;
        }

        return false;
    }
}
