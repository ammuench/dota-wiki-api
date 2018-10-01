"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matches_1 = require("./modules/matches");
const myConfig = {
    userAgentValue: 'GADotaSuite/0.0.1 (https://github.com/ammuench/google-assistant-dota)',
};
const myDotaWikiApi = new matches_1.DotaMatches(myConfig);
myDotaWikiApi.getMatchList()
    .then((res) => {
    console.log(res);
})
    .catch((err) => {
    console.log(err);
});
