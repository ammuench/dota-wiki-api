"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const cache_1 = require("./cache");
class CacheFetch {
    constructor() {
        this.apiCache = {};
        this.lastFetch = new Date('1-1-1970');
    }
    cacheFetch(url, init) {
        return new Promise((resolve, reject) => {
            this._canFetchNew(new Date())
                .then(() => {
                node_fetch_1.default(url, init)
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
    fakeFetch(url, init) {
        return new Promise((resolve, reject) => {
            resolve(cache_1.dpcTable);
        });
    }
    _canFetchNew(currentTime) {
        return new Promise((resolve) => {
            const waitTime = (currentTime.getTime() - this.lastFetch.getTime());
            if (currentTime.getTime() - this.lastFetch.getTime() >= 3000) {
                resolve();
            }
            else {
                setTimeout(() => {
                    resolve();
                }, (3000 - waitTime));
            }
        });
    }
}
exports.CacheFetch = CacheFetch;
