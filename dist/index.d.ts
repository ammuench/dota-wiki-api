import { IRank, IRankKey } from './modules/dpc-rankings';
import { IPlayer } from './modules/players';
import { ITeam, ITeamMember } from './modules/teams';
import { IDotaWikiConfig } from './utils/base';
export { IDotaWikiConfig, IPlayer, IRank, IRankKey, ITeam, ITeamMember };
export declare class DotaWikiApi {
    private dpc;
    private dPlayer;
    private dTeam;
    constructor(config: IDotaWikiConfig);
    getTeamByStanding(rank: number): Promise<IRank>;
    getRankByTeamname(teamName: string): Promise<IRank>;
    getAllRanks(): Promise<Map<IRankKey, IRank>>;
    getTeam(teamName: string): Promise<ITeam>;
    getPlayer(playerName: string): Promise<IPlayer>;
}
