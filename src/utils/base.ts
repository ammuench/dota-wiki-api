import { CacheFetch } from '../modules/cachefetch';

export interface IDotaWikiConfig {
    userAgentValue: string;
}

export class Base {
    public cacheFetch = new CacheFetch();
    public userAgentValue: string;

    /**
     * Creates an instance of DotaTeams.
     * @param {string} userAgentValue User Agent to be passed on every fetch call (per Liquipedia rules)
     * @memberof DPCRankings
     */
    constructor(config: IDotaWikiConfig) {
        this.userAgentValue = config.userAgentValue;
    }
}
