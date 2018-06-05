import { DotaWikiApi } from './index';

const myDotaWikiApi = new DotaWikiApi();

myDotaWikiApi.getAllRanks()
    .then((res) => {
        console.log(res);
    });
