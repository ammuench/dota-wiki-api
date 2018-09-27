import { CacheFetch } from '../modules/cachefetch';

export interface IDotaWikiConfig {
    userAgentValue: string;
    useHttps?: boolean;
}

export class Base {
    public cacheFetch: CacheFetch;
    public userAgentValue: string;

    /**
     * Creates an instance of DotaTeams.
     * @param {string} userAgentValue User Agent to be passed on every fetch call (per Liquipedia rules)
     * @memberof DPCRankings
     */
    constructor(config: IDotaWikiConfig) {
        this.userAgentValue = config.userAgentValue;
        this.cacheFetch = new CacheFetch(!!config.useHttps);
    }
}
