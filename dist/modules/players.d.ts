import { Base, IDotaWikiConfig } from '../utils/base';
export interface IPlayer {
    handle: string;
    isCaptain: boolean;
    joinDate?: string;
    name?: string;
    photo?: string;
    position?: string;
    region?: string;
}
export declare class DotaPlayers extends Base {
    constructor(config: IDotaWikiConfig);
}
