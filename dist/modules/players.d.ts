import { Base, IDotaWikiConfig } from '../utils/base';
export interface IPlayer {
    handle: string;
    name: string;
    photo: string;
    position: string[];
    region?: string[];
    birthday?: string;
    earnings?: string;
    team?: string;
}
export declare class DotaPlayers extends Base {
    constructor(config: IDotaWikiConfig);
    getPlayerInfo(playerName: string): Promise<any>;
    private _parsePlayer(teamHtml, displayTitle);
    private _parseBirthday(birthdayText);
    private _parseRegions(regionHtml);
    private _parseRoles(rolesHtml);
    private _trimDate(dateStr);
    private _trimName(name);
}
