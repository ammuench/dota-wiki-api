import fetch, { Request, RequestInit } from 'node-fetch';

import { dpcTable } from './cache';

export class CacheFetch {
    public urlStub = 'https://liquipedia.net/dota2/api.php';

    private apiCache: any = {};
    private lastFetch = new Date('1-1-1970');

    constructor(useHttps = true) {
        this.urlStub = useHttps
            ? 'https://liquipedia.net/dota2/api.php'
            : 'http://liquipedia.net/dota2/api.php';
    }

    /**
     * Does a new fetch of data or fetches a cached version of the api call
     *
     * @param {(string | Request)} url Fetch URI or URI Request Object
     * @param {RequestInit} [init] Fetch options (headers, etc)
     * @returns {Promise<any>}
     * @memberof CacheFetch
     */
    public async cacheFetch(url: string | Request, init?: RequestInit): Promise<any> {
        return new Promise((resolve, reject) => {
            this._canFetchNew(new Date())
                .then(() => {
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
                });
        });
    }

    public async checkRedirect(response: any, requestInfo: any): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            try {
                if (response.parse.text['*'].indexOf('Redirect to:') !== -1) {
                    const redirectMatch = /\/dota2\/(.+)(" title)/.exec(response.parse.text['*']);
                    if (redirectMatch) {
                        const redirectURL = (redirectMatch[1].indexOf('.') !== -1)
                            ? `${this.urlStub}?action=parse&origin=*&format=json&page=${redirectMatch[1]}&*`
                            : `${this.urlStub}?action=parse&origin=*&format=json&page=${redirectMatch[1]}`;
                        this.cacheFetch(redirectURL, requestInfo)
                            .then((rdJson) => {
                                resolve(rdJson);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    } else {
                        reject('Invalid URL.  This likely means your page query value is incorrect or has no match');
                    }
                } else {
                    resolve(response);
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Fake fetch that uses the data in cache.ts to avoid making excessive network calls
     *
     * @param {(string | Request)} url
     * @param {RequestInit} [init]
     * @returns {Promise<any>}
     * @memberof CacheFetch
     */
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
    private _canFetchNew(currentTime: Date): Promise<void> {
        return new Promise<void>((resolve) => {
            const waitTime = (currentTime.getTime() - this.lastFetch.getTime());
            if (currentTime.getTime() - this.lastFetch.getTime() >= 3000) {
                resolve();
            } else {
                setTimeout(() => {
                    resolve();
                }, (3000 - waitTime));
            }
        });
    }
}
