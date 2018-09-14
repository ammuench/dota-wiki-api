import { DotaWikiApi, IDotaWikiConfig, IRank, IRankKey } from './index';
import { DotaTeams } from './modules/teams';

const myConfig: IDotaWikiConfig = {
    userAgentValue: 'GADotaSuite/0.0.1 (https://github.com/ammuench/google-assistant-dota)',
};

const myDotaWikiApi = new DotaWikiApi(myConfig);

// myDotaWikiApi.getAllRanks()
//     .then((res: Map<IRankKey, IRank>) => {
//         console.log(res);
//     })
//     .catch((err: string) => {
//         console.log(err);
//     });

// const dTeam = new DotaTeams(myConfig);

myDotaWikiApi.getTeam('VGJ.Storm')
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
