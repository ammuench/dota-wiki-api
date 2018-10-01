import { DotaWikiApi, IDotaWikiConfig, IRank, IRankKey } from './index';
import { DotaMatches } from './modules/matches';

const myConfig: IDotaWikiConfig = {
    userAgentValue: 'GADotaSuite/0.0.1 (https://github.com/ammuench/google-assistant-dota)',
};

const myDotaWikiApi = new DotaMatches(myConfig);

// myDotaWikiApi.getAllRanks()
//     .then((res: Map<IRankKey, IRank>) => {
//         console.log(res);
//     })
//     .catch((err: string) => {
//         console.log(err);
//     });

// const dTeam = new DotaTeams(myConfig);

myDotaWikiApi.getMatchList()
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
