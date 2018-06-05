import { DotaWikiApi, DotaWikiConfig } from './index';
import { IRank, IRankKey } from './modules/dpc-rankings';

const myConfig: DotaWikiConfig = {
    userAgentValue: 'GADotaSuite/0.0.1 (https://github.com/ammuench/google-assistant-dota)',
}

const myDotaWikiApi = new DotaWikiApi(myConfig);

myDotaWikiApi.getAllRanks()
    .then((res: Map<IRankKey, IRank>) => {
        console.log(res);
    })
    .catch((err: string) => {
        console.log(err);
    })
