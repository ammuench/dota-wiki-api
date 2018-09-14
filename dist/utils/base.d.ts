import { CacheFetch } from '../modules/cachefetch';
export interface IDotaWikiConfig {
    userAgentValue: string;
}
export declare class Base {
    cacheFetch: CacheFetch;
    userAgentValue: string;
    constructor(config: IDotaWikiConfig);
}
