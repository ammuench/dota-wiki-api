import { Base, IDotaWikiConfig } from '../utils/base';
export interface ITeam {
    name: string;
    roster: ITeamMember[];
    teamLogo?: string;
    location?: string;
    region: string;
    manager?: string;
    captain?: string;
    earnings?: string;
    rank?: string;
}
export interface ITeamMember {
    handle: string;
    isCaptain: boolean;
    joinDate: string;
    name: string;
    position: string;
    region: string;
}
export declare class DotaTeams extends Base {
    constructor(config: IDotaWikiConfig);
    getTeamInfo(teamName: string): Promise<ITeam>;
    private _parseTeam(teamHtml, displayTitle);
    private _trimDate(dateStr);
    private _trimName(name);
}
