"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cachefetch_1 = require("../modules/cachefetch");
class Base {
    constructor(config) {
        this.cacheFetch = new cachefetch_1.CacheFetch();
        this.userAgentValue = config.userAgentValue;
    }
}
exports.Base = Base;
