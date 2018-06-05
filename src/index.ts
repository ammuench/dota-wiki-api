import { DPCRankings, IRank, IRankKey } from './modules/dpc-rankings';

interface IConfig {
    userAgentKey: string;
}

export class DotaWikiApi {
    private dpc: DPCRankings;
    private config: IConfig;

    constructor() {
        this.config = require('../config.json');
        this.dpc = new DPCRankings(this.config.userAgentKey);
    }

    public getTeamByStanding(rank: number): Promise<IRank> {
        return new Promise((resolve, reject) => {
            const stringRank = rank.toString();
            this.dpc.getRankByStanding(stringRank)
                .then((res) => {
                    resolve(res);
                });
        });
    }

    public getRankByStanding(teamName: string): Promise<IRank> {
        return new Promise((resolve, reject) => {
            this.dpc.getRankByTeam(teamName)
                .then((res) => {
                    resolve(res);
                });
        });
    }

    public getAllRanks(): Promise<Map<IRankKey, IRank>> {
        return new Promise((resolve, reject) => {
            this.dpc.getRankings()
                .then((res) => {
                    resolve(res);
                });
        });
    }
}
