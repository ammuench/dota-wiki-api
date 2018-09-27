import { DPCRankings, IRank, IRankKey } from './modules/dpc-rankings';
import { DotaPlayers, IPlayer } from './modules/players';
import { DotaTeams, ITeam, ITeamMember } from './modules/teams';
import { IDotaWikiConfig } from './utils/base';

export { IDotaWikiConfig, IPlayer, IRank, IRankKey, ITeam, ITeamMember };

export class DotaWikiApi {
    private dpc: DPCRankings;
    private dPlayer: DotaPlayers;
    private dTeam: DotaTeams;

    /**
     * Creates an instance of DotaWikiApi.
     *
     * @param {DotaWikiConfig} config Configuration object for starting DotaWikiApi
     * @memberof DotaWikiApi
     */
    constructor(config: IDotaWikiConfig) {
        this.dpc = new DPCRankings(config);
        this.dPlayer = new DotaPlayers(config);
        this.dTeam = new DotaTeams(config);
    }

    /**
     * Fetches rank object of team at given rank value
     *
     * @param {string} rank Rank number (as string)
     * @returns {Promise<IRank>}
     * @memberof DotaWikiApi
     */
    public async getTeamByStanding(rank: number): Promise<IRank> {
        return this.dpc.getRankByStanding(rank.toString());
    }

    /**
     * Fetches rank object of team at with a matching name, returns a promise.
     * Team name is not case sensitive
     *
     * @param {string} teamName
     * @returns {Promise<IRank>}
     * @memberof DotaWikiApi
     */
    public async getRankByTeamname(teamName: string): Promise<IRank> {
        return this.dpc.getRankByTeam(teamName);
    }

    /**
     * Fetches Map of all teams with DPC Points.
     * Returns map on success, string w/ error code on error
     * Map ordered by rank, shows ineligible teams
     *
     * @returns {Promise<Map<IRankKey, IRank>>}
     * @memberof DotaWikiApi
     */
    public async getAllRanks(): Promise<Map<IRankKey, IRank>> {
        return this.dpc.getRankings();
    }

    /**
     * Fetches a team's roster & basic information
     *
     * @param {string} teamName Name of team
     * @returns {Promise<ITeam>}
     * @memberof DotaWikiApi
     */
    public async getTeam(teamName: string): Promise<ITeam> {
        return this.dTeam.getTeamInfo(teamName);
    }

    /**
     * Fetches a player's basic information
     *
     * @param {string} playerName Name of team
     * @returns {Promise<IPlayer>}
     * @memberof DotaWikiApi
     */
    public async getPlayer(playerName: string): Promise<IPlayer> {
        return this.dPlayer.getPlayerInfo(playerName);
    }
}
