"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cachefetch_1 = require("../modules/cachefetch");
class Base {
    constructor(config) {
        this.userAgentValue = config.userAgentValue;
        this.cacheFetch = new cachefetch_1.CacheFetch(!!config.useHttps);
    }
}
exports.Base = Base;
