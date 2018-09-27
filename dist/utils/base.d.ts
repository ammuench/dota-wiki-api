import { CacheFetch } from '../modules/cachefetch';
export interface IDotaWikiConfig {
    userAgentValue: string;
    useHttps?: boolean;
}
export declare class Base {
    cacheFetch: CacheFetch;
    userAgentValue: string;
    constructor(config: IDotaWikiConfig);
}
