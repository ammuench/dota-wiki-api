import { DPCRankings, IRank, IRankKey } from './modules/dpc-rankings';

export interface DotaWikiConfig {
    userAgentValue: string;
}

export class DotaWikiApi {
    private dpc: DPCRankings;
    private config: DotaWikiConfig;
    
    /**
     * Creates an instance of DotaWikiApi.  
     *
     * @param {DotaWikiConfig} config Configuration object for starting DotaWikiApi
     * @memberof DotaWikiApi
     */
    constructor(config: DotaWikiConfig) {
        this.dpc = new DPCRankings(this.config.userAgentValue);
    }

    /**
     * Fetches rank object of team at given rank value
     *
     * @param {string} rank Rank number (as string)
     * @returns {Promise<IRank>}
     * @memberof DotaWikiApi
     */
    public getTeamByStanding(rank: number): Promise<IRank> {
        return new Promise((resolve, reject) => {
            const stringRank = rank.toString();
            this.dpc.getRankByStanding(stringRank)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    /**
     * Fetches rank object of team at with a matching name, returns a promise.
     * Team name is not case sensitive
     *
     * @param {string} teamName
     * @returns {Promise<IRank>}
     * @memberof DotaWikiApi
     */
    public getRankByStanding(teamName: string): Promise<IRank> {
        return new Promise((resolve, reject) => {
            this.dpc.getRankByTeam(teamName)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    /**
     * Fetches Map of all teams with DPC Points.
     * Returns map on success, string w/ error code on error
     * Map ordered by rank, shows ineligible teams
     *
     * @returns {Promise<Map<IRankKey, IRank> | string>}
     * @memberof DotaWikiApi
     */
    public getAllRanks(): Promise<Map<IRankKey, IRank> | string> {
        return new Promise((resolve, reject) => {
            this.dpc.getRankings()
                .then((res: Map<IRankKey, IRank>) => {
                    resolve(res);
                })
                .catch((err: string) => {
                    reject(err);
                })
        });
    }
}
