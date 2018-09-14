import { Base, IDotaWikiConfig } from '../utils/base';
import { IPlayer } from './players';
export interface ITeam {
    name: string;
    roster: IPlayer[];
    teamLogo?: string;
    location?: string;
    region: string;
    manager?: string;
    captain?: string;
    earnings?: string;
    rank?: string;
}
export declare class DotaTeams extends Base {
    constructor(config: IDotaWikiConfig);
    getTeamInfo(teamName: string): Promise<ITeam>;
    private _checkRedirect(teamJson, requestInfo);
    private _parseTeam(teamHtml, displayTitle);
    private _trimDate(dateStr);
    private _trimName(name);
}
