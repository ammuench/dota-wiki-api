import { IRank, IRankKey } from './modules/dpc-rankings';
import { IPlayer } from './modules/players';
import { ITeam } from './modules/teams';
import { IDotaWikiConfig } from './utils/base';
export { IDotaWikiConfig, IPlayer, IRank, IRankKey, ITeam };
export declare class DotaWikiApi {
    private dpc;
    private dTeam;
    constructor(config: IDotaWikiConfig);
    getTeamByStanding(rank: number): Promise<IRank>;
    getRankByTeamname(teamName: string): Promise<IRank>;
    getAllRanks(): Promise<Map<IRankKey, IRank>>;
    getTeam(teamName: string): Promise<ITeam>;
}
