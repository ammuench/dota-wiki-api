"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const cache_1 = require("./cache");
class CacheFetch {
    constructor(useHttps = true) {
        this.urlStub = 'https://liquipedia.net/dota2/api.php';
        this.apiCache = {};
        this.lastFetch = new Date('1-1-1970');
        this.urlStub = useHttps
            ? 'https://liquipedia.net/dota2/api.php'
            : 'http://liquipedia.net/dota2/api.php';
    }
    cacheFetch(url, init) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    checkRedirect(response, requestInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
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
                        }
                        else {
                            reject('Invalid URL.  This likely means your page query value is incorrect or has no match');
                        }
                    }
                    else {
                        resolve(response);
                    }
                }
                catch (e) {
                    reject(e);
                }
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
