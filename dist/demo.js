"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const myConfig = {
    userAgentValue: 'GADotaSuite/0.0.1 (https://github.com/ammuench/google-assistant-dota)',
};
const myDotaWikiApi = new index_1.DotaWikiApi(myConfig);
myDotaWikiApi.getTeam('VGJ.Storm')
    .then((res) => {
    console.log(res);
})
    .catch((err) => {
    console.log(err);
});
